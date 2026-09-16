#!/usr/bin/env python3
"""Measure a chapter's prose against the style targets in docs/STYLE_GUIDE.md.

Usage: python3 scripts/style-check.py chapters/part-01/chapter-0002.md [more files]
Prints the metrics, the targets, PASS/FLAG per metric, and the longest sentences
and paragraphs so the writer can find them.
"""
import re, sys, statistics as st

SPLIT = re.compile(r'(?<=[.!?])\s+')
TARGETS = dict(avg_sentence=9.0, median_sentence=7, pct_over_30=0.02, commas=0.5,
               ands=0.3, avg_para=45.0, pct_para_over_80=0.0)

def prose(path):
    t = open(path).read()
    if t.startswith('---'):
        t = t.split('\n---\n', 1)[1]
    t = re.sub(r'^#.*$', '', t, flags=re.M)
    return t

def words(s):
    return re.findall(r"[A-Za-z0-9'’\-]+", s)

def report(path):
    t = prose(path)
    paras = [p.strip() for p in t.split('\n') if p.strip()]
    narration = [p for p in paras if not p.startswith(('"', '“'))]
    sents = [s for p in paras for s in SPLIT.split(p) if re.search('[A-Za-z]', s)]
    nsents = [s for p in narration for s in SPLIT.split(p) if re.search('[A-Za-z]', s)]
    wl = [len(words(s)) for s in sents]
    pl = [len(words(p)) for p in paras]
    m = dict(
        avg_sentence=st.mean(wl), median_sentence=st.median(wl),
        pct_over_30=sum(1 for s in nsents if len(words(s)) > 30) / max(1, len(nsents)),
        commas=sum(s.count(',') for s in sents) / len(sents),
        ands=sum(len(re.findall(r'\band\b', s)) for s in sents) / len(sents),
        avg_para=st.mean(pl), pct_para_over_80=sum(1 for w in pl if w > 80) / len(pl),
    )
    print(f"\n== {path}  ({sum(wl):,} words, {len(sents)} sentences, {len(paras)} paragraphs)")
    for k, target in TARGETS.items():
        v = m[k]; ok = v <= target
        fmt = f"{v:.0%}" if k.startswith('pct') else f"{v:.2f}"
        tf = f"{target:.0%}" if k.startswith('pct') else f"{target}"
        print(f"  {'PASS' if ok else 'FLAG'}  {k:18s} {fmt:>6}  (target <= {tf})")
    longest = sorted(nsents, key=lambda s: -len(words(s)))[:6]
    print("  longest narration sentences:")
    for s in longest:
        print(f"    {len(words(s)):3d}w  {s[:110]}")
    lp = sorted(paras, key=lambda p: -len(words(p)))[:3]
    print("  longest paragraphs:")
    for p in lp:
        print(f"    {len(words(p)):3d}w  {p[:110]}")

if __name__ == '__main__':
    for p in sys.argv[1:] or ['chapters/part-01/chapter-0001.md']:
        report(p)
