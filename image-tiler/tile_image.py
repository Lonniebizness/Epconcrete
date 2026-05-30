#!/usr/bin/env python3
"""
Image Tiler with Bleed for All-Over Print T-Shirts
---------------------------------------------------
Splits a large image into print-ready tiles with a configurable bleed/overlap.
Each tile is saved as a PNG at the target DPI.

Two ways to drive it:

1) GRID MODE (recommended) — you say how many tiles:
       python tile_image.py --input art.png --tiles 3x4
   The image is split into 3 columns x 4 rows. Each tile is sized to cover
   the image exactly, with the bleed shared between neighbours. Each tile's
   real-world size is reported, with a warning if it won't fit on the paper.

2) PAPER MODE — you say the paper size, it figures out the count:
       python tile_image.py --input art.png --paper 8.5x11
   Each tile is a fixed 8.5x11 (or whatever you give) at the target DPI, and
   the script computes how many tiles are needed to cover the image.

Bleed/overlap:
   Adjacent tiles share EXACTLY --overlap inches of duplicated image. When
   assembling, trim that shared strip on whichever panel sits on top.

Verify:
   Add --verify to also write a single reassembled image from the tiles so you
   can confirm everything lines up before printing.

Usage examples:
    python tile_image.py --input art.png --tiles 3x4
    python tile_image.py --input art.png --cols 3 --rows 4 --overlap 0.25
    python tile_image.py --input art.png --paper 8.5x11 --verify

Requirements:
    pip install Pillow
"""

import argparse
import os
import math
from PIL import Image


def parse_paper_size(size_str):
    parts = size_str.lower().replace(" ", "").split("x")
    if len(parts) != 2:
        raise ValueError(f"Bad paper size '{size_str}'. Use WIDTHxHEIGHT, e.g. 8.5x11")
    return float(parts[0]), float(parts[1])


def parse_grid(tiles_str):
    """Parse a grid like '3x4' into (cols, rows)."""
    parts = tiles_str.lower().replace(" ", "").split("x")
    if len(parts) != 2:
        raise ValueError(f"Bad grid '{tiles_str}'. Use COLSxROWS, e.g. 3x4")
    return int(parts[0]), int(parts[1])


def _bg_color(bg, mode):
    presets = {
        "white": (255, 255, 255),
        "black": (0, 0, 0),
        "transparent": (0, 0, 0, 0),
    }
    color = presets.get(bg, presets["white"])
    if mode == "RGBA" and len(color) == 3:
        color = color + (255,)
    return color


def tile_image(input_path, overlap_inches=0.25, dpi=300, paper_size="8.5x11",
               output_dir="./tiles", cols=None, rows=None, bg="white", verify=False):
    print("\n🧵 Image Tiler — loading image...")
    img = Image.open(input_path)

    # Keep alpha if the source has it (and if a transparent bg is requested).
    out_mode = "RGBA" if (img.mode in ("RGBA", "LA", "P") and bg == "transparent") else "RGB"
    img = img.convert(out_mode)
    img_w, img_h = img.size
    print(f"   Image size: {img_w} x {img_h} px")

    paper_w_in, paper_h_in = parse_paper_size(paper_size)
    paper_w_px = int(round(paper_w_in * dpi))
    paper_h_px = int(round(paper_h_in * dpi))
    overlap_px = int(round(overlap_inches * dpi))

    grid_mode = cols is not None and rows is not None

    if grid_mode:
        if cols < 1 or rows < 1:
            raise ValueError("--cols and --rows must be >= 1")
        # Size each tile so that `cols` tiles, each stepping by (tile - overlap),
        # cover the image exactly. Overlap is shared ONCE between neighbours.
        #   cols*tile_w - (cols-1)*overlap = img_w  ->  solve for tile_w
        tile_w_px = int(math.ceil((img_w + (cols - 1) * overlap_px) / cols))
        tile_h_px = int(math.ceil((img_h + (rows - 1) * overlap_px) / rows))
        print(f"   Grid (you chose): {cols} columns x {rows} rows = {cols * rows} tiles")
    else:
        # Paper mode: tile is a fixed paper size; compute how many we need.
        tile_w_px, tile_h_px = paper_w_px, paper_h_px
        cols = max(1, math.ceil((img_w - overlap_px) / (tile_w_px - overlap_px)))
        rows = max(1, math.ceil((img_h - overlap_px) / (tile_h_px - overlap_px)))
        print(f"   Paper size: {paper_w_in}\" x {paper_h_in}\" @ {dpi} DPI "
              f"= {tile_w_px} x {tile_h_px} px per tile")
        print(f"   Computed grid: {cols} columns x {rows} rows = {cols * rows} tiles")

    if overlap_px * 2 >= min(tile_w_px, tile_h_px):
        raise ValueError(
            f"Overlap ({overlap_px}px) is too large for the tile size "
            f"({tile_w_px}x{tile_h_px}px). Reduce --overlap or use fewer tiles.")

    # Step between tiles = tile minus the single shared overlap.
    step_w = tile_w_px - overlap_px
    step_h = tile_h_px - overlap_px
    total = cols * rows

    tile_w_in = tile_w_px / dpi
    tile_h_in = tile_h_px / dpi
    print(f"   Each tile: {tile_w_px} x {tile_h_px} px "
          f"= {tile_w_in:.2f}\" x {tile_h_in:.2f}\" @ {dpi} DPI")
    print(f"   Overlap/bleed: {overlap_inches}\" = {overlap_px} px shared between neighbours")

    # Fit check against the paper.
    if grid_mode and (tile_w_px > paper_w_px or tile_h_px > paper_h_px):
        print(f"\n   ⚠️  WARNING: each tile ({tile_w_in:.2f}\" x {tile_h_in:.2f}\") is bigger "
              f"than the {paper_w_in}\" x {paper_h_in}\" paper at {dpi} DPI.")
        print(f"       Fixes: use more tiles, lower --dpi, or print on bigger paper.")

    print(f"\n   Saving to: {os.path.abspath(output_dir)}\n")
    os.makedirs(output_dir, exist_ok=True)

    fill = _bg_color(bg, out_mode)

    tile_num = 1
    for row in range(rows):
        for col in range(cols):
            # Intended tile rectangle in source coordinates.
            x1 = col * step_w
            y1 = row * step_h
            x2 = x1 + tile_w_px
            y2 = y1 + tile_h_px

            # Clamp to the image (only the last row/col can run past the edge).
            src_x1, src_y1 = max(0, x1), max(0, y1)
            src_x2, src_y2 = min(img_w, x2), min(img_h, y2)

            cropped = img.crop((src_x1, src_y1, src_x2, src_y2))

            # Full tile canvas; paste content at the right offset. Any leftover
            # (only at the far/bottom edge) is filled with the background colour.
            tile = Image.new(out_mode, (tile_w_px, tile_h_px), fill)
            tile.paste(cropped, (src_x1 - x1, src_y1 - y1))

            filename = f"tile_r{row + 1:02d}_c{col + 1:02d}_{tile_num:03d}.png"
            out_path = os.path.join(output_dir, filename)
            tile.save(out_path, dpi=(dpi, dpi))

            print(f"   ✅ {filename}  (source {src_x1},{src_y1} → {src_x2},{src_y2})")
            tile_num += 1

    print(f"\n✨ Done! {total} tiles saved to '{output_dir}'")
    print(f"   Neighbours overlap by exactly {overlap_inches}\" ({overlap_px}px). "
          f"Trim that strip on whichever panel goes on top.")

    if verify:
        verify_path = reassemble(output_dir, cols, rows, tile_w_px, tile_h_px,
                                 step_w, step_h, out_mode, fill, img_w, img_h)
        print(f"\n   🔎 Reassembled preview written to: {verify_path}")
        print(f"      (should visually match your original, edges aligned)")

    return {"cols": cols, "rows": rows, "tile_w_px": tile_w_px, "tile_h_px": tile_h_px,
            "tile_w_in": tile_w_in, "tile_h_in": tile_h_in, "overlap_px": overlap_px}


