import json
import sys
from collections import deque
from pathlib import Path

sys.path.insert(0, '/private/tmp/dyane-blender-numpy')

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[1]
arguments = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
SOURCE_BLEND = Path(arguments[0]) if arguments else PROJECT_ROOT / 'assets/models/dyane-web-v2.blend'
OUTPUT_PATH = Path('/private/tmp/dyane-component-report.json')


def object_bounds(obj, indices):
    points = [obj.matrix_world @ obj.data.vertices[index].co for index in indices]
    minimum = Vector((min(point.x for point in points), min(point.y for point in points), min(point.z for point in points)))
    maximum = Vector((max(point.x for point in points), max(point.y for point in points), max(point.z for point in points)))
    centroid = sum(points, Vector()) / len(points)
    return {
        'min': list(minimum),
        'max': list(maximum),
        'dimensions': list(maximum - minimum),
        'centroid': list(centroid),
    }


def connected_components(obj):
    mesh = obj.data
    adjacency = [[] for _ in mesh.vertices]
    for edge in mesh.edges:
        a, b = edge.vertices
        adjacency[a].append(b)
        adjacency[b].append(a)

    unseen = set(range(len(mesh.vertices)))
    components = []
    while unseen:
        seed = unseen.pop()
        queue = deque([seed])
        component = [seed]
        while queue:
            current = queue.popleft()
            for neighbor in adjacency[current]:
                if neighbor in unseen:
                    unseen.remove(neighbor)
                    queue.append(neighbor)
                    component.append(neighbor)
        components.append(component)

    components.sort(key=len, reverse=True)
    return [
        {
            'rank': rank,
            'vertex_count': len(indices),
            **object_bounds(obj, indices),
        }
        for rank, indices in enumerate(components)
    ]


def boundary_components(obj):
    mesh = obj.data
    adjacency = {}
    import bmesh
    bm = bmesh.new()
    bm.from_mesh(mesh)
    for edge in bm.edges:
        if edge.is_boundary:
            a, b = edge.verts
            adjacency.setdefault(a.index, set()).add(b.index)
            adjacency.setdefault(b.index, set()).add(a.index)
    bm.free()
    unseen = set(adjacency)
    groups = []
    while unseen:
        seed = unseen.pop()
        queue = deque([seed])
        group = [seed]
        while queue:
            current = queue.popleft()
            for neighbor in adjacency[current]:
                if neighbor in unseen:
                    unseen.remove(neighbor)
                    queue.append(neighbor)
                    group.append(neighbor)
        groups.append(group)
    groups.sort(key=len, reverse=True)
    return [
        {'rank': rank, 'vertex_count': len(indices), **object_bounds(obj, indices)}
        for rank, indices in enumerate(groups)
    ]


bpy.ops.wm.open_mainfile(filepath=str(SOURCE_BLEND))
report = {
    'source': str(SOURCE_BLEND),
    'objects': {},
}
for obj in bpy.context.scene.objects:
    if obj.type != 'MESH':
        continue
    report['objects'][obj.name] = {
        'vertices': len(obj.data.vertices),
        'edges': len(obj.data.edges),
        'polygons': len(obj.data.polygons),
        'uv_layers': [layer.name for layer in obj.data.uv_layers],
        'components': connected_components(obj),
        'boundary_components': boundary_components(obj),
    }

OUTPUT_PATH.write_text(json.dumps(report, indent=2), encoding='utf-8')
print('DYANE_COMPONENT_REPORT')
print(OUTPUT_PATH)
