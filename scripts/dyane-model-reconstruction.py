import hashlib
import json
import math
import os
import sys
from pathlib import Path

TEMP_NUMPY = Path('/private/tmp/dyane-blender-numpy')
if TEMP_NUMPY.exists():
    sys.path.insert(0, str(TEMP_NUMPY))

import bmesh
import bpy
from mathutils import Matrix, Vector
from mathutils.kdtree import KDTree


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ORIGINAL_GLB = Path('/Users/elisaevrard/Downloads/dyane.glb 3')
SOURCE_BLEND = PROJECT_ROOT / 'assets/models/dyane-web-v2.blend'
V2_GLB = PROJECT_ROOT / 'public/models/dyane-web-v2.glb'
REFERENCE_FILES = {
    'front': Path('/Users/elisaevrard/Desktop/DYANE-FULL/1.png'),
    'profile': Path('/Users/elisaevrard/Desktop/DYANE-FULL/2.png'),
    'three-quarter': Path('/Users/elisaevrard/Desktop/DYANE-FULL/3.png'),
    'back': Path('/Users/elisaevrard/Desktop/DYANE-FULL/4.png'),
}
ADDITIONAL_REFERENCE_FILES = {
    'front-studio': PROJECT_ROOT / 'public/dyane-no1.webp',
}
OUTPUT_ROOT = PROJECT_ROOT / 'assets/models/reconstruction'
EXPORT_DIR = OUTPUT_ROOT / 'exports'
VALIDATION_DIR = OUTPUT_ROOT / 'validation'
RENDER_ROOT = OUTPUT_ROOT / 'renders'
REPORT_PATH = OUTPUT_ROOT / 'reconstruction-report.json'
EXPORT_PATH = EXPORT_DIR / 'dyane-web-v3-candidate.glb'
VALIDATION_BLEND = VALIDATION_DIR / 'dyane-web-v3-reimport.blend'

BLEND_PATHS = {
    'v00': OUTPUT_ROOT / 'dyane-reconstruction-v00-import.blend',
    'v01': OUTPUT_ROOT / 'dyane-reconstruction-v01-proportions.blend',
    'v02': OUTPUT_ROOT / 'dyane-reconstruction-v02-head-hands.blend',
    'v03': OUTPUT_ROOT / 'dyane-reconstruction-v03-scarf-base.blend',
    'v04': OUTPUT_ROOT / 'dyane-reconstruction-v04-topology.blend',
    'v05': OUTPUT_ROOT / 'dyane-reconstruction-v05-export.blend',
}

OBJECT_NAMES = ('Body', 'Scarf', 'Cap', 'Base', 'Signature')
BASE_HEIGHT = 0.215
BASE_RADIUS = 0.31


def sha256(path):
    digest = hashlib.sha256()
    with open(path, 'rb') as handle:
        while chunk := handle.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def smoothstep(edge0, edge1, value):
    if edge0 == edge1:
        return 0.0
    t = max(0.0, min(1.0, (value - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)


def bell(value, low, peak, high):
    return smoothstep(low, peak, value) * (1.0 - smoothstep(peak, high, value))


def band(value, low, high, feather):
    return smoothstep(low, low + feather, value) * (1.0 - smoothstep(high - feather, high, value))


def gaussian3(coordinate, center, radii):
    delta = coordinate - center
    distance_squared = sum((delta[index] / radii[index]) ** 2 for index in range(3))
    return math.exp(-0.5 * distance_squared)


def ensure_directories():
    for directory in (OUTPUT_ROOT, EXPORT_DIR, VALIDATION_DIR, RENDER_ROOT):
        directory.mkdir(parents=True, exist_ok=True)
    for stage in BLEND_PATHS:
        (RENDER_ROOT / stage).mkdir(parents=True, exist_ok=True)


def collection(name):
    result = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(result)
    return result


def move_to_collection(obj, target):
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    target.objects.link(obj)


def imported_objects(path, target_collection):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path), import_shading='NORMALS')
    result = [obj for obj in bpy.data.objects if obj not in before]
    for obj in result:
        move_to_collection(obj, target_collection)
    return result


def lock_reference(objects, prefix):
    for obj in objects:
        obj.name = f'{prefix}_{obj.name}'
        obj.hide_select = True
        obj.hide_render = True
        obj.hide_viewport = True
        obj['reference_locked'] = True


def find_working_mesh(objects, geometry_name):
    for obj in objects:
        if obj.type == 'MESH' and geometry_name in obj.data.name:
            return obj
    raise RuntimeError(f'Working mesh not found: {geometry_name}')


def bake_world_transform(obj):
    obj.data.transform(obj.matrix_world)
    obj.matrix_world = Matrix.Identity(4)
    obj.parent = None


def build_material(name, color, roughness, coat_weight, coat_roughness):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = (*color, 1.0)
    material.metallic = 0.0
    material.roughness = roughness
    material.use_backface_culling = False
    principled = material.node_tree.nodes.get('Principled BSDF')
    if principled:
        values = {
            'Base Color': (*color, 1.0),
            'Metallic': 0.0,
            'Roughness': roughness,
            'IOR': 1.5,
            'Coat Weight': coat_weight,
            'Coat Roughness': coat_roughness,
        }
        for input_name, value in values.items():
            if input_name in principled.inputs:
                principled.inputs[input_name].default_value = value
    return material


def assign_material(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)


def create_materials():
    return {
        'Body': build_material('Porcelain_Ivory', (0.91, 0.82, 0.70), 0.24, 0.22, 0.14),
        'Scarf': build_material('Glaze_Bordeaux', (0.225, 0.007, 0.023), 0.165, 0.48, 0.095),
        'Cap': build_material('Porcelain_Cap', (0.91, 0.82, 0.70), 0.255, 0.20, 0.155),
        'Base': build_material('Porcelain_Base', (0.86, 0.78, 0.67), 0.30, 0.16, 0.18),
        'Signature': build_material('Signature_Dark', (0.03, 0.022, 0.018), 0.46, 0.0, 0.25),
    }


def duplicate_working_object(source, name, target_collection):
    duplicate = source.copy()
    duplicate.data = source.data.copy()
    duplicate.name = name
    duplicate.data.name = f'{name}_Geometry'
    target_collection.objects.link(duplicate)
    bake_world_transform(duplicate)
    duplicate.hide_select = False
    duplicate.hide_render = False
    duplicate.hide_viewport = False
    duplicate['source'] = 'assets/models/dyane-web-v2.blend'
    duplicate['reconstruction_role'] = name
    return duplicate