def reassemble(output_dir, cols, rows, tile_w_px, tile_h_px, step_w, step_h,
               mode, fill, orig_w, orig_h):
    """Paste the tiles back at their intended positions to confirm alignment."""
    canvas_w = (cols - 1) * step_w + tile_w_px
    canvas_h = (rows - 1) * step_h + tile_h_px
    canvas = Image.new(mode, (canvas_w, canvas_h), fill)
    tile_num = 1
    for row in range(rows):
        for col in range(cols):
            filename = f"tile_r{row + 1:02d}_c{col + 1:02d}_{tile_num:03d}.png"
            tile = Image.open(os.path.join(output_dir, filename))
            canvas.paste(tile, (col * step_w, row * step_h))
            tile_num += 1
    # Crop back to the original footprint for an honest comparison.
    canvas = canvas.crop((0, 0, orig_w, orig_h))
    out_path = os.path.join(output_dir, "_reassembled_preview.png")
    canvas.save(out_path)
    return out_path


def main():
    parser = argparse.ArgumentParser(
        description="Tile a large image into print sheets with bleed overlap.")
    parser.add_argument("--input", required=True, help="Path to your source image (PNG, JPG, etc.)")
    parser.add_argument("--tiles", help="Grid as COLSxROWS, e.g. 3x4 (grid mode)")
    parser.add_argument("--cols", type=int, help="Number of columns (grid mode)")
    parser.add_argument("--rows", type=int, help="Number of rows (grid mode)")
    parser.add_argument("--overlap", type=float, default=0.25,
                        help="Bleed shared between neighbours, in inches (default: 0.25)")
    parser.add_argument("--dpi", type=int, default=300, help="Print DPI (default: 300)")
    parser.add_argument("--paper", default="8.5x11",
                        help="Paper size in inches, e.g. 8.5x11 (default: 8.5x11)")
    parser.add_argument("--bg", default="white", choices=["white", "black", "transparent"],
                        help="Background fill for edge leftovers (default: white)")
    parser.add_argument("--output", default="./tiles", help="Output folder (default: ./tiles)")
    parser.add_argument("--verify", action="store_true",
                        help="Also write a reassembled preview to confirm alignment")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"❌ Error: File not found: {args.input}")
        return

    cols, rows = args.cols, args.rows
    if args.tiles:
        try:
            cols, rows = parse_grid(args.tiles)
        except ValueError as e:
            print(f"❌ {e}")
            return

    if (cols is None) != (rows is None):
        print("❌ Grid mode needs BOTH columns and rows (use --tiles 3x4, "
              "or both --cols and --rows).")
        return

    try:
        tile_image(
            input_path=args.input,
            overlap_inches=args.overlap,
            dpi=args.dpi,
            paper_size=args.paper,
            output_dir=args.output,
            cols=cols,
            rows=rows,
            bg=args.bg,
            verify=args.verify,
        )
    except ValueError as e:
        print(f"❌ {e}")


if __name__ == "__main__":
    main()
