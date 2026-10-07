// Downloads that can say how far along they are: "Loading… 1.2MB/6.5MB (18.5%)".
//
// Each file is fetched as a stream and counted as its bytes arrive. The total is the sum of
// every file's size, and it has to be right from the first frame, not grow as the bytes
// do (Joshua, 2026-10-07: "the size amount rising as it downloads and max is not the actual
// max size"). GitHub Pages gzips the JavaScript, and a gzipped response's Content-Length is
// the COMPRESSED size while the stream counts the decoded bytes, so the header cannot be
// used for it; the old fallback, "what has arrived so far", is exactly the rising maximum.
// So each file's real size comes from visual/download-sizes.json (written by
// scripts/build-manifest.py, pinned by scripts/tests/test_download_sizes.py), passed in as
// `expected`; Content-Length is only the fallback for a file that list does not name.
// Every file is registered the moment its fetch is called, before any byte arrives.

export class Downloads {
  constructor(onChange = () => {}) {
    this.files = new Map();
    this.onChange = onChange;
    this.failed = false;
  }

  async fetch(url, expected = 0) {
    const f = { loaded: 0, total: expected || 0, done: false };
    this.files.set(url, f);
    this.onChange(this);
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status} for ${url}`);
      const len = Number(r.headers.get("content-length")) || 0;
      if (!f.total && len && !r.headers.get("content-encoding")) f.total = len;
      if (!r.body || !r.body.getReader) {
        const b = await r.arrayBuffer();
        f.loaded = f.total = b.byteLength;
        f.done = true;
        this.onChange(this);
        return b;
      }
      const reader = r.body.getReader(), chunks = [];
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        f.loaded += value.byteLength;
        if (f.loaded > f.total) f.total = f.loaded;
        this.onChange(this);
      }
      f.total = f.loaded;
      f.done = true;
      this.onChange(this);
      const out = new Uint8Array(f.loaded);
      let at = 0;
      for (const c of chunks) {
        out.set(c, at);
        at += c.byteLength;
      }
      return out.buffer;
    } catch (e) {
      this.failed = true;
      this.onChange(this);
      throw e;
    }
  }

  get loaded() {
    let n = 0;
    for (const f of this.files.values()) n += f.loaded;
    return n;
  }
  get total() {
    let n = 0;
    for (const f of this.files.values()) n += Math.max(f.total, f.loaded);
    return n;
  }
  get done() {
    return this.files.size > 0 && [...this.files.values()].every((f) => f.done);
  }
  // "Loading… 1.2MB/6.5MB (18.5%)"
  line() {
    const mb = (b) => (b / 1e6).toFixed(1) + "MB";
    const total = this.total, pct = total ? (this.loaded / total) * 100 : 0;
    return `Loading… ${mb(this.loaded)}/${mb(total)} (${pct.toFixed(1)}%)`;
  }
}
