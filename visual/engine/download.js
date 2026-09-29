// Downloads that can say how far along they are: "Loading… 1.2MB/6.5MB (18.5%)".
//
// Each file is fetched as a stream and counted as its bytes arrive. The total is the sum of
// every file's Content-Length (when the server sends one and the body is not compressed,
// where Content-Length would be the compressed size), else what has arrived so far, so the
// fraction never passes 1. Everything fetched is started at once, so the total is known
// almost immediately.

export class Downloads {
  constructor(onChange = () => {}) {
    this.files = new Map();
    this.onChange = onChange;
    this.failed = false;
  }

  async fetch(url) {
    const f = { loaded: 0, total: 0, done: false };
    this.files.set(url, f);
    this.onChange(this);
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status} for ${url}`);
      const len = Number(r.headers.get("content-length")) || 0;
      if (len && !r.headers.get("content-encoding")) f.total = len;
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
