# Cue-driven Player Stills Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Listen player's static image with script-cued stills and push the verified change to main.

**Architecture:** A pure resolver compiles chapter JSON anchors into segment/fraction positions. The player follows its existing audio clock to select an image and handles loading/fallback separately from audio playback.

**Tech Stack:** Vanilla browser JavaScript, JSON, WebP, Node test runner and Playwright.

**Spec:** docs/superpowers/specs/2026-11-10-player-story-stills-design.md

## Global Constraints

- Four island stills, using the revised third image; existing lab cover after the opening.
- No audio, manuscript, other chapter artwork, fades or animation changes.
- Direct push to main is explicitly authorized; preserve concurrent remote changes.

## Review Focus

- Seeking and replay must select earlier shots immediately.
- Different audio modes must use their own durations.
- Late loads and errors must not show stale artwork or stop audio.
- Chapters with no shot list retain the existing cover.
- Portrait and landscape layouts must show the whole image and retain usable controls.

### Task 1: Resolve script cues

**Files:** reader/story-shots.js, reader/shots/chapter-01.json, assets/story/ch01/*.webp, scripts/tests/story-shots.test.cjs

**Interfaces:** compile(manifest, sheet) returns ordered segment/fraction cues; select(cues, index, fraction) returns the active cue or null.

- [x] Write and run failing behavior tests for phrase boundaries, changed segment ordering, backward seeks, invalid anchors and reset cues.
- [x] Implement resolver and create the ordered WebP assets and cue sheet.
- [x] Run the resolver tests and check all assets decode.

### Task 2: Integrate and verify the Listen player

**Files:** reader/player.js, reader/style.css, index.html, scripts/tests/player-story-state.test.cjs

**Interfaces:** player consumes resolver output and current segment progress; image layer changes only after the selected source loads successfully.

- [x] Establish the missing resolver behavior before implementation; add regression coverage for player image state and the paused-seek clock bug before fixing it.
- [x] Load chapter shot lists, update the artwork on progress/seek/mode changes, and fall back safely on errors.
- [x] Verify cue selection, backward seeking and chapter switching in the supported browser; verify clip mode, missing images and delayed loads in Node integration tests.
- [x] Review the complete diff and run verification. Commit and push after checking the remote head.

Execution notes: The isolated checkout follows the repository's main-only workflow and Joshua's explicit direct-push authorization. Standalone Chromium cannot launch in this executor, so browser QA used the supported managed preview and CUA browser instead. Twelve Node checks pass. The existing player verification harness fails on its baseline fake DOM's missing querySelectorAll; the existing layer harness has two baseline failures around a stale last-segment assumption (184 versus stopOrder 181). Neither is caused by this change.
