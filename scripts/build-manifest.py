#!/usr/bin/env python3
"""Build reader/manifest.json for the static reader page.

Scans the repository (bible/, outline/, chapters/, architecture/) and writes a
JSON manifest the reader loads at boot. Python 3 standard library only.

Usage:  python3 scripts/build-manifest.py   (from anywhere; paths are resolved
        relative to this script's parent directory, i.e. the repo root)

The chapter frontmatter parser understands the subset of YAML used by
chapters/CHAPTER_TEMPLATE.md: `key: value`, nested maps (indentation),
inline `[a, b]` lists, `- item` block lists, `# comments`, and quoted strings.
"""

import json
import os
import re
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "reader", "manifest.json")

BIBLE_ORDER = [
    "STORY_OVERVIEW",
    "CHARACTERS",
    "CREATURES",
    "LOCATIONS",
    "TECHNOLOGY",
    "MYSTERIES",
    "TIMELINE",
    "CONTINUITY_LOG",
    "CHAPTER_INDEX",
]


# --------------------------------------------------------------------------
# Minimal YAML-subset parser
# --------------------------------------------------------------------------

def _strip_comment(text):
    """Remove a trailing `# comment`, respecting quotes."""
    out = []
    quote = None
    for i, ch in enumerate(text):
        if quote:
            out.append(ch)
            if ch == quote:
                quote = None
        elif ch in ("'", '"'):
            quote = ch
            out.append(ch)
        elif ch == "#" and (i == 0 or text[i - 1] in " \t"):
            break
        else:
            out.append(ch)
    return "".join(out).rstrip()


def _split_inline_list(body):
    """Split the inside of `[a, b, "c, d"]` on top-level commas."""
    items = []
    cur = []
    quote = None
    for ch in body:
        if quote:
            cur.append(ch)
            if ch == quote:
                quote = None
        elif ch in ("'", '"'):
            quote = ch
            cur.append(ch)
        elif ch == ",":
            items.append("".join(cur))
            cur = []
        else:
            cur.append(ch)
    if "".join(cur).strip():
        items.append("".join(cur))
    return [_scalar(s.strip()) for s in items if s.strip() != ""]


def _scalar(text):
    """Convert a scalar token into a Python value."""
    text = text.strip()
    if text == "":
        return ""
    if len(text) >= 2 and text[0] == text[-1] and text[0] in ("'", '"'):
        inner = text[1:-1]
        if text[0] == '"':
            inner = inner.replace('\\"', '"').replace("\\n", "\n")
        else:
            inner = inner.replace("''", "'")
        return inner
    if text.startswith("[") and text.endswith("]"):
        return _split_inline_list(text[1:-1])
    low = text.lower()
    if low in ("true", "yes"):
        return True
    if low in ("false", "no"):
        return False
    if low in ("null", "~"):
        return None
    if re.fullmatch(r"-?\d+", text):
        return int(text)
    if re.fullmatch(r"-?\d+\.\d+", text):
        return float(text)
    return text


def parse_yaml_subset(lines):
    """Parse a list of frontmatter lines into a dict."""
    # Pre-process: strip comments, drop blank lines, keep indentation.
    cleaned = []
    for raw in lines:
        line = _strip_comment(raw.rstrip("\n"))
        if line.strip() == "":
            continue
        indent = len(line) - len(line.lstrip(" "))
        cleaned.append((indent, line.strip()))

    def parse_block(idx, indent):
        """Parse a mapping block whose keys sit at `indent`. Returns (obj, next_idx)."""
        result = {}
        while idx < len(cleaned):
            ind, text = cleaned[idx]
            if ind < indent:
                break
            if ind > indent:
                # Stray deeper line with no parent key; skip.
                idx += 1
                continue
            m = re.match(r"^([A-Za-z0-9_\-\.]+)\s*:\s*(.*)$", text)
            if not m:
                idx += 1
                continue
            key, rest = m.group(1), m.group(2)
            idx += 1
            if rest.strip() == "":
                # Nested map or block list follows (or empty).
                if idx < len(cleaned) and cleaned[idx][0] > indent:
                    child_ind, child_text = cleaned[idx]
                    if child_text.startswith("- "):
                        items = []
                        while idx < len(cleaned) and cleaned[idx][0] == child_ind and cleaned[idx][1].startswith("- "):
                            items.append(_scalar(cleaned[idx][1][2:]))
                            idx += 1
                        result[key] = items
                    else:
                        child, idx = parse_block(idx, child_ind)
                        result[key] = child
                else:
                    result[key] = ""
            else:
                result[key] = _scalar(rest)
        return result, idx

    obj, _ = parse_block(0, 0)
    return obj


