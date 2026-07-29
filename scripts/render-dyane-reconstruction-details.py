import importlib.util
from pathlib import Path

import bpy


PROJECT_ROOT = Path(__file__).resolve().parents[1]
RECONSTRUCTION_SCRIPT = PROJECT_ROOT / 'scripts/dyane-model-reconstruction.py'

spec = importlib.util.spec_from_file_location('dyane_model_reconstruction', RECONSTRUCTION_SCRIPT)
reconstruction = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reconstruction)

for stage in ('v00', 'v01', 'v02', 'v03', 'v04'):
    bpy.ops.wm.open_mainfile(filepath=str(reconstruction.BLEND_PATHS[stage]))
    working = {
        name: bpy.data.objects.get(name)
        for name in reconstruction.OBJECT_NAMES
        if bpy.data.objects.get(name) is not None
    }
    reconstruction.render_closeups(stage, working)

print('DYANE_RECONSTRUCTION_DETAILS_COMPLETE')