def setup_working_objects():
    original_collection = collection('REFERENCE_ORIGINAL_LOCKED')
    v2_collection = collection('REFERENCE_V2_LOCKED')
    working_collection = collection('WORKING_V3')

    original_objects = imported_objects(ORIGINAL_GLB, original_collection)
    lock_reference(original_objects, 'ORIGINAL')

    source_objects = {}
    for name in ('Body', 'Scarf', 'Cap', 'Signature'):
        source = bpy.data.objects.get(name)
        if source is None or source.type != 'MESH':
            raise RuntimeError(f'Missing required object in source blend: {name}')
        source_objects[name] = source

    source_base_marker = bpy.data.objects.get('Base')
    if source_base_marker is not None and source_base_marker.type != 'MESH':
        bpy.data.objects.remove(source_base_marker, do_unlink=True)

    for source in source_objects.values():
        move_to_collection(source, v2_collection)
    lock_reference(list(source_objects.values()), 'V2')
    working = {
        name: duplicate_working_object(source, name, working_collection)
        for name, source in source_objects.items()
    }

    return working, original_collection, v2_collection


def setup_references_and_cameras():
    reference_collection = collection('PHOTO_REFERENCES')
    all_references = {**REFERENCE_FILES, **ADDITIONAL_REFERENCE_FILES}
    for index, (angle, path) in enumerate(all_references.items()):
        image = bpy.data.images.load(str(path), check_existing=True)
        empty = bpy.data.objects.new(f'Reference_{angle}', None)
        empty.empty_display_type = 'IMAGE'
        empty.data = image
        empty.empty_display_size = 2.0
        empty.location = (4.0 + index * 2.5, 4.0, 1.0)
        empty.hide_render = True
        empty['angle'] = angle
        empty['source_path'] = str(path)
        reference_collection.objects.link(empty)

    camera_collection = collection('CALIBRATED_CAMERAS')
    cameras = {}
    camera_specs = {
        'front': ((0.0, -1.0, 0.0), 72.0),
        'profile': ((-1.0, 0.0, 0.0), 75.0),
        'three-quarter': ((-0.62, -0.78, 0.0), 70.0),
        'back': ((0.0, 1.0, 0.0), 72.0),
    }
    for angle, (direction, lens) in camera_specs.items():
        data = bpy.data.cameras.new(f'Camera_{angle}')
        data.lens = lens
        data.sensor_width = 36.0
        camera = bpy.data.objects.new(f'Camera_{angle}', data)
        camera['reference_angle'] = angle
        camera['reference_file'] = str(REFERENCE_FILES[angle])
        camera['calibration'] = 'Perspective approximation from the supplied full-object photograph.'
        camera['direction'] = direction
        camera_collection.objects.link(camera)
        cameras[angle] = camera
    return cameras


def setup_studio():
    studio = collection('RENDER_STUDIO')
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, -0.002))
    ground = bpy.context.object
    ground.name = 'Studio_Ground'
    move_to_collection(ground, studio)
    ground_mat = build_material('Studio_Ground_Material', (0.74, 0.71, 0.68), 0.88, 0.0, 0.3)
    assign_material(ground, ground_mat)

    lights = [
        ('Key_Softbox', 'AREA', (-3.5, -4.5, 5.5), 950.0, 4.0),
        ('Fill_Softbox', 'AREA', (3.5, -2.0, 3.3), 420.0, 3.0),
        ('Rim_Softbox', 'AREA', (2.0, 3.5, 4.0), 520.0, 3.2),
    ]
    for name, light_type, location, energy, size in lights:
        data = bpy.data.lights.new(name, light_type)
        data.energy = energy
        data.shape = 'RECTANGLE'
        data.size = size
        data.color = (1.0, 0.94, 0.86) if 'Key' in name else (0.84, 0.90, 1.0)
        obj = bpy.data.objects.new(name, data)
        obj.location = location
        obj.rotation_euler = (math.radians(25), 0.0, math.radians(35 if location[0] < 0 else -35))
        studio.objects.link(obj)

    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 480
    scene.render.resolution_y = 600
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = 'RGBA'
    if scene.world is None:
        scene.world = bpy.data.worlds.new('Dyane_Studio_World')
    scene.world.color = (0.78, 0.75, 0.72)
    scene.view_settings.look = 'AgX - Medium High Contrast'
    return studio


def visible_working_objects(working):
    return [obj for obj in working.values() if obj and obj.name in bpy.data.objects]


def bounds(objects):
    minimum = Vector((math.inf, math.inf, math.inf))
    maximum = Vector((-math.inf, -math.inf, -math.inf))
    for obj in objects:
        if obj.type != 'MESH':
            continue
        for vertex in obj.data.vertices:
            point = obj.matrix_world @ vertex.co
            minimum.x = min(minimum.x, point.x)
            minimum.y = min(minimum.y, point.y)
            minimum.z = min(minimum.z, point.z)
            maximum.x = max(maximum.x, point.x)
            maximum.y = max(maximum.y, point.y)
            maximum.z = max(maximum.z, point.z)
    return minimum, maximum


def point_camera(camera, target, position):
    camera.location = position
    camera.rotation_euler = (target - position).to_track_quat('-Z', 'Y').to_euler()


def fit_camera(camera, direction, objects):
    minimum, maximum = bounds(objects)
    dimensions = maximum - minimum
    target = (minimum + maximum) * 0.5
    target.z = minimum.z + dimensions.z * 0.50
    vertical_fov = camera.data.angle_y
    distance = dimensions.z / (2.0 * math.tan(vertical_fov * 0.5)) * 1.12
    direction_vector = Vector(direction).normalized()
    position = target + direction_vector * distance
    position.z += dimensions.z * 0.015
    point_camera(camera, target, position)
    camera.data.dof.use_dof = False
    camera.data.clip_start = max(0.001, distance * 0.01)
    camera.data.clip_end = distance * 4.0


def render_stage(stage, cameras, working):
    stage_dir = RENDER_ROOT / stage
    objects = visible_working_objects(working)
    scene = bpy.context.scene
    for angle, camera in cameras.items():
        fit_camera(camera, camera['direction'], objects)
        scene.camera = camera
        scene.render.filepath = str(stage_dir / f'{angle}.png')
        bpy.ops.render.render(write_still=True)


def render_neutral_stage(stage, cameras, working):
    neutral = build_material('Sculpture_Neutral_Clay', (0.63, 0.60, 0.57), 0.62, 0.0, 0.25)
    view_layer = bpy.context.view_layer
    previous_override = view_layer.material_override
    view_layer.material_override = neutral
    objects = visible_working_objects(working)
    scene = bpy.context.scene
    for angle, camera in cameras.items():
        fit_camera(camera, camera['direction'], objects)
        scene.camera = camera
        scene.render.filepath = str(RENDER_ROOT / stage / f'neutral-{angle}.png')
        bpy.ops.render.render(write_still=True)
    view_layer.material_override = previous_override


