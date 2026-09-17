#!/usr/bin/env python3
"""Measure a chapter's prose against the style targets in docs/STYLE_GUIDE.md.

Usage: python3 scripts/style-check.py chapters/part-01/chapter-0002.md [more files]
Prints the metrics, the targets, PASS/FLAG per metric, and the longest sentences
and paragraphs so the writer can find them.
"""
import re, sys, statistics as st

SPLIT = re.compile(r'(?<=[.!?])\s+')
TARGETS = dict(avg_sentence=12.0, median_sentence=10, pct_over_30=0.03, commas=0.7,
               ands=0.4, avg_para=45.0, pct_para_over_80=0.02)

# Word-count guidance (decision 0020): about 1,200-1,400 normally, about 1,000 the
# normal minimum, and about 1,600-1,800 for an important chapter that needs the room.
WORDS_MIN, WORDS_LOW, WORDS_HIGH, WORDS_MAX = 1000, 1200, 1400, 1800

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
    total = sum(wl)
    if total < WORDS_MIN:
        note = f"under the {WORDS_MIN:,} minimum"
    elif total > WORDS_MAX:
        note = f"over the {WORDS_MAX:,} ceiling for an important chapter"
    elif total > WORDS_HIGH:
        note = f"above the normal {WORDS_LOW:,}-{WORDS_HIGH:,} band (fine if the chapter earns it)"
    else:
        note = "within target"
    print(f"\n== {path}  ({total:,} words, {note}; {len(sents)} sentences, {len(paras)} paragraphs)")
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

BRITISH = [
    (r"\bproperly\b", "properly -> all the way / really / right"),
    (r"\blove\b(?=[,.!?\"])", "love (endearment) -> hon / sweetheart"),
    (r"\bSorry\?", "Sorry? -> What?"),
    (r"\bcross\b(?! the| it| to| over| out| off| a | on)", "cross (angry) -> mad"),
    (r"\b(another|a|one more) go\b", "a go -> a try / round two"),
    (r"\bin the wet(?=[.,;!?])", "in the wet -> in the rain / when it's wet"),
    (r"\bkit\b", "kit -> gear"),
    (r"\bthe state of you\b", "the state of you -> look at you"),
    (r"\bmoving house\b", "moving house -> moving out / moving"),
    (r"\bcarpet\b", "carpet (rolled) -> rug"),
    (r"\bcupboards?\b", "cupboard -> cabinet"),
    (r"\bweed\b(?!s)", "weed (shore) -> seaweed"),
    (r"\bthe sea\b", "the sea -> the ocean / the tide / the water"),
    (r"\bparcel\b", "parcel -> package"),
    (r"\bbackwards\b", "backwards -> backward"),
    (r"\bworked? (it )?out\b", "work out -> figure out"),
    (r"\bgarden\b", "garden (yard) -> yard"),
    (r"\bhalf past\b|\bquarter (to|past)\b|\bhalf (one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b", "clock -> six forty-five / ten thirty"),
    (r"\bthe whole of it\b", "the whole of it -> the whole story / all of it"),
    (r"\bwhilst\b|\bquite\b|\brather\b|\ba bit\b|\bbrilliant\b|\brubbish\b|\bsorted\b|\bmate\b|\bbloke\b|\bqueue\b|\bflat\b(?= (above|below|upstairs|downstairs))|\btorch\b|\btap\b|\bbin\b|\bjumper\b|\btrousers\b|\bholiday\b|\bfortnight\b|\bpost\b(?= (came|arrived|box))|\bpetrol\b|\blorry\b|\bpavement\b|\bmaths\b|\bMum\b|\bat the weekend\b|\bdifferent to\b|\bin hospital\b|\bhad got\b|\bhave got\b|\bhas got\b", "British word"),
    (r"\bthe sum\b", "the sum -> the math"),
    (r"\bdid the (boots|plates|numbers|dishes|jars)\b", "did the X -> cleaned / got / gave"),
]

def british(path):
    t = prose(path)
    hits = []
    for pat, note in BRITISH:
        for m in re.finditer(pat, t):
            s = max(0, m.start() - 40); e = min(len(t), m.end() + 40)
            hits.append((note, t[s:e].replace('\n', ' ')))
    print(f"  british-isms: {len(hits)}")
    for note, ctx in hits[:40]:
        print(f"    {note:45s} ...{ctx}...")

NAMES = ["Jack", "Sarah", "Lena", "Ortiz", "Bennett", "TOMBS", "Tombs", "Control"]
NAME_RE = re.compile(r"\b(" + "|".join(NAMES) + r")\b")

def audio(path):
    """One-narrator clarity (decision 0017).

    The listener has no quotation marks and no paragraph breaks, so a speaker
    must be identifiable AS THE LINE IS HEARD, or from what was just heard
    before it. Two failures are reported:

    LATE   the paragraph names its speaker only after a long stretch of speech,
           so the listener hears the line first and learns who said it after.
           A short line followed by a tag ("I'm here," Sarah said.) is
           fine and is not reported.
    OPEN   nothing in the paragraph, and nothing in the narration immediately
           before it, names a speaker. A/B alternation does NOT count: naming
           speaker A does not identify the next line as speaker B. Short
           exchanges can legitimately stay open, so these are reported for
           judgement rather than failed automatically.
    """
    t = prose(path)
    paras = [p.strip() for p in t.split("\n") if p.strip() and not p.startswith("#")]
    late, open_, streak = [], [], []
    carry = False          # the narration just before named somebody
    for para in paras:
        qi = para.find('"')
        if qi < 0:
            qi = para.find("\u201c")
        if qi < 0:                       # narration
            carry = bool(NAME_RE.search(para))
            continue
        before, after = para[:qi], para[qi:]
        if NAME_RE.search(before):
            carry = False
            streak = []
            continue
        m = NAME_RE.search(after)
        if m:
            spoken = len(re.findall(r"[A-Za-z']+", after[:m.start()]))
            streak = []
            if spoken > 12 and not carry:
                late.append((spoken, para))
        elif not carry:
            streak.append(para)
            # Decision 0020 / the two-turn guideline: up to two unanchored turns in a
            # row are acceptable when the context carries them; the third wants an
            # anchor.
            if len(streak) >= 3:
                open_.append(para)
        else:
            streak = []
        carry = False
    print(f"  dialogue anchored late (name arrives after the line): {len(late)}")
    for n, para in late:
        print(f"    {n} words before the name: {para[:90]}")
    print(f"  third-or-later unanchored dialogue turn in a row: {len(open_)}")
    for para in open_[:25]:
        print(f"    {para[:90]}")

if __name__ == '__main__':
    for p in sys.argv[1:] or ['chapters/part-01/chapter-0001.md']:
        report(p)
        british(p)
        audio(p)
