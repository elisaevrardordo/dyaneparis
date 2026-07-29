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


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ORIGINAL_GLB = Path('/Users/elisaevrard/Downloads/dyane.glb 3')
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


def setup_working_objects():
    original_collection = collection('REFERENCE_ORIGINAL_LOCKED')
    v2_collection = collection('REFERENCE_V2_LOCKED')
    working_collection = collection('WORKING_V3')

    original_objects = imported_objects(ORIGINAL_GLB, original_collection)
    lock_reference(original_objects, 'ORIGINAL')

    v2_objects = imported_objects(V2_GLB, v2_collection)
    lock_reference(v2_objects, 'V2')

    working_import = imported_objects(V2_GLB, working_collection)
    working = {
        'Body': find_working_mesh(working_import, 'Body_Geometry'),
        'Scarf': find_working_mesh(working_import, 'Scarf_Geometry'),
        'Cap': find_working_mesh(working_import, 'Cap_Geometry'),
        'Signature': find_working_mesh(working_import, 'Signature_Geometry'),
    }
    for name, obj in working.items():
        bake_world_transform(obj)
        obj.name = name
        obj.data.name = f'{name}_Geometry'
        obj['source'] = 'dyane-web-v2.glb'
        obj['reconstruction_role'] = name

    for obj in working_import:
        if obj.type != 'MESH':
            bpy.data.objects.remove(obj, do_unlink=True)

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
    body['anatomy_remodel_status'] = 'Preserved: disconnected surface islands require manual Blender sculpting.'

    cap = working['Cap']
    pivot = Vector((0.008, 0.0, 1.91))
    for vertex in cap.data.vertices:
        co = vertex.co
        head_weight = smoothstep(1.70, 1.84, co.z)
        relative = co - pivot
        relative.x *= 1.0 + 0.018 * head_weight
        relative.y *= 1.0 + 0.050 * head_weight
        relative.z *= 1.0 - 0.016 * head_weight
        adjusted = pivot + relative
        adjusted.x -= 0.010 * smoothstep(1.80, 2.10, adjusted.z)
        vertex.co = adjusted
    cap.data.update()

    scarf = working['Scarf']
    for vertex in scarf.data.vertices:
        co = vertex.co
        mass = bell(co.z, 0.18, 0.74, 1.48)
        co.x *= 1.0 + 0.030 * mass
        if co.y > 0.0:
            co.y *= 1.0 + 0.065 * mass
        if co.x > 0.08:
            co.x += 0.020 * mass
    scarf.data.update()


def phase_v02_head_hands(working):
    body = working['Body']
    body['detail_remodel_status'] = 'Face, hands and legs preserved for manual topology-aware sculpting.'


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
    for vertex in scarf.data.vertices:
        co = vertex.co
        hip = bell(co.z, 0.72, 1.04, 1.36)
        if co.y < 0.0:
            center_weight = max(0.0, 1.0 - abs(co.x) / 0.34)
            co.z -= 0.052 * hip * center_weight
            co.y -= 0.014 * hip
        right_mass = smoothstep(0.07, 0.22, co.x) * bell(co.z, 0.20, 0.76, 1.40)
        co.x += 0.038 * right_mass
        co.y *= 1.0 + 0.070 * right_mass
        left_mass = smoothstep(0.07, 0.21, -co.x) * bell(co.z, 0.20, 0.78, 1.25)
        co.x -= 0.022 * left_mass
        if co.y > 0.02:
            back_weight = bell(co.z, 0.20, 0.72, 1.25)
            co.y += 0.042 * back_weight
            co.x *= 1.0 + 0.035 * back_weight
        foot_spread = 1.0 - smoothstep(0.22, 0.48, co.z)
        co.x *= 1.0 + 0.125 * foot_spread
        co.y *= 1.0 + 0.105 * foot_spread
        if co.z < BASE_HEIGHT + 0.006:
            co.z = BASE_HEIGHT + 0.006
    scarf.data.update()
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


def cleanup_mesh(obj, smooth=True):
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
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


def phase_v04_topology(working):
    for name, obj in working.items():
        if name in {'Body', 'Cap'}:
            continue
        cleanup_mesh(obj, smooth=name != 'Signature')
    if not working['Scarf'].data.uv_layers:
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
        V2_GLB,
        *REFERENCE_FILES.values(),
        *ADDITIONAL_REFERENCE_FILES.values(),
    ):
        if not required.exists():
            raise FileNotFoundError(required)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    working, original_collection, v2_collection = setup_working_objects()
    materials = create_materials()
    for name, obj in working.items():
        assign_material(obj, materials[name])
    cameras = setup_references_and_cameras()
    setup_studio()
    snapshots = []

    bpy.context.scene['model_policy'] = 'Original and V2 locked; WORKING_V3 is the only editable collection.'
    bpy.context.scene['reference_limit'] = 'No dedicated close-ups; local edits remain conservative.'
    snapshots.append(stage_snapshot('v00', working))
    render_stage('v00', cameras, working)
    save_stage('v00')

    remove_collection_and_objects(original_collection)
    remove_collection_and_objects(v2_collection)

    phase_v01_proportions(working)
    snapshots.append(stage_snapshot('v01', working))
    render_stage('v01', cameras, working)
    save_stage('v01')

    phase_v02_head_hands(working)
    snapshots.append(stage_snapshot('v02', working))
    render_stage('v02', cameras, working)
    render_closeups('v02', working, names=('face', 'left-hand', 'right-hand'))
    save_stage('v02')

    phase_v03_scarf_base(working, materials)
    snapshots.append(stage_snapshot('v03', working))
    render_stage('v03', cameras, working)
    render_closeups('v03', working, names=('face',))
    save_stage('v03')

    phase_v04_topology(working)
    snapshots.append(stage_snapshot('v04', working))
    render_stage('v04', cameras, working)
    render_closeups('v04', working, names=('face',))
    save_stage('v04')

    scale_factor = scale_to_reference_height(working, 0.42)
    snapshots.append(stage_snapshot('v05', working))
    render_stage('v05', cameras, working)
    render_closeups('v05', working)
    save_stage('v05')
    export_candidate(working)

    validation = validate_reimport()
    report = {
        'blender_version': bpy.app.version_string,
        'original': {'path': str(ORIGINAL_GLB), 'sha256': sha256(ORIGINAL_GLB)},
        'v2': {'path': str(V2_GLB), 'sha256': sha256(V2_GLB)},
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