def render_closeups(stage, working, names=None):
    scene = bpy.context.scene
    previous_resolution = (scene.render.resolution_x, scene.render.resolution_y)
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    minimum, maximum = bounds(visible_working_objects(working))
    dimensions = maximum - minimum
    center = (minimum + maximum) * 0.5

    cap_minimum, cap_maximum = bounds([working['Cap']])
    scarf_minimum, scarf_maximum = bounds([working['Scarf']])
    detail_specs = {
        'face': ((cap_minimum + cap_maximum) * 0.5, dimensions.z * 0.25),
        'left-hand': (
            Vector((minimum.x + dimensions.x * 0.17, center.y, minimum.z + dimensions.z * 0.36)),
            dimensions.z * 0.20,
        ),
        'right-hand': (
            Vector((minimum.x + dimensions.x * 0.70, center.y, minimum.z + dimensions.z * 0.58)),
            dimensions.z * 0.20,
        ),
        'scarf-folds': ((scarf_minimum + scarf_maximum) * 0.5, dimensions.z * 0.48),
        'base': (
            Vector((center.x, center.y, minimum.z + dimensions.z * 0.06)),
            dimensions.z * 0.18,
        ),
    }

    detail_collection = bpy.data.collections.get('DETAIL_CAMERAS') or collection('DETAIL_CAMERAS')
    selected_details = detail_specs if names is None else {
        name: detail_specs[name] for name in names
    }
    for name, (target, region_height) in selected_details.items():
        camera_name = f'Camera_detail_{name}'
        camera = bpy.data.objects.get(camera_name)
        if camera is None:
            camera_data = bpy.data.cameras.new(camera_name)
            camera_data.lens = 80.0
            camera_data.sensor_width = 36.0
            camera = bpy.data.objects.new(camera_name, camera_data)
            detail_collection.objects.link(camera)
        distance = region_height / (2.0 * math.tan(camera.data.angle_y * 0.5)) * 1.12
        position = target + Vector((0.0, -distance, 0.0))
        point_camera(camera, target, position)
        scene.camera = camera
        scene.render.filepath = str(RENDER_ROOT / stage / f'detail-{name}.png')
        bpy.ops.render.render(write_still=True)

    scene.render.resolution_x, scene.render.resolution_y = previous_resolution


def save_stage(stage):
    bpy.context.scene['reconstruction_stage'] = stage
    bpy.context.scene['original_sha256'] = sha256(ORIGINAL_GLB)
    bpy.context.scene['v2_sha256'] = sha256(V2_GLB)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATHS[stage]), compress=True)


def remove_collection_and_objects(target):
    for obj in list(target.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(target)


def adjacency_smooth(obj, predicate, factor=0.15, iterations=1):
    mesh = obj.data
    adjacency = [[] for _ in mesh.vertices]
    for edge in mesh.edges:
        a, b = edge.vertices
        adjacency[a].append(b)
        adjacency[b].append(a)
    for _ in range(iterations):
        source = [vertex.co.copy() for vertex in mesh.vertices]
        updates = {}
        for vertex in mesh.vertices:
            if not predicate(source[vertex.index]) or not adjacency[vertex.index]:
                continue
            average = Vector((0.0, 0.0, 0.0))
            for neighbor in adjacency[vertex.index]:
                average += source[neighbor]
            average /= len(adjacency[vertex.index])
            updates[vertex.index] = source[vertex.index].lerp(average, factor)
        for index, coordinate in updates.items():
            mesh.vertices[index].co = coordinate
    mesh.update()


def phase_v01_proportions(working):
    body = working['Body']
    body_displaced = 0
    for vertex in body.data.vertices:
        original = vertex.co.copy()
        co = vertex.co

        if co.z > 0.22:
            if co.z <= 1.20:
                co.z = 0.22 + (co.z - 0.22) * 0.96
            else:
                co.z = 1.1608 + (co.z - 1.20) * 0.94

        upper_body = smoothstep(0.82, 1.42, original.z)
        waist_fill = bell(original.z, 0.92, 1.24, 1.56)
        co.x *= 1.0 - 0.105 * upper_body + 0.055 * waist_fill

        chest = bell(original.z, 1.38, 1.58, 1.78)
        front = smoothstep(0.045, 0.17, -original.y)
        center = 1.0 - smoothstep(0.12, 0.27, abs(original.x))
        co.y += 0.040 * chest * front * center

        abdomen = bell(original.z, 1.02, 1.26, 1.47)
        co.y -= 0.014 * abdomen * front * center

        back = smoothstep(0.025, 0.14, original.y)
        co.y -= 0.012 * waist_fill * back

        left_arm = smoothstep(0.16, 0.29, -original.x) * band(original.z, 0.84, 1.78, 0.16)
        right_arm = smoothstep(0.15, 0.29, original.x) * band(original.z, 1.30, 1.82, 0.12)
        co.x += 0.034 * left_arm
        co.x -= 0.026 * right_arm

        if (co - original).length > 1e-8:
            body_displaced += 1
    body.data.update()
    body['anatomy_remodel_status'] = 'Silhouette, torso, shoulders, waist and arm envelope geometrically remodeled.'
    body['v01_vertices_displaced'] = body_displaced

    cap = working['Cap']
    pivot = Vector((0.008, 0.0, 1.92))
    cap_displaced = 0
    for vertex in cap.data.vertices:
        original = vertex.co.copy()
        co = vertex.co
        head_weight = smoothstep(1.67, 1.86, co.z)
        relative = co - pivot
        relative.x *= 1.0 + 0.060 * head_weight
        relative.y *= 1.0 + 0.045 * head_weight
        relative.z *= 1.0 + 0.012 * head_weight
        adjusted = pivot + relative
        adjusted.x -= 0.008 * smoothstep(1.80, 2.10, adjusted.z)
        vertex.co = adjusted
        if (adjusted - original).length > 1e-8:
            cap_displaced += 1
    cap.data.update()
    cap['v01_vertices_displaced'] = cap_displaced

    scarf = working['Scarf']
    scarf_displaced = 0
    for vertex in scarf.data.vertices:
        original = vertex.co.copy()
        co = vertex.co
        if co.z > 0.22:
            if co.z <= 1.20:
                co.z = 0.22 + (co.z - 0.22) * 0.96
            else:
                co.z = 1.1608 + (co.z - 1.20) * 0.94
        mass = bell(co.z, 0.18, 0.74, 1.48)
        co.x *= 1.0 + 0.045 * mass
        if co.y > 0.0:
            co.y *= 1.0 + 0.075 * mass
        if co.x > 0.08:
            co.x += 0.028 * mass
        if (co - original).length > 1e-8:
            scarf_displaced += 1
    scarf.data.update()
    scarf['v01_vertices_displaced'] = scarf_displaced


def add_cap_body_join(working, materials):
    cap = working['Cap']
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.112, depth=0.022, location=(0.0, 0.002, 1.775))
    collar = bpy.context.object
    collar.name = 'Cap_Body_Join'
    collar.scale.y = 0.72
    bpy.context.view_layer.objects.active = collar
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = collar.modifiers.new('Rounded porcelain seam', 'BEVEL')
    bevel.width = 0.004
    bevel.segments = 2
    bpy.context.view_layer.objects.active = collar
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    assign_material(collar, materials['Cap'])
    move_to_collection(collar, cap.users_collection[0])

    bpy.ops.object.select_all(action='DESELECT')
    cap.select_set(True)
    collar.select_set(True)
    bpy.context.view_layer.objects.active = cap
    bpy.ops.object.join()
    cap.name = 'Cap'
    cap.data.name = 'Cap_Geometry'
    cap['cap_body_join'] = 'Flattened elliptical porcelain seam, modeled as Cap geometry.'