def read_frontmatter(path):
    """Return (frontmatter dict, remaining body text) for a Markdown file."""
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()
    if not text.startswith("---"):
        return {}, text
    lines = text.split("\n")
    if lines[0].strip() != "---":
        return {}, text
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        return {}, text
    fm = parse_yaml_subset(lines[1:end])
    body = "\n".join(lines[end + 1:])
    return fm, body


# --------------------------------------------------------------------------
# Repository scan
# --------------------------------------------------------------------------

def rel(path):
    return os.path.relpath(path, ROOT).replace(os.sep, "/")


def scan_parts():
    parts = []
    outline_dir = os.path.join(ROOT, "outline")
    if not os.path.isdir(outline_dir):
        return parts
    for name in sorted(os.listdir(outline_dir)):
        m = re.fullmatch(r"part-(\d+)", name)
        if not m:
            continue
        d = os.path.join(outline_dir, name)
        if not os.path.isdir(d):
            continue
        overview = os.path.join(d, "overview.md")
        arcs = sorted(
            rel(os.path.join(d, f))
            for f in os.listdir(d)
            if re.fullmatch(r"mini-arc-\d+\.md", f)
        )
        parts.append({
            "number": int(m.group(1)),
            "dir": rel(d),
            "overview": rel(overview) if os.path.isfile(overview) else None,
            "miniArcs": arcs,
        })
    parts.sort(key=lambda p: p["number"])
    return parts


def _as_int(v, default=0):
    try:
        return int(v)
    except (TypeError, ValueError):
        return default


def _as_str(v):
    if v is None:
        return ""
    if isinstance(v, (list, dict)):
        return ""
    return str(v)


def scan_chapters():
    chapters = []
    chapters_dir = os.path.join(ROOT, "chapters")
    if not os.path.isdir(chapters_dir):
        return chapters
    for part_name in sorted(os.listdir(chapters_dir)):
        pm = re.fullmatch(r"part-(\d+)", part_name)
        if not pm:
            continue
        pd = os.path.join(chapters_dir, part_name)
        if not os.path.isdir(pd):
            continue
        for f in sorted(os.listdir(pd)):
            cm = re.fullmatch(r"chapter-(\d{4})\.md", f)
            if not cm:
                continue
            path = os.path.join(pd, f)
            try:
                fm, _ = read_frontmatter(path)
            except Exception as exc:  # keep going; a bad file must not sink the manifest
                print("warning: could not parse %s: %s" % (rel(path), exc), file=sys.stderr)
                fm = {}
            number = _as_int(fm.get("chapter"), int(cm.group(1)))
            chapters.append({
                "number": number,
                "path": rel(path),
                "part": _as_int(fm.get("part"), int(pm.group(1))),
                "title": _as_str(fm.get("title")),
                "pov": _as_str(fm.get("pov")),
                "word_count": _as_int(fm.get("word_count"), 0),
                "review_status": _as_str(fm.get("review_status")) or "draft",
                "audio_status": _as_str(fm.get("audio_status")) or "not-started",
                "ending_type": _as_str(fm.get("ending_type")),
            })
    chapters.sort(key=lambda c: (c["number"], c["path"]))
    return chapters


def scan_bible():
    bible_dir = os.path.join(ROOT, "bible")
    files = []
    if not os.path.isdir(bible_dir):
        return files
    present = {f[:-3]: f for f in os.listdir(bible_dir) if f.endswith(".md")}
    ordered = [k for k in BIBLE_ORDER if k in present] + sorted(k for k in present if k not in BIBLE_ORDER)
    for key in ordered:
        files.append({
            "key": key,
            "label": key.replace("_", " ").title(),
            "path": "bible/" + present[key],
        })
    return files


def scan_architecture():
    out = {}
    for key, name in (("architecture", "SERIES_ARCHITECTURE.md"), ("decisions", "DECISIONS.md")):
        p = os.path.join(ROOT, "architecture", name)
        out[key] = rel(p) if os.path.isfile(p) else None
    return out


def main():
    manifest = {
        "generated": date.today().isoformat(),
        "parts": scan_parts(),
        "chapters": scan_chapters(),
        "bible": scan_bible(),
        "architecture": scan_architecture(),
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print("wrote %s: %d part(s), %d chapter(s), %d bible file(s)" % (
        rel(OUT), len(manifest["parts"]), len(manifest["chapters"]), len(manifest["bible"])))


if __name__ == "__main__":
    main()
