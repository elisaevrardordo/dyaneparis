import os
import sys

# Blender 5.2 on this workstation ships with a broken NumPy build. The compatible
# wheel is injected from a temporary folder without modifying the Blender bundle.
sys.path.insert(0, '/private/tmp/dyane-blender-numpy')

import bpy


arguments = sys.argv[sys.argv.index('--') + 1:]
source = os.path.abspath(arguments[0])
destination = os.path.abspath(arguments[1])

if source == destination:
    raise RuntimeError('The Blender source and destination must differ.')

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=source, import_shading='NORMALS')

rename_map = {
    'body': ('Body', 'Body_Geometry'),
    'body.001': ('Signature', 'Signature_Geometry'),
    'cap': ('Cap', 'Cap_Geometry'),
    'scarf': ('Scarf', 'Scarf_Geometry'),
}

for original_name, (object_name, mesh_name) in rename_map.items():
    obj = bpy.data.objects.get(original_name)
    if obj is None:
        raise RuntimeError(f'Missing required imported object: {original_name}')
    obj['original_node_name'] = original_name
    obj.name = object_name
    obj.data.name = mesh_name

root = bpy.data.objects.get('Dyane_Root')
if root is not None:
    root['purpose'] = 'Centered X/Z pivot with the sculpture base aligned to Z=0 in Blender.'

base_reference = bpy.data.objects.new('Base', None)
base_reference.empty_display_type = 'CUBE'
base_reference.empty_display_size = 0.08
base_reference.location = (0.0, 0.0, 0.0)
base_reference['geometry_status'] = 'The base is contiguous with Body and was deliberately not split automatically.'
base_reference['manual_action'] = 'Separate the base manually only after visual topology review.'
bpy.context.scene.collection.objects.link(base_reference)

if bpy.data.materials.get('Porcelain_Base') is None:
    material = bpy.data.materials.new('Porcelain_Base')
    material.diffuse_color = (0.863, 0.784, 0.666, 1.0)
    material.metallic = 0.0
    material.roughness = 0.3
    material['status'] = 'Reserved for manual base separation; not assigned automatically.'

bpy.context.scene['source_glb'] = os.path.basename(source)
bpy.context.scene['geometry_policy'] = (
    'No subdivision, weld, remesh or automatic smoothing. Original geometry and custom normals preserved.'
)
bpy.context.scene['base_policy'] = 'Base remains inside Body; Base is a named ground reference, not duplicate geometry.'

os.makedirs(os.path.dirname(destination), exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=destination, compress=True)

print('DYANE_BLEND_CREATED')
print(destination)
print('OBJECTS', sorted(obj.name for obj in bpy.context.scene.objects))
print('MATERIALS', sorted(material.name for material in bpy.data.materials))