def add_ellipsoid(name, location, scale, target_collection, segments=48, rings=24, rotation=(0.0, 0.0, 0.0)):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move_to_collection(obj, target_collection)
    return obj


def join_mesh_objects(objects, active, name):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = active
    bpy.ops.object.join()
    active.name = name
    active.data.name = f'{name}_Geometry'
    return active


def voxel_union(obj, voxel_size):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    obj.data.remesh_voxel_size = voxel_size
    obj.data.remesh_voxel_adaptivity = 0.0
    bpy.ops.object.voxel_remesh()
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    obj.data.update()


def smart_project_uv(obj):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    try:
        bpy.ops.uv.smart_project(angle_limit=math.radians(66.0), island_margin=0.02)
    except TypeError:
        bpy.ops.uv.smart_project(island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    obj.select_set(False)


def rebuild_cap_geometry(working, materials):
    previous_cap = working['Cap']
    target_collection = previous_cap.users_collection[0]
    bpy.data.objects.remove(previous_cap, do_unlink=True)

    parts = []
    face = add_ellipsoid('Cap_Face', (0.0, -0.055, 1.975), (0.092, 0.070, 0.142), target_collection, 64, 32)
    for vertex in face.data.vertices:
        relative_z = (vertex.co.z - 1.975) / 0.145
        lower = max(0.0, min(1.0, -relative_z))
        vertex.co.x *= 1.0 - 0.18 * lower
        if vertex.co.y > -0.055:
            vertex.co.y = -0.055 + (vertex.co.y + 0.055) * 0.70
    face.data.update()
    parts.append(face)

    parts.extend([
        add_ellipsoid('Cap_Hair_Back', (0.0, 0.030, 2.015), (0.137, 0.098, 0.178), target_collection, 48, 24),
        add_ellipsoid('Cap_Hair_Crown', (0.0, -0.005, 2.090), (0.135, 0.085, 0.102), target_collection, 56, 28),
        add_ellipsoid('Cap_Hair_Left_Upper', (-0.098, -0.002, 2.020), (0.055, 0.064, 0.085), target_collection, rotation=(0.0, math.radians(-10), math.radians(-8))),
        add_ellipsoid('Cap_Hair_Right_Upper', (0.098, -0.002, 2.020), (0.055, 0.064, 0.085), target_collection, rotation=(0.0, math.radians(10), math.radians(8))),
        add_ellipsoid('Cap_Hair_Left_Mid', (-0.112, 0.006, 1.935), (0.049, 0.060, 0.092), target_collection, rotation=(0.0, math.radians(-12), math.radians(-7))),
        add_ellipsoid('Cap_Hair_Right_Mid', (0.112, 0.006, 1.935), (0.049, 0.060, 0.092), target_collection, rotation=(0.0, math.radians(12), math.radians(7))),
        add_ellipsoid('Cap_Hair_Left_Lower', (-0.122, 0.012, 1.845), (0.040, 0.052, 0.105), target_collection, rotation=(0.0, math.radians(-17), math.radians(-4))),
        add_ellipsoid('Cap_Hair_Right_Lower', (0.122, 0.012, 1.845), (0.040, 0.052, 0.108), target_collection, rotation=(0.0, math.radians(17), math.radians(4))),
        add_ellipsoid('Cap_Fringe_Left', (-0.045, -0.106, 2.080), (0.036, 0.020, 0.072), target_collection, rotation=(0.0, math.radians(-22), math.radians(-7))),
        add_ellipsoid('Cap_Fringe_Right', (0.045, -0.106, 2.080), (0.036, 0.020, 0.072), target_collection, rotation=(0.0, math.radians(22), math.radians(7))),
        add_ellipsoid('Cap_Neck', (0.0, 0.000, 1.795), (0.065, 0.052, 0.125), target_collection, 48, 24),
    ])

    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.112, depth=0.022, location=(0.0, 0.002, 1.775))
    collar = bpy.context.object
    collar.name = 'Cap_Body_Join'
    collar.scale.y = 0.72
    bpy.context.view_layer.objects.active = collar
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move_to_collection(collar, target_collection)
    parts.append(collar)

    cap = join_mesh_objects(parts, face, 'Cap')
    voxel_union(cap, 0.0045)
    adjacency_smooth(cap, lambda co: True, factor=0.12, iterations=2)
    assign_material(cap, materials['Cap'])
    facial_features = [
        add_ellipsoid('Cap_Nose', (0.0, -0.127, 1.985), (0.008, 0.012, 0.023), target_collection, 32, 16),
        add_ellipsoid('Cap_Eyelid_Left', (-0.031, -0.120, 2.018), (0.018, 0.0055, 0.004), target_collection, 32, 16, rotation=(math.radians(7), 0.0, math.radians(-4))),
        add_ellipsoid('Cap_Eyelid_Right', (0.031, -0.120, 2.018), (0.018, 0.0055, 0.004), target_collection, 32, 16, rotation=(math.radians(7), 0.0, math.radians(4))),
        add_ellipsoid('Cap_Lips', (0.0, -0.120, 1.944), (0.020, 0.005, 0.0045), target_collection, 32, 16),
    ]
    for feature in facial_features:
        assign_material(feature, materials['Cap'])
    join_mesh_objects([cap, *facial_features], cap, 'Cap')
    smart_project_uv(cap)
    cap['reconstruction_role'] = 'Cap'
    cap['geometry_rebuild'] = 'Closed localized voxel union of modeled face, hair masses, neck and cap/body seam.'
    cap['cap_body_join'] = 'Flattened elliptical porcelain seam integrated in Cap geometry.'
    working['Cap'] = cap


