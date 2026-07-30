# Dyane Web V3 — reconstruction candidate

This folder contains a non-destructive, Preview-only reconstruction chain. The production model and `public/models/dyane-web-v2.glb` are unchanged.

## Versioned files

- `dyane-reconstruction-v00-import.blend`: locked original and V2 references, photo references, calibrated cameras, and editable V3 collection.
- `dyane-reconstruction-v01-proportions.blend`: remodeled silhouette, torso, shoulder/waist envelope, head volume, and scarf proportions.
- `dyane-reconstruction-v02-head-hands.blend`: conservative facial/hair remodeling, localized closed Cap remesh, hand/arm/leg/foot proportion edits, and modeled Cap/Body seam.
- `dyane-reconstruction-v03-scarf-base.blend`: remodeled independent scarf (hip sweep, right fall, rear folds, foot spread) and newly separated base.
- `dyane-reconstruction-v04-topology.blend`: exact-position welds inside each node, controlled local smoothing, shared Body/Scarf seam alignment, normals, and scarf UV set.
- `dyane-reconstruction-v05-export.blend`: web scale (0.42 m), origin, materials, and export state.
- `validation/dyane-web-v3-reimport.blend`: clean-scene reimport validation.
- `exports/dyane-web-v3-candidate.glb`: candidate used only on the temporary comparison page.

## Final validation

- Nodes: `Body`, `Scarf`, `Cap`, `Base`, `Signature`.
- Materials: `Porcelain_Ivory`, `Glaze_Bordeaux`, `Porcelain_Cap`, `Porcelain_Base`, `Signature_Dark`.
- Dimensions after reimport: 0.146664 × 0.119647 × 0.420000 m.
- Base on ground: yes (`Z = 0`).
- Triangles: 111,758 after GLB reimport (61,506 in V2).
- Draw calls: 5 estimated.
- GLB weight: 3,045,440 bytes.
- Degenerate faces detected: 0.
- Non-manifold edges: one legacy Body edge remains before and after GLB reimport. Open Body/Scarf material-interface boundaries inherited from the source, plus glTF attribute-split boundaries, are recorded rather than hidden; no piece is missing in the visual reimport.
- `Scarf` UV set: present and independently customizable.

The detailed machine-readable measurements and SHA-256 hashes are stored in `reconstruction-report.json`.

## Safe improvements included

- source files kept read-only and identified by SHA-256;
- explicit object and material naming;
- independently customizable scarf with a generated UV set;
- geometrically remodeled torso silhouette, head/hair volume, arms, hands, legs, feet, and scarf;
- original Cap likeness retained and closed through a localized high-resolution remesh;
- modeled elliptical junction between Cap and Body;
- controlled scarf-volume, hip sweep, rear-fold, right-fall, and foot-spread adjustments;
- separate, manifold porcelain base with softened edges;
- centered world scale at 42 cm and exact ground alignment;
- PBR porcelain/glaze materials with double-sided rendering for the source's open surfaces;
- clean GLB export and blank-scene Blender reimport;
- photo/V2/V3 comparisons at front, profile, three-quarter, and back angles, in neutral clay and final porcelain;
- desktop and mobile comparison-page validation.

## Manual Blender work still required

These areas were improved, but still require an artist's manual Blender pass for production-level likeness:

- **Face:** global softness, cheek/chin width, and nose projection are changed; eyelids, lips, and expression still require manual sculpting against close-ups.
- **Hair:** lateral/rear masses are rounded; individual locks and the hairline still require manual art direction.
- **Hands:** both hands are narrowed and simplified; finger spacing, fingertips, nails, and exact scarf contact still require manual sculpting.
- **Scarf:** broad silhouette and UV readiness are improved; individual front/back folds should still be art-directed against close-up photographs.
- **Legs and feet:** spacing, thickness, and foot spread are changed; anatomical transitions and toe definition still require manual sculpting.
- **Cap/neck:** a visible seam is modeled; exact bottle closure tolerances require a dedicated mechanical reference.
- **Base:** separation, proportions, material, and ground alignment are complete; exact production bevel and ceramic tolerances still need physical measurements.

No production asset is replaced by this candidate.
