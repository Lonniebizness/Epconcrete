# Image Tiler

Split a large image into print-ready tiles with a **correct, single bleed
overlap** — built for all-over-print T-shirt transfers and posters where you
print on letter-size sheets and assemble them.

Adjacent tiles share *exactly* the bleed you ask for (e.g. 0.25"), so when you
trim the shared strip the panels line up with no doubling and no black edges.

## Install

```bash
pip install -e .
# or just: pip install Pillow
```

## Use

**Grid mode** — you choose how many tiles:

```bash
python tile_image.py --input art.png --tiles 3x4 --verify
```

Splits the image into 3 columns × 4 rows. Each tile is sized to cover the image
exactly with the bleed shared between neighbours. `--verify` also writes a
`_reassembled_preview.png` so you can confirm alignment before printing.

**Paper mode** — you choose the sheet size, it computes the count:

```bash
python tile_image.py --input art.png --paper 8.5x11
```

### Options

| Flag | Default | Meaning |
|------|---------|---------|
| `--input` | (required) | Source image (PNG/JPG/…) |
| `--tiles` | – | Grid as `COLSxROWS`, e.g. `3x4` (grid mode) |
| `--cols` / `--rows` | – | Alternative to `--tiles` |
| `--overlap` | `0.25` | Bleed shared between neighbours, in inches |
| `--dpi` | `300` | Print resolution |
| `--paper` | `8.5x11` | Sheet size; also the fit-check in grid mode |
| `--bg` | `white` | Edge fill: `white`, `black`, or `transparent` |
| `--output` | `./tiles` | Output folder |
| `--verify` | off | Also write a reassembled preview |

In grid mode the tile's physical size comes from your image ÷ the grid, so it
may not be exactly letter size — the tool prints each tile's real inch size and
**warns if a tile is larger than the paper** at your DPI (add tiles or lower
DPI to fix).

## Assembling

Each tile carries `--overlap` inches of bleed shared with its neighbour. When
assembling, trim that strip on whichever panel sits on top.

## Tests

```bash
pip install -e ".[dev]"
pytest
```

The suite checks the core guarantee (tiles reassemble pixel-identical to the
original), that overlap equals the request (not doubled), that there's no black
border on outer edges, plus paper-mode counts and input guards.