def remove_old_hand_geometry(body):
    regions = [
        (Vector((-0.250, -0.070, 1.000)), Vector((0.090, 0.125, 0.180)), 'left'),
        (Vector((0.200, -0.155, 1.420)), Vector((0.095, 0.085, 0.115)), 'right'),
    ]
    bm = bmesh.new()
    bm.from_mesh(body.data)
    faces = []
    for face in bm.faces:
        center = face.calc_center_median()
        def inside(region):
            coordinate, radii, side = region
            side_match = center.x < -0.17 if side == 'left' else center.x > 0.13 and center.y < -0.075
            return side_match and sum(((center[axis] - coordinate[axis]) / radii[axis]) ** 2 for axis in range(3)) <= 1.0
        if any(inside(region) for region in regions):
            faces.append(face)
    if faces:
        bmesh.ops.delete(bm, geom=faces, context='FACES')
    loose = [vertex for vertex in bm.verts if not vertex.link_faces]
    if loose:
        bmesh.ops.delete(bm, geom=loose, context='VERTS')
    bm.to_mesh(body.data)
    bm.free()
    body.data.update()
    body['old_hand_faces_removed'] = len(faces)


def build_hand(name, target_collection, center, side):
    parts = []
    if side == 'left':
        palm = add_ellipsoid(f'{name}_Palm', center, (0.034, 0.025, 0.064), target_collection, 40, 20, rotation=(0.0, math.radians(-5), 0.0))
        parts.append(palm)
        parts.append(add_ellipsoid(f'{name}_Wrist', (center[0] + 0.005, center[1] + 0.010, center[2] + 0.105), (0.030, 0.027, 0.078), target_collection, 32, 16, rotation=(0.0, math.radians(-5), 0.0)))
        for index, x_offset in enumerate((-0.023, -0.008, 0.008, 0.023)):
            length = (0.050, 0.056, 0.052, 0.045)[index]
            parts.append(add_ellipsoid(f'{name}_Finger_{index + 1}', (center[0] + x_offset, center[1] - 0.006, center[2] - 0.058), (0.008, 0.009, length), target_collection, 24, 12))
        parts.append(add_ellipsoid(f'{name}_Thumb', (center[0] + 0.038, center[1] - 0.002, center[2] - 0.010), (0.010, 0.012, 0.038), target_collection, 24, 12, rotation=(0.0, math.radians(-28), 0.0)))
    else:
        palm = add_ellipsoid(f'{name}_Palm', center, (0.045, 0.020, 0.031), target_collection, 40, 20, rotation=(0.0, math.radians(-8), math.radians(-8)))
        parts.append(palm)
        parts.append(add_ellipsoid(f'{name}_Wrist', (center[0] + 0.006, center[1] + 0.030, center[2] + 0.060), (0.024, 0.022, 0.056), target_collection, 32, 16, rotation=(0.0, math.radians(-20), math.radians(-8))))
        for index, x_offset in enumerate((-0.038, -0.014, 0.012, 0.036)):
            length = (0.040, 0.047, 0.044, 0.037)[index]
            parts.append(add_ellipsoid(f'{name}_Finger_{index + 1}', (center[0] + x_offset, center[1] - 0.008, center[2] - 0.035), (0.010, 0.010, length), target_collection, 24, 12, rotation=(0.0, math.radians(-12), 0.0)))
        parts.append(add_ellipsoid(f'{name}_Thumb', (center[0] - 0.045, center[1], center[2] + 0.002), (0.009, 0.010, 0.028), target_collection, 24, 12, rotation=(0.0, math.radians(32), 0.0)))
    hand = join_mesh_objects(parts, palm, name)
    voxel_union(hand, 0.003)
    adjacency_smooth(hand, lambda co: True, factor=0.11, iterations=2)
    return hand


def rebuild_hands(working, materials):
    body = working['Body']
    target_collection = body.users_collection[0]
    remove_old_hand_geometry(body)
    left = build_hand('Body_Left_Hand_Rebuild', target_collection, Vector((-0.242, -0.072, 1.010)), 'left')
    right = build_hand('Body_Right_Hand_Rebuild', target_collection, Vector((0.190, -0.155, 1.410)), 'right')
    assign_material(left, materials['Body'])
    assign_material(right, materials['Body'])
    join_mesh_objects([body, left, right], body, 'Body')
    body['hand_geometry_rebuild'] = 'Both scanned hands replaced by simplified closed porcelain volumes with separated fingers.'
    working['Body'] = body


def remodel_original_cap(working, materials):
    cap = working['Cap']
    displaced = 0
    for vertex in cap.data.vertices:
        original = vertex.co.copy()
        co = vertex.co
        face_front = smoothstep(0.045, 0.155, -original.y)
        cheek = bell(original.z, 1.87, 1.965, 2.055) * face_front
        co.x *= 1.0 + 0.035 * cheek
        nose = gaussian3(original, Vector((0.0, -0.158, 1.995)), Vector((0.055, 0.070, 0.075)))
        co.y += 0.018 * nose
        chin = gaussian3(original, Vector((0.0, -0.125, 1.870)), Vector((0.080, 0.080, 0.060)))
        co.y += 0.007 * chin

        hair_height = band(original.z, 1.68, 2.145, 0.055)
        hair_side = smoothstep(0.060, 0.145, abs(original.x)) * hair_height
        co.x += math.copysign(0.012 * hair_side, original.x if original.x else 1.0)
        hair_back = smoothstep(-0.015, 0.120, original.y) * hair_height
        co.y += 0.015 * hair_back
        lower_hair = band(original.z, 1.67, 1.90, 0.045) * (1.0 - face_front)
        co.x *= 1.0 + 0.035 * lower_hair
        co.y *= 1.0 + 0.030 * lower_hair
        if (co - original).length > 1e-8:
            displaced += 1
    cap.data.update()
    cleanup_mesh(cap, smooth=True, weld_exact=True)
    add_cap_body_join(working, materials)
    cap = working['Cap']
    voxel_union(cap, 0.0045)
    adjacency_smooth(
        cap,
        lambda co: co.y < -0.035 and abs(co.x) < 0.145 and 1.82 < co.z < 2.11,
        factor=0.15,
        iterations=3,
    )
    assign_material(cap, materials['Cap'])
    smart_project_uv(cap)
    cap['v02_vertices_displaced_before_remesh'] = displaced
    cap['face_remodel'] = 'Original likeness retained; nose, cheeks and chin adjusted before localized high-resolution Cap remesh.'
    cap['hair_remodel'] = 'Original hair silhouette retained; lateral, rear and lower masses rounded before localized Cap remesh.'
    cap['geometry_rebuild'] = 'Original Cap remodeled and locally voxel-remeshed at 0.0045 scene units; no generic replacement head.'
    working['Cap'] = cap


