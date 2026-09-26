// The chapter audio is the master clock. Everything on screen is a pure function of the
// time this returns, so pausing, seeking, skipping and replaying need no special cases.
//
// audio.currentTime is coarse on some mobile browsers (it can step in ~250 ms jumps), so
// between updates the clock runs on performance.now() and re-anchors whenever the audio
// reports a new time. If the audio cannot play (no gesture yet, a missing file, ?silent=1)
// the clock runs on performance.now() alone, so the visuals are still testable.

export class AudioClock {
  constructor(audio, { start, end, silent = false }) {
    this.audio = audio;
    this.start = start;
    this.end = end;
    this.virtual = silent;
    this.playing = false;
    this.ended = false;
    this._t = start;
    this._base = start;
    this._basePerf = performance.now();
    this._lastAudio = -1;
    this._seekTarget = null;
    this._seekPerf = 0;
    audio.addEventListener("pause", () => {
      // The OS paused us (a call, another app). Follow it rather than run on silently.
      if (this.playing && !this.virtual && !this._pausing) this.pause();
    });
    audio.addEventListener("loadedmetadata", () => {
      if (this._seekTarget !== null) this._applySeek(this._seekTarget);
    });
  }

  now() {
    if (!this.playing) return this._t;
    const p = performance.now();
    let t;
    if (this.virtual) {
      t = this._base + (p - this._basePerf) / 1000;
    } else {
      const at = this.audio.currentTime;
      const settling = this._seekTarget !== null && Math.abs(at - this._seekTarget) > 0.5 && p - this._seekPerf < 1500;
      if (!settling) {
        this._seekTarget = null;
        if (at !== this._lastAudio) {
          this._lastAudio = at;
          this._base = at;
          this._basePerf = p;
        }
      }
      t = this._base + ((p - this._basePerf) / 1000) * (this.audio.playbackRate || 1);
      if (!settling && t > at + 0.35) t = at + 0.35; // never run far ahead of what is heard
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
    try {
      await this.audio.play();
      // Some browsers (iOS in particular) drop a seek made before playback started.
      // Re-apply the position once the audio is actually running.
      if (Math.abs(this.audio.currentTime - this._t) > 0.3) this._applySeek(this._t);
      return true;
    } catch (err) {
      console.warn("audio would not play; running the scene on a silent clock", err);
      this.virtual = true;
      this._base = this._t;
      this._basePerf = performance.now();
      return false;
    }
  }

  pause() {
    if (!this.virtual) {
      this._pausing = true;
      this.audio.pause();
      this._pausing = false;
      if (this._seekTarget === null && this.audio.currentTime > 0) this._t = this.audio.currentTime;
    }
    this.playing = false;
  }

  seek(t) {
    t = Math.min(Math.max(t, this.start), this.end);
    this.ended = false;
    this._t = t;
    this._base = t;
    this._basePerf = performance.now();
    this._lastAudio = -1;
    this._applySeek(t);
  }

  _applySeek(t) {
    this._seekTarget = t;
    this._seekPerf = performance.now();
    try {
      this.audio.currentTime = t;
    } catch (e) {
      /* metadata not loaded yet; loadedmetadata re-applies it */
    }
  }
}
