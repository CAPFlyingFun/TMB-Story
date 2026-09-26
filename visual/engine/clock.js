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
//  - iOS pauses the element on its own -- around a load, a seek, a gap in the data on LTE.
//    So while the page is on screen the element's `pause` event never stops the scene:
//    only the scene's own buttons (and the lock-screen / Dynamic Island controls, routed
//    to them through Media Session) do, and a stray pause is resumed. A pause while the
//    page is HIDDEN (locked, switched away) is followed. The first build took every pause
//    as final and froze at 0:00.3; the second trusted pauses after a 2.5 s window, which a
//    cold start on LTE outlasts, and froze at 0:00.7 on Joshua's phone.
//  - While the audio is not actually advancing (buffering, a seek in flight) the scene
//    waits for it rather than running ahead: never more than 0.35 s past what is heard.
//  - The FIRST start carries its position in the URL (a media fragment, `#t=28.47`), so
//    the browser begins loading at the lab instead of loading 0:00 and then seeking.
//  - A seek in flight is never interrupted. The second build nudged every second, and on
//    a slow connection a seek into an mp3 that has not downloaded takes longer than that,
//    so each nudge restarted it: frozen at 0:00.3 on a cold start, fine once cached.

const LOGGED = ["loadedmetadata", "canplay", "play", "playing", "pause", "waiting", "stalled", "seeking", "seeked", "error"];

export class AudioClock {
  constructor(audio, { src, start, end, silent = false }) {
    this.audio = audio;
    this.src = src;
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
    this.log = []; // the last few media events, for the debug panel
    this._lastReseek = 0;
    this._lastKick = 0;

    audio.addEventListener("loadedmetadata", () => {
      if (this._seekTarget !== null && Math.abs(audio.currentTime - this._seekTarget) > 0.5) this._applySeek(this._seekTarget);
    });
    audio.addEventListener("seeked", () => {
      // The jump is done. From here the scene follows whatever the audio plays.
      this._seekTarget = null;
      this._lastAudio = -1;
      if (this.playing && !this.virtual && audio.paused) this._resume();
    });
    audio.addEventListener("playing", () => {
      this._lastAudio = -1; // re-anchor on the next frame
    });
    audio.addEventListener("pause", () => {
      if (!this.playing || this.virtual || this._pausing) return;
      if (document.hidden) this.pause(); // locked or switched away: follow it
      else this._resume(); // on screen: iOS's own pause, not the listener's
    });
    for (const type of LOGGED) {
      audio.addEventListener(type, () => {
        this.log.push(`${type}@${audio.currentTime.toFixed(1)}`);
        if (this.log.length > 6) this.log.shift();
      });
    }
  }

  now() {
    if (!this.playing) return this._t;
    const p = performance.now();
    let t;
    if (this.virtual) {
      t = this._base + (p - this._basePerf) / 1000;
    } else {
      const a = this.audio, at = a.currentTime;
      // Hold the scene only while the audio is genuinely not there yet: a seek in flight
      // (the browser's own flag), the first 0.4 s after we asked for one (before the flag
      // is up), or the audio sitting outside the scene altogether. The third build also
      // held while the audio was "more than 0.5 s from where we sent it" -- which never
      // cleared if the audio arrived and played on between two checks, so on LTE the
      // picture froze at 0:00.7 while the narration carried on, and the clock kept
      // yanking the audio back. Distance from a target is not a signal; `seeking` is.
      const outside = at < this.start - 0.5 || at > this.end + 1;
      const justAsked = this._seekTarget !== null && p - this._seekPerf < 400;
      if (a.seeking || justAsked || outside) {
        // Re-issue a seek only when the audio is outside the scene with nothing in flight
        // (the browser dropped it), and no more than every 3 s.
        if (outside && !a.seeking && a.readyState >= 1 && p - this._seekPerf > 1500 && p - this._lastReseek > 3000) {
          this._lastReseek = p;
          this._applySeek(this._t);
        }
        this._kick(p);
        this.waiting = true;
        return this._t;
      }
      this._kick(p);
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
    if (a.readyState === 0) {
      // Inside the tap, and the first time only: load the file starting AT the scene
      // (iOS ignores preload), instead of loading 0:00 and seeking into it.
      a.src = this.src + "#t=" + this._t.toFixed(2);
      a.load();
      this._seekTarget = this._t;
      this._seekPerf = performance.now();
    } else if (Math.abs(a.currentTime - this._t) > 0.3) {
      this._applySeek(this._t);
    }
    try {
      await a.play();
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
    this._applySeek(t);
  }

  _applySeek(t) {
    this._seekTarget = t;
    this._seekPerf = performance.now();
    try {
      if (this.audio.readyState > 0) this.audio.currentTime = t;
    } catch (e) {
      /* not loaded yet; loadedmetadata applies it */
    }
  }

  // Playing, but the element sits paused and is not seeking: iOS left it there (an
  // aborted play, an interruption inside the guard). Press play again, at most every 1.5 s.
  _kick(p) {
    const a = this.audio;
    if (this.playing && a.paused && !a.seeking && !this._pausing && p - this._lastKick > 1500) {
      this._lastKick = p;
      this._resume();
    }
  }

  _resume() {
    const p = this.audio.play();
    if (p && p.catch) p.catch(() => {});
  }
}