def extract_hand_region(body, name, predicate):
    mesh = body.data
    selected_polygons = [polygon for polygon in mesh.polygons if predicate(polygon.center)]
    selected_indices = {polygon.index for polygon in selected_polygons}
    vertex_indices = sorted({index for polygon in selected_polygons for index in polygon.vertices})
    remap = {old: new for new, old in enumerate(vertex_indices)}
    coordinates = [mesh.vertices[index].co.copy() for index in vertex_indices]
    faces = [[remap[index] for index in polygon.vertices] for polygon in selected_polygons]

    hand_mesh = bpy.data.meshes.new(f'{name}_Geometry')
    hand_mesh.from_pydata(coordinates, [], faces)
    hand_mesh.update()
    hand = bpy.data.objects.new(name, hand_mesh)
    body.users_collection[0].objects.link(hand)

    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.faces.ensure_lookup_table()
    delete_faces = [face for face in bm.faces if face.index in selected_indices]
    if delete_faces:
        bmesh.ops.delete(bm, geom=delete_faces, context='FACES')
    loose = [vertex for vertex in bm.verts if not vertex.link_faces]
    if loose:
        bmesh.ops.delete(bm, geom=loose, context='VERTS')
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    return hand, len(selected_polygons)


def remodel_original_hands(working, materials):
    body = working['Body']
    left, left_faces = extract_hand_region(
        body,
        'Body_Left_Hand_Remodel',
        lambda co: co.x < -0.17 and 0.82 < co.z < 1.18 and co.y < 0.06,
    )
    right, right_faces = extract_hand_region(
        body,
        'Body_Right_Hand_Remodel',
        lambda co: co.x > 0.13 and 1.30 < co.z < 1.53 and co.y < -0.07,
    )
    for hand in (left, right):
        assign_material(hand, materials['Body'])
        cleanup_mesh(hand, smooth=True, weld_exact=True)
        voxel_union(hand, 0.0032)
        adjacency_smooth(hand, lambda co: True, factor=0.12, iterations=2)
        assign_material(hand, materials['Body'])
    join_mesh_objects([body, left, right], body, 'Body')
    body['hand_geometry_rebuild'] = 'Original hand silhouettes extracted, locally closed/remeshed, simplified and rejoined to Body.'
    body['left_hand_source_faces'] = left_faces
    body['right_hand_source_faces'] = right_faces
    working['Body'] = body


def phase_v02_head_hands(working, materials):
    body = working['Body']
    body_displaced = 0
    for vertex in body.data.vertices:
        original = vertex.co.copy()
        co = vertex.co

        left_arm = smoothstep(0.17, 0.28, -original.x) * band(original.z, 0.82, 1.74, 0.12)
        right_arm = smoothstep(0.14, 0.27, original.x) * band(original.z, 1.30, 1.77, 0.10)
        co.y = -0.055 + (co.y + 0.055) * (1.0 + 0.055 * left_arm)
        co.y = -0.040 + (co.y + 0.040) * (1.0 + 0.060 * right_arm)

        left_hand_weight = gaussian3(original, Vector((-0.265, -0.070, 0.985)), Vector((0.105, 0.145, 0.215)))
        left_hand_center = Vector((-0.255, -0.070, 1.005))
        left_relative = co - left_hand_center
        left_target = left_hand_center + Vector((left_relative.x * 0.88, left_relative.y * 0.90, left_relative.z * 0.84))
        co[:] = co.lerp(left_target, left_hand_weight)

        right_hand_weight = gaussian3(original, Vector((0.205, -0.165, 1.425)), Vector((0.115, 0.105, 0.145)))
        right_hand_center = Vector((0.200, -0.150, 1.430))
        right_relative = co - right_hand_center
        right_target = right_hand_center + Vector((right_relative.x * 0.84, right_relative.y * 0.80, right_relative.z * 0.82))
        co[:] = co.lerp(right_target, right_hand_weight)

        leg_band = band(original.z, 0.22, 1.04, 0.16)
        if original.x < 0.0:
            leg_center = -0.105
        else:
            leg_center = 0.110
        co.x = leg_center + (co.x - leg_center) * (1.0 + 0.065 * leg_band)

        foot = 1.0 - smoothstep(0.25, 0.39, original.z)
        if original.x < 0.0:
            co.x -= 0.010 * foot
        else:
            co.x += 0.012 * foot
        co.y -= 0.008 * foot * smoothstep(0.02, 0.18, -original.y)

        if (co - original).length > 1e-8:
            body_displaced += 1
    body.data.update()
    body['detail_remodel_status'] = 'Both arms, hands, legs and feet geometrically remodeled with local continuous fields.'
    body['v02_vertices_displaced'] = body_displaced

    body['hand_geometry_rebuild'] = 'Original hands retained; proportions simplified by continuous local deformation and controlled smoothing.'
    remodel_original_cap(working, materials)


def separate_base(working, materials):
    body = working['Body']
    mesh = body.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    result = bmesh.ops.bisect_plane(
        bm,
        geom=list(bm.verts) + list(bm.edges) + list(bm.faces),
        plane_co=Vector((0.0, 0.0, BASE_HEIGHT)),
        plane_no=Vector((0.0, 0.0, 1.0)),
        clear_inner=True,
        clear_outer=False,
    )
    cut_edges = [element for element in result.get('geom_cut', []) if isinstance(element, bmesh.types.BMEdge)]
    if cut_edges:
        try:
            bmesh.ops.holes_fill(bm, edges=cut_edges, sides=0)
        except Exception:
            pass
    bmesh.ops.delete(bm, geom=[vertex for vertex in bm.verts if not vertex.link_faces], context='VERTS')
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()

    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=BASE_RADIUS, depth=BASE_HEIGHT, location=(0, 0, BASE_HEIGHT * 0.5))
    base = bpy.context.object
    base.name = 'Base'
    base.data.name = 'Base_Geometry'
    working_collection = body.users_collection[0]
    move_to_collection(base, working_collection)
    bevel = base.modifiers.new('Soft porcelain edges', 'BEVEL')
    bevel.width = 0.012
    bevel.segments = 3
    bevel.limit_method = 'ANGLE'
    bpy.context.view_layer.objects.active = base
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    bake_world_transform(base)
    assign_material(base, materials['Base'])
    base['reconstruction_role'] = 'Base'
    working['Base'] = base

    signature = working['Signature']
    signature_delta = -BASE_RADIUS - min(vertex.co.y for vertex in signature.data.vertices) - 0.001
    for vertex in signature.data.vertices:
        vertex.co.y += signature_delta
    signature.data.update()


