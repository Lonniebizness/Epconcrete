"""
Tests for the image tiler.

The headline guarantee — and the one that was broken before — is that tiles
overlap by *exactly* the requested bleed and reassemble back into the original
with no doubling and no black border. Most tests assert that directly.
"""
import math
import pytest
from PIL import Image, ImageChops

import tile_image as ti


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def make_image(path, w, h):
    """A deterministic gradient so any misalignment shows up as a pixel diff."""
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            px[x, y] = (x % 256, y % 256, (x + y) % 256)
    img.save(path)
    return path


def reassembled(output_dir):
    return Image.open(f"{output_dir}/_reassembled_preview.png").convert("RGB")


# --------------------------------------------------------------------------- #
# parsing
# --------------------------------------------------------------------------- #
def test_parse_grid():
    assert ti.parse_grid("3x4") == (3, 4)
    assert ti.parse_grid("3 X 4") == (3, 4)


def test_parse_grid_bad():
    with pytest.raises(ValueError):
        ti.parse_grid("3-4")


def test_parse_paper_size():
    assert ti.parse_paper_size("8.5x11") == (8.5, 11.0)


def test_parse_paper_size_bad():
    with pytest.raises(ValueError):
        ti.parse_paper_size("letter")


# --------------------------------------------------------------------------- #
# the core guarantee: exact overlap + clean reassembly
# --------------------------------------------------------------------------- #
def test_grid_reassembly_is_pixel_identical(tmp_path):
    src = make_image(tmp_path / "src.png", 4000, 5200)
    out = tmp_path / "tiles"
    info = ti.tile_image(str(src), cols=3, rows=4, output_dir=str(out), verify=True)

    assert info["cols"] == 3 and info["rows"] == 4
    orig = Image.open(str(src)).convert("RGB")
    assert ImageChops.difference(orig, reassembled(out)).getbbox() is None


def test_overlap_is_exactly_requested_not_doubled(tmp_path):
    """Regression: bleed used to be applied twice (0.5\" for a 0.25\" request)."""
    src = make_image(tmp_path / "src.png", 4000, 5200)
    out = tmp_path / "tiles"
    dpi, overlap_in = 300, 0.25
    info = ti.tile_image(str(src), cols=3, rows=4, dpi=dpi,
                         overlap_inches=overlap_in, output_dir=str(out))

    overlap_px = info["overlap_px"]
    assert overlap_px == int(round(overlap_in * dpi))

    # Two horizontally-adjacent tiles must share exactly `overlap_px` columns.
    t0 = Image.open(f"{out}/tile_r01_c01_001.png").convert("RGB")
    t1 = Image.open(f"{out}/tile_r01_c02_002.png").convert("RGB")
    # rightmost `overlap_px` cols of t0 == leftmost `overlap_px` cols of t1
    right = t0.crop((t0.width - overlap_px, 0, t0.width, t0.height))
    left = t1.crop((0, 0, overlap_px, t1.height))
    assert ImageChops.difference(right, left).getbbox() is None


def test_no_black_border_on_outer_edges(tmp_path):
    """Regression: outer tiles used to get a black bleed strip pasted on."""
    src = make_image(tmp_path / "src.png", 1200, 1500)
    out = tmp_path / "tiles"
    ti.tile_image(str(src), cols=2, rows=2, output_dir=str(out))

    orig = Image.open(str(src)).convert("RGB")
    top_left_tile = Image.open(f"{out}/tile_r01_c01_001.png").convert("RGB")
    # The very first pixel of the first tile must be real image content,
    # not a pasted-on background border.
    assert top_left_tile.getpixel((0, 0)) == orig.getpixel((0, 0))


def test_tile_count_matches_request(tmp_path):
    src = make_image(tmp_path / "src.png", 1000, 1000)
    out = tmp_path / "tiles"
    ti.tile_image(str(src), cols=2, rows=3, output_dir=str(out))
    pngs = [p for p in out.iterdir() if p.suffix == ".png" and "reassemb" not in p.name]
    assert len(pngs) == 6


# --------------------------------------------------------------------------- #
# paper mode
# --------------------------------------------------------------------------- #
def test_paper_mode_auto_count(tmp_path):
    src = make_image(tmp_path / "src.png", 4000, 5200)
    out = tmp_path / "tiles"
    info = ti.tile_image(str(src), paper_size="8.5x11", dpi=300,
                         output_dir=str(out), verify=True)
    # 8.5x11 @300 = 2550x3300; covering 4000x5200 -> 2x2
    assert info["cols"] == 2 and info["rows"] == 2
    assert info["tile_w_px"] == 2550 and info["tile_h_px"] == 3300
    orig = Image.open(str(src)).convert("RGB")
    assert ImageChops.difference(orig, reassembled(out)).getbbox() is None


# --------------------------------------------------------------------------- #
# guards
# --------------------------------------------------------------------------- #
def test_overlap_too_large_raises(tmp_path):
    src = make_image(tmp_path / "src.png", 200, 200)
    with pytest.raises(ValueError):
        # tile = ceil((200+75)/2) = 138px; overlap 0.25"@300 = 75px -> 2*75 >= 138
        ti.tile_image(str(src), cols=2, rows=2, output_dir=str(tmp_path / "t"))


def test_single_tile(tmp_path):
    src = make_image(tmp_path / "src.png", 800, 600)
    out = tmp_path / "tiles"
    info = ti.tile_image(str(src), cols=1, rows=1, output_dir=str(out), verify=True)
    assert info["cols"] == 1 and info["rows"] == 1
    orig = Image.open(str(src)).convert("RGB")
    assert ImageChops.difference(orig, reassembled(out)).getbbox() is None
