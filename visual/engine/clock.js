// The chapter audio is the master clock. Everything on screen is a pure function of the
// time this returns, so pausing, seeking, skipping and replaying need no special cases.
//
// audio.currentTime is coarse on some mobile browsers (it can step in ~250 ms jumps), so
// between updates the clock runs on performance.now() and re-anchors whenever the audio
// reports a new time. If the audio cannot play (a missing file, ?silent=1) the clock runs
// on performance.now() alone, so the visuals are still testable.
//
// iOS RULES, learned from the reader, which plays this same file on Joshua's phone:
//  - Nothing loads until a tap. A seek issued before the metadata is in is dropped, so the
//    position is (re)applied on loadedmetadata and again once playback is running.
//  - iOS pauses the element for a moment around a seek or while it buffers. The element's
//    `pause` event is therefore NOT taken as the user stopping the scene unless it lasts;
//    a transient one is resumed. Treating every pause as final is what froze the first
//    build at 0:00.3.
//  - While the audio is not actually advancing (buffering, a seek in flight) the scene
//    waits for it rather than running ahead: never more than 0.35 s past what is heard.

const GUARD_MS = 2500; // after a play or a seek, a pause is presumed to be iOS, not the user

export class AudioClock {
  constructor(audio, { start, end, silent = false }) {
    this.audio = audio;
    this.start = start;
    this.end = end;
    this.virtual = silent;
    this.playing = false;
    this.ended = false;
    this.waiting = false;
    this._t = start;
    this._base = start;
    this._basePerf = performance.now();
    this._lastAudio = -1;
    this._seekTarget = null;
    this._seekPerf = 0;
    this._guardUntil = 0;
    this._lastReseek = 0;

    audio.addEventListener("loadedmetadata", () => {
      if (this._seekTarget !== null) this._applySeek(this._seekTarget);
    });
    audio.addEventListener("seeked", () => {
      if (this.playing && !this.virtual && audio.paused) this._resume();
    });
    audio.addEventListener("playing", () => {
      this._lastAudio = -1; // re-anchor on the next frame
    });
    audio.addEventListener("pause", () => {
      if (!this.playing || this.virtual || this._pausing) return;
      if (audio.seeking || performance.now() < this._guardUntil) {
        this._resume();
        return;
      }
      // A pause that is not ours and not a seek: a phone call, headphones out, the
      // lock screen. Follow it.
      this.pause();
    });
  }

  now() {
    if (!this.playing) return this._t;
    const p = performance.now();
    let t;
    if (this.virtual) {
      t = this._base + (p - this._basePerf) / 1000;
    } else {
      const a = this.audio, at = a.currentTime;
      const seekPending = this._seekTarget !== null && Math.abs(at - this._seekTarget) > 0.5;
      if (seekPending || at < this.start - 0.5 || at > this.end + 1) {
        // The element is not where the scene is yet. Hold still, and nudge it again
        // once a second in case the browser dropped the seek.
        if (p - this._lastReseek > 1000) {
          this._lastReseek = p;
          this._applySeek(this._seekTarget ?? this._t);
        }
        this.waiting = true;
        return this._t;
      }
      this._seekTarget = null;
      if (at !== this._lastAudio) {
        this._lastAudio = at;
        this._base = at;
        this._basePerf = p;
      }
      t = this._base + ((p - this._basePerf) / 1000) * (a.playbackRate || 1);
      if (t > at + 0.35) t = at + 0.35; // never run far ahead of what is heard
      this.waiting = a.paused || a.readyState < 3;
    }
    if (t >= this.end) {
      this.pause();
      this.ended = true;
      t = this.end;
    }
    this._t = t;
    return t;
  }

  async play() {
    if (this.ended || this._t >= this.end - 0.05) this.seek(this.start);
    this.ended = false;
    this._base = this._t;
    this._basePerf = performance.now();
    this.playing = true;
    if (this.virtual) return true;
    const a = this.audio;
    this._guardUntil = performance.now() + GUARD_MS;
    // Inside the tap: start loading now (iOS ignores preload), and queue the position so
    // loadedmetadata applies it.
    if (a.readyState === 0) a.load();
    this._applySeek(this._t);
    try {
      await a.play();
      if (Math.abs(a.currentTime - this._t) > 0.3) this._applySeek(this._t);
      return true;
    } catch (err) {
      if (err && err.name === "AbortError") return true; // superseded by a later play or load
      console.warn("audio would not play; running the scene on a silent clock", err);
      this.virtual = true;
      this._base = this._t;
      this._basePerf = performance.now();
      return false;
    }
  }

  pause() {
    this.playing = false;
    this.waiting = false;
    if (!this.virtual) {
      this._pausing = true;
      this.audio.pause();
      this._pausing = false;
    }
  }

  seek(t) {
    t = Math.min(Math.max(t, this.start), this.end);
    this.ended = false;
    this._t = t;
    this._base = t;
    this._basePerf = performance.now();
    this._lastAudio = -1;
    if (this.virtual) return;
    this._guardUntil = performance.now() + GUARD_MS;
    this._applySeek(t);
  }

  _applySeek(t) {
    this._seekTarget = t;
    this._seekPerf = performance.now();
    this._guardUntil = Math.max(this._guardUntil, this._seekPerf + GUARD_MS);
    try {
      if (this.audio.readyState > 0) this.audio.currentTime = t;
    } catch (e) {
      /* not loaded yet; loadedmetadata applies it */
    }
  }

  _resume() {
    const p = this.audio.play();
    if (p && p.catch) p.catch(() => {});
  }
}