def phase_v03_scarf_base(working, materials):
    scarf = working['Scarf']
    scarf_displaced = 0
    for vertex in scarf.data.vertices:
        original = vertex.co.copy()
        co = vertex.co
        hip = bell(co.z, 0.72, 1.04, 1.36)
        if co.y < 0.0:
            center_weight = max(0.0, 1.0 - abs(co.x) / 0.34)
            left_sweep = smoothstep(-0.02, 0.20, -co.x)
            co.z -= (0.060 + 0.025 * left_sweep) * hip * center_weight
            co.y -= 0.020 * hip
        right_mass = smoothstep(0.07, 0.22, co.x) * bell(co.z, 0.20, 0.76, 1.40)
        co.x += 0.052 * right_mass
        co.y *= 1.0 + 0.095 * right_mass
        left_mass = smoothstep(0.07, 0.21, -co.x) * bell(co.z, 0.20, 0.78, 1.25)
        co.x -= 0.032 * left_mass
        if co.y > 0.02:
            back_weight = bell(co.z, 0.20, 0.72, 1.25)
            co.y += 0.060 * back_weight
            co.x *= 1.0 + 0.055 * back_weight
            fold_a = math.exp(-((co.x + 0.125) / 0.055) ** 2)
            fold_b = math.exp(-((co.x - 0.015) / 0.065) ** 2)
            fold_c = math.exp(-((co.x - 0.155) / 0.060) ** 2)
            vertical = band(co.z, 0.28, 1.12, 0.16)
            co.y += vertical * (0.018 * fold_a - 0.012 * fold_b + 0.020 * fold_c)
        foot_spread = 1.0 - smoothstep(0.22, 0.48, co.z)
        co.x *= 1.0 + 0.185 * foot_spread
        co.y *= 1.0 + 0.155 * foot_spread
        if co.z < BASE_HEIGHT + 0.006:
            co.z = BASE_HEIGHT + 0.006
        if (co - original).length > 1e-8:
            scarf_displaced += 1
    scarf.data.update()
    scarf['v03_vertices_displaced'] = scarf_displaced
    scarf['geometry_remodel'] = 'Hip sweep, right fall, rear folds and foot spread geometrically remodeled.'
    separate_base(working, materials)


def create_scarf_uv(scarf):
    bpy.ops.object.select_all(action='DESELECT')
    scarf.select_set(True)
    bpy.context.view_layer.objects.active = scarf
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    try:
        bpy.ops.uv.smart_project(angle_limit=math.radians(66.0), island_margin=0.02)
    except TypeError:
        bpy.ops.uv.smart_project(island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    scarf.select_set(False)


def cleanup_mesh(obj, smooth=True, weld_exact=False):
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    if weld_exact:
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=1e-7)
    bmesh.ops.dissolve_degenerate(bm, edges=list(bm.edges), dist=1e-9)
    loose = [vertex for vertex in bm.verts if not vertex.link_faces]
    if loose:
        bmesh.ops.delete(bm, geom=loose, context='VERTS')
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    for polygon in mesh.polygons:
        polygon.use_smooth = smooth
    mesh.update()


def boundary_vertex_indices(obj):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    indices = sorted({vertex.index for edge in bm.edges if edge.is_boundary for vertex in edge.verts})
    bm.free()
    return indices


def snap_shared_scarf_seam(body, scarf, maximum_distance=0.12):
    body_indices = boundary_vertex_indices(body)
    scarf_indices = boundary_vertex_indices(scarf)
    tree = KDTree(len(body_indices))
    for index in body_indices:
        tree.insert(body.data.vertices[index].co, index)
    tree.balance()

    distances = []
    for scarf_index in scarf_indices:
        coordinate = scarf.data.vertices[scarf_index].co
        nearest, _, distance = tree.find(coordinate)
        if distance <= maximum_distance:
            scarf.data.vertices[scarf_index].co = nearest
            distances.append(distance)
    scarf.data.update()
    scarf['shared_seam_vertices_snapped'] = len(distances)
    scarf['shared_seam_maximum_source_gap'] = max(distances, default=0.0)
    scarf['shared_seam_average_source_gap'] = sum(distances) / len(distances) if distances else 0.0


def fill_small_boundary_loops(obj, maximum_vertices=24, maximum_span=0.08):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    boundary_edges = [edge for edge in bm.edges if edge.is_boundary]
    adjacency = {}
    for edge in boundary_edges:
        for vertex in edge.verts:
            adjacency.setdefault(vertex, set()).update(other for other in edge.verts if other != vertex)

    unseen = set(adjacency)
    groups = []
    while unseen:
        seed = unseen.pop()
        stack = [seed]
        vertices = {seed}
        while stack:
            current = stack.pop()
            for neighbor in adjacency[current]:
                if neighbor in unseen:
                    unseen.remove(neighbor)
                    vertices.add(neighbor)
                    stack.append(neighbor)
        groups.append(vertices)

    filled = 0
    for vertices in groups:
        if len(vertices) > maximum_vertices:
            continue
        coordinates = [vertex.co for vertex in vertices]
        minimum = Vector(tuple(min(coordinate[axis] for coordinate in coordinates) for axis in range(3)))
        maximum = Vector(tuple(max(coordinate[axis] for coordinate in coordinates) for axis in range(3)))
        if (maximum - minimum).length > maximum_span:
            continue
        edges = [edge for edge in boundary_edges if all(vertex in vertices for vertex in edge.verts)]
        if edges:
            bmesh.ops.holes_fill(bm, edges=edges, sides=0)
            filled += 1
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()
    obj['small_boundary_loops_filled'] = filled


def phase_v04_topology(working):
    for name, obj in working.items():
        before_vertices = len(obj.data.vertices)
        cleanup_mesh(obj, smooth=name not in {'Signature', 'Base'}, weld_exact=name != 'Signature')
        obj['v04_exact_duplicate_vertices_removed'] = before_vertices - len(obj.data.vertices)
        obj['v04_weld_policy'] = 'Only vertices coincident within 1e-7 inside this same node; loop UVs preserved.'

    if 'geometry_rebuild' not in working['Cap']:
        adjacency_smooth(
            working['Cap'],
            lambda co: co.y < -0.035 and abs(co.x) < 0.145 and 1.82 < co.z < 2.11,
            factor=0.24,
            iterations=5,
        )
        adjacency_smooth(
            working['Cap'],
            lambda co: 1.68 < co.z < 2.15 and not (co.y < -0.035 and abs(co.x) < 0.145),
            factor=0.09,
            iterations=2,
        )
    adjacency_smooth(
        working['Body'],
        lambda co: (
            ((co.x < -0.17) and 0.80 < co.z < 1.18)
            or ((co.x > 0.12) and 1.30 < co.z < 1.52)
        ),
        factor=0.16,
        iterations=3,
    )
    snap_shared_scarf_seam(working['Body'], working['Scarf'])
    fill_small_boundary_loops(working['Body'])
    fill_small_boundary_loops(working['Scarf'])
    cleanup_mesh(working['Body'], smooth=True)
    cleanup_mesh(working['Scarf'], smooth=True)
    cleanup_mesh(working['Cap'], smooth=True)
    create_scarf_uv(working['Scarf'])


