# Dyane Web V3 — reconstruction candidate

This folder contains a non-destructive, Preview-only reconstruction chain. The production model and `public/models/dyane-web-v2.glb` are unchanged.

## Versioned files

- `dyane-reconstruction-v00-import.blend`: locked original and V2 references, photo references, calibrated cameras, and editable V3 collection.
- `dyane-reconstruction-v01-proportions.blend`: safe head-volume and scarf-proportion adjustments. The body anatomy is preserved.
- `dyane-reconstruction-v02-head-hands.blend`: validation checkpoint. Face, hands, and legs are intentionally preserved because their disconnected surface islands make automatic deformation unsafe.
- `dyane-reconstruction-v03-scarf-base.blend`: reshaped independent scarf and newly separated base.
- `dyane-reconstruction-v04-topology.blend`: safe cleanup and scarf UV set. Body and Cap normals are preserved.
- `dyane-reconstruction-v05-export.blend`: web scale (0.42 m), origin, materials, and export state.
- `validation/dyane-web-v3-reimport.blend`: clean-scene reimport validation.
- `exports/dyane-web-v3-candidate.glb`: candidate used only on the temporary comparison page.

## Final validation

- Nodes: `Body`, `Scarf`, `Cap`, `Base`, `Signature`.
- Materials: `Porcelain_Ivory`, `Glaze_Bordeaux`, `Porcelain_Cap`, `Porcelain_Base`, `Signature_Dark`.
- Dimensions after reimport: 0.141648 × 0.120024 × 0.420000 m.
- Base on ground: yes (`Z = 0`).
- Triangles: 61,792.
- Draw calls: 5 estimated.
- GLB weight: 1,914,644 bytes.
- Degenerate faces detected: 0.
- Non-manifold edges excluding intentional open boundaries: 0.
- `Scarf` UV set: present and independently customizable.

The detailed machine-readable measurements and SHA-256 hashes are stored in `reconstruction-report.json`.

## Safe improvements included

- source files kept read-only and identified by SHA-256;
- explicit object and material naming;
- independently customizable scarf with a generated UV set;
- controlled scarf-volume and fold-distribution adjustments;
- separate, manifold porcelain base with softened edges;
- centered world scale at 42 cm and exact ground alignment;
- PBR porcelain/glaze materials with double-sided rendering for the source's open surfaces;
- clean GLB export and blank-scene Blender reimport;
- photo/V2/V3 comparisons at front, profile, three-quarter, and back angles;
- desktop and mobile comparison-page validation.

## Manual Blender work still required

These areas were not claimed as corrected when the safe automatic result could not be guaranteed:

- **Face:** eyelids, nose, lips, chin, and softer expression require topology-aware sculpting. The current `Cap` has many intentional/disconnected boundary islands.
- **Hair:** locks, hairline, and back mass require manual welding or retopology before sculpting.
- **Hands:** finger spacing, fingertips, nails, and the contact with the scarf require isolated manual sculpting.
- **Scarf:** broad silhouette and UV readiness are improved; individual front/back folds should still be art-directed against close-up photographs.
- **Legs and feet:** anatomical transitions and toe definition remain the V2 geometry and require manual sculpting.
- **Cap/neck:** the visual junction and bottle closure tolerances require a dedicated mechanical reference.
- **Base:** separation, proportions, material, and ground alignment are complete; exact production bevel and ceramic tolerances still need physical measurements.

No production asset is replaced by this candidate.
