#!/usr/bin/env python3
"""Convert owned image originals into locally hosted, optimized WebP images.

Requirements: python3 -m pip install Pillow

Usage:
  python3 scripts/optimize-webp.py --input /path/to/originals --output public/images/imported
  python3 scripts/optimize-webp.py --input /path/to/photo.jpg --output public/images/cocktails
"""

import argparse
import re
import unicodedata
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError as exc:
    raise SystemExit("Install Pillow first: python3 -m pip install Pillow") from exc

SOURCE_EXTS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".webp"}


def slug(value: str) -> str:
    ascii_value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    clean = re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")
    if not clean:
        raise ValueError("Filename must have at least one letter or digit")
    return clean


def optimize(source: Path, destination: Path, max_width: int, quality: int) -> None:
    if source.resolve() == destination.resolve():
        raise ValueError("Source and destination cannot be the same file")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        if image.mode in ("RGBA", "LA") or "transparency" in image.info:
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")
        if image.width > max_width:
            new_height = max(1, round(image.height * max_width / image.width))
            image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=quality, method=6)
    old_size, new_size = source.stat().st_size, destination.stat().st_size
    saving = round((1 - new_size / old_size) * 100) if old_size else 0
    print(f"{source} -> {destination} ({new_size // 1024} KiB, {saving}% smaller)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Optimize locally owned image files for Dyane Paris.")
    parser.add_argument("--input", required=True, type=Path, help="File or directory with original photos")
    parser.add_argument("--output", default=Path("public/images/imported"), type=Path)
    parser.add_argument("--max-width", default=1800, type=int)
    parser.add_argument("--quality", default=82, type=int)
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()

    if args.max_width < 320 or not 1 <= args.quality <= 100:
        parser.error("Use --max-width >= 320 and --quality between 1 and 100")
    if not args.input.exists():
        parser.error(f"Source not found: {args.input}")

    if args.input.is_file():
        sources = [args.input]
        base = args.input.parent
    else:
        sources = sorted(p for p in args.input.rglob("*") if p.is_file() and p.suffix.lower() in SOURCE_EXTS)
        base = args.input

    converted = skipped = 0
    for source in sources:
        if source.suffix.lower() not in SOURCE_EXTS:
            print(f"Skipping unsupported file: {source}")
            skipped += 1
            continue
        relative = source.relative_to(base)
        parts = [slug(part) for part in relative.parts[:-1]]
        destination = args.output.joinpath(*parts, slug(source.stem) + ".webp")
        if destination.exists() and not args.overwrite:
            print(f"Skipping existing destination (use --overwrite): {destination}")
            skipped += 1
            continue
        optimize(source, destination, args.max_width, args.quality)
        converted += 1

    print(f"Converted: {converted}; skipped: {skipped}")
    print("Next: review image names, add accurate alt text, update image references and sitemap.")


if __name__ == "__main__":
    main()