def scale_to_reference_height(working, target_height=0.42):
    minimum, maximum = bounds(visible_working_objects(working))
    scale = target_height / (maximum.z - minimum.z)
    for obj in visible_working_objects(working):
        world_matrix = obj.matrix_world.copy()
        inverse_world_matrix = world_matrix.inverted()
        for vertex in obj.data.vertices:
            world_coordinate = world_matrix @ vertex.co
            scaled_world_coordinate = Vector((
                world_coordinate.x * scale,
                world_coordinate.y * scale,
                (world_coordinate.z - minimum.z) * scale,
            ))
            vertex.co = inverse_world_matrix @ scaled_world_coordinate
        obj.data.update()
    return scale


def mesh_report(obj):
    mesh = obj.data
    mesh.calc_loop_triangles()
    bm = bmesh.new()
    bm.from_mesh(mesh)
    degenerate = sum(1 for face in bm.faces if face.calc_area() <= 1e-16)
    boundary = sum(1 for edge in bm.edges if edge.is_boundary)
    non_manifold = sum(1 for edge in bm.edges if not edge.is_manifold and not edge.is_boundary)
    loose = sum(1 for vertex in bm.verts if not vertex.link_faces)
    bm.free()
    return {
        'name': obj.name,
        'vertices': len(mesh.vertices),
        'triangles': len(mesh.loop_triangles),
        'materials': [material.name for material in mesh.materials],
        'uv_layers': [layer.name for layer in mesh.uv_layers],
        'degenerate_faces': degenerate,
        'boundary_edges': boundary,
        'non_manifold_edges_excluding_boundaries': non_manifold,
        'loose_vertices': loose,
        'bounds': {
            'min': list(bounds([obj])[0]),
            'max': list(bounds([obj])[1]),
        },
    }


def stage_snapshot(stage, working):
    minimum, maximum = bounds(visible_working_objects(working))
    return {
        'stage': stage,
        'bounds': {'min': list(minimum), 'max': list(maximum)},
        'dimensions': list(maximum - minimum),
        'objects': [mesh_report(obj) for obj in visible_working_objects(working)],
    }


def export_candidate(working):
    bpy.ops.object.select_all(action='DESELECT')
    for name in OBJECT_NAMES:
        working[name].select_set(True)
    bpy.context.view_layer.objects.active = working['Body']
    bpy.ops.export_scene.gltf(
        filepath=str(EXPORT_PATH),
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials='EXPORT',
        export_normals=True,
        export_texcoords=True,
    )


def validate_reimport():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(EXPORT_PATH), import_shading='NORMALS')
    imported = [obj for obj in bpy.data.objects if obj not in before and obj.type == 'MESH']
    by_name = {obj.name: obj for obj in imported}
    missing = [name for name in OBJECT_NAMES if name not in by_name]
    minimum, maximum = bounds(imported)
    reports = [mesh_report(obj) for obj in imported]
    validation = {
        'missing_nodes': missing,
        'nodes': sorted(by_name),
        'materials': sorted({material.name for obj in imported for material in obj.data.materials}),
        'dimensions': list(maximum - minimum),
        'base_on_ground': abs(minimum.z) <= 1e-5,
        'height_42cm': abs((maximum.z - minimum.z) - 0.42) <= 1e-4,
        'objects': reports,
    }
    bpy.context.scene['validation'] = json.dumps(validation)
    bpy.ops.wm.save_as_mainfile(filepath=str(VALIDATION_BLEND), compress=True)
    return validation


def main():
    ensure_directories()
    for required in (
        ORIGINAL_GLB,
        SOURCE_BLEND,
        V2_GLB,
        *REFERENCE_FILES.values(),
        *ADDITIONAL_REFERENCE_FILES.values(),
    ):
        if not required.exists():
            raise FileNotFoundError(required)

    previous_candidate = {
        'sha256': 'acb436510e82b04e98e3dd2a80c4e72457182486c3d54bc5bb9535904832b01c',
        'size_bytes': 1914644,
        'git_backup_commit': 'bcb5030',
    }

    bpy.ops.wm.open_mainfile(filepath=str(SOURCE_BLEND))
    working, original_collection, v2_collection = setup_working_objects()
    materials = create_materials()
    for name, obj in working.items():
        assign_material(obj, materials[name])
    cameras = setup_references_and_cameras()
    setup_studio()
    snapshots = []

    bpy.context.scene['model_policy'] = 'Original and V2 locked; WORKING_V3 is the only editable collection.'
    bpy.context.scene['reference_limit'] = 'No dedicated close-ups; local edits remain conservative.'
    bpy.context.scene['source_blend'] = str(SOURCE_BLEND)
    snapshots.append(stage_snapshot('v00', working))
    render_stage('v00', cameras, working)
    render_neutral_stage('v00', cameras, working)
    save_stage('v00')

    phase_v01_proportions(working)
    snapshots.append(stage_snapshot('v01', working))
    render_stage('v01', cameras, working)
    render_neutral_stage('v01', cameras, working)
    save_stage('v01')

    phase_v02_head_hands(working, materials)
    snapshots.append(stage_snapshot('v02', working))
    render_stage('v02', cameras, working)
    render_neutral_stage('v02', cameras, working)
    render_closeups('v02', working, names=('face', 'left-hand', 'right-hand'))
    save_stage('v02')

    phase_v03_scarf_base(working, materials)
    snapshots.append(stage_snapshot('v03', working))
    render_stage('v03', cameras, working)
    render_neutral_stage('v03', cameras, working)
    render_closeups('v03', working, names=('face',))
    save_stage('v03')

    phase_v04_topology(working)
    snapshots.append(stage_snapshot('v04', working))
    render_stage('v04', cameras, working)
    render_neutral_stage('v04', cameras, working)
    render_closeups('v04', working, names=('face',))
    save_stage('v04')

    scale_factor = scale_to_reference_height(working, 0.42)
    snapshots.append(stage_snapshot('v05', working))
    render_stage('v05', cameras, working)
    render_neutral_stage('v05', cameras, working)
    render_closeups('v05', working)
    save_stage('v05')
    export_candidate(working)

    validation = validate_reimport()
    report = {
        'blender_version': bpy.app.version_string,
        'source_blend': {'path': str(SOURCE_BLEND), 'sha256': sha256(SOURCE_BLEND)},
        'original': {'path': str(ORIGINAL_GLB), 'sha256': sha256(ORIGINAL_GLB)},
        'v2': {'path': str(V2_GLB), 'sha256': sha256(V2_GLB)},
        'previous_candidate': previous_candidate,
        'candidate': {
            'path': str(EXPORT_PATH),
            'sha256': sha256(EXPORT_PATH),
            'size_bytes': EXPORT_PATH.stat().st_size,
        },
        'reference_files': {
            angle: str(path)
            for angle, path in {**REFERENCE_FILES, **ADDITIONAL_REFERENCE_FILES}.items()
        },
        'scale_to_42cm': scale_factor,
        'snapshots': snapshots,
        'validation': validation,
    }
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print('DYANE_RECONSTRUCTION_COMPLETE')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
