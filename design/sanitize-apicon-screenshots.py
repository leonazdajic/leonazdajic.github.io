"""Blur sensitive regions (market codes, deviation counts, dates) of the ApiCon
screenshots via headless Chrome canvas: pixelate first (not recoverable), then
soften with a blur. Output files are copied to public/apicon/apicon-0N-<step>.webp.

Usage: python3 -I sanitize.py <orig_dir> <out_dir> [--preview]
Regions are (x, y, w, h) in source pixels. Output: WebP (q=0.9) or PNG preview.
"""
import base64, json, subprocess, sys, pathlib, re

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BLOCK = 12

REGIONS = {
    "step-1-environment": [(652, 622, 86, 28)],
    "step-2-markets": [(198, 372, 84, 26), (602, 371, 74, 22), (634, 520, 44, 322), (1078, 520, 44, 322)],
    "step-3-files": [(214, 366, 84, 26)],
    "step-4-comparison": [(226, 365, 84, 26), (678, 480, 44, 130)],
    "step-5-results": [(214, 367, 84, 26), (626, 362, 48, 52), (940, 362, 70, 52), (1255, 362, 70, 52), (1490, 545, 48, 262)],
    "step-6-delta": [(608, 164, 196, 44), (1452, 222, 36, 116), (636, 426, 120, 24), (610, 660, 416, 46), (692, 826, 34, 92), (248, 331, 80, 26)],
}

PAGE = """<!doctype html><html><body><script>
const img = new Image();
img.onload = () => {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0);
  const B = %d;
  for (const [rx, ry, rw, rh] of %s) {
    const t = document.createElement('canvas');
    t.width = Math.max(1, Math.ceil(rw / B)); t.height = Math.max(1, Math.ceil(rh / B));
    const tx = t.getContext('2d');
    tx.imageSmoothingEnabled = true;
    tx.drawImage(c, rx, ry, rw, rh, 0, 0, t.width, t.height);
    x.imageSmoothingEnabled = false;
    x.drawImage(t, 0, 0, t.width, t.height, rx, ry, rw, rh);
    // Soft blur on top of the pixelation (pixelation first = not recoverable)
    const p = document.createElement('canvas');
    p.width = rw; p.height = rh;
    p.getContext('2d').drawImage(c, rx, ry, rw, rh, 0, 0, rw, rh);
    x.save();
    x.beginPath(); x.rect(rx, ry, rw, rh); x.clip();
    x.filter = 'blur(5px)';
    for (let i = 0; i < 3; i++) x.drawImage(p, rx, ry);
    x.restore();
  }
  document.body.textContent = 'DATA:' + c.toDataURL('%s', 0.9) + ':END';
};
img.src = 'data:image/png;base64,%s';
</script></body></html>"""


def main() -> None:
    orig, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    preview = "--preview" in sys.argv
    out.mkdir(parents=True, exist_ok=True)
    mime = "image/png" if preview else "image/webp"
    ext = "png" if preview else "webp"
    for name, regions in REGIONS.items():
        b64 = base64.b64encode((orig / f"{name}.png").read_bytes()).decode()
        page = out / f"_{name}.html"
        page.write_text(PAGE % (BLOCK, json.dumps(regions), mime, b64))
        dom = subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--virtual-time-budget=5000",
             f"--user-data-dir={out}/_prof", "--dump-dom", page.as_uri()],
            capture_output=True, text=True, check=True).stdout
        m = re.search(r"DATA:data:[^;]+;base64,([A-Za-z0-9+/=]+):END", dom)
        if not m:
            sys.exit(f"no output for {name}")
        (out / f"{name}.{ext}").write_bytes(base64.b64decode(m.group(1)))
        page.unlink()
        print(name, "ok")


main()
