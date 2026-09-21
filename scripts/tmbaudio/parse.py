"""Turn a chapter manuscript into an ordered list of speaker-attributed segments.

The rules here are deliberately conservative. Anything the parser cannot attribute by
an explicit, checkable signal is marked REVIEW_REQUIRED rather than guessed, and every
attribution records the METHOD that produced it so a reviewer can see how much of a
chapter rests on inference.

Narration and dialogue are always separate segments, even inside one paragraph, because
a character's dialogue clip has to be reusable in the game on its own.
"""

import hashlib
import re

from .registry import NARRATOR, REVIEW, SYSTEM

# Straight and curly quotes both appear in manuscripts.
QUOTE_RE = re.compile(r'[“"]([^”"]*)[”"]')

SPEECH_VERBS = (
    "said|answered|replied|asked|added|called|murmured|whispered|corrected|pressed|"
    "continued|began|interrupted|agreed|admitted|announced|muttered|shouted|spoke|"
    "told|warned|repeated|insisted|offered|observed|noted|breathed|snapped|explained"
)

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.S)
HEADING_RE = re.compile(r"^#{1,6}\s")


def normalize(text):
    """Collapse whitespace. Used for hashing so formatting never changes an id."""
    return re.sub(r"\s+", " ", (text or "")).strip()


def _canonical_line(text):
    """Lowercase, strip punctuation and spacing, for matching system readouts."""
    return re.sub(r"[^a-z0-9]+", "", (text or "").lower())


def clip_id(speaker_id, tts_text, variant=""):
    """Stable, position-independent clip identity.

    Identity is a function of WHO speaks and WHAT is said, never of where the line sits.
    Inserting a paragraph at the top of a chapter therefore leaves every other clip id
    untouched. Two identical lines by the same speaker share one clip on purpose: that is
    the "voice once" rule, and it is what makes three "Access denied." readouts cost one
    generation instead of three. Pass `variant` to force a distinct clip when a repeated
    line genuinely needs a different delivery.
    """
    payload = "\x1f".join([speaker_id, normalize(tts_text), variant or ""])
    digest = hashlib.sha1(payload.encode("utf-8")).hexdigest()[:12]
    return "%s-%s" % (speaker_id, digest)


def read_manuscript(path):
    """Return (title, [paragraph, ...]) from a chapter Markdown file."""
    with open(path, encoding="utf-8") as fh:
        raw = fh.read()
    body = FRONTMATTER_RE.sub("", raw, count=1)
    title = None
    paragraphs = []
    for block in body.split("\n\n"):
        block = block.strip()
        if not block:
            continue
        if HEADING_RE.match(block):
            if title is None:
                title = re.sub(r"^#{1,6}\s*", "", block).strip()
            continue
        paragraphs.append(normalize(block))
    return title, paragraphs


def split_paragraph(paragraph):
    """Split one paragraph into ordered ('narration'|'quote', text) spans."""
    spans = []
    pos = 0
    for m in QUOTE_RE.finditer(paragraph):
        before = paragraph[pos:m.start()].strip()
        if before:
            spans.append(("narration", before))
        inner = m.group(1).strip()
        if inner:
            spans.append(("quote", inner))
        pos = m.end()
    tail = paragraph[pos:].strip()
    if tail:
        spans.append(("narration", tail))
    return spans


class Attributor:
    """Assigns a speaker to each quoted span, recording how it decided."""

    def __init__(self, registry):
        self.registry = registry
        self.names = registry.name_index()
        self.system_lines = {_canonical_line(s) for s in registry.system_lines()}
        self.last_character = None      # last attributed character, across paragraphs
        self.prev_character = None      # the one before that, for alternation
        # pronoun -> speaker id, updated whenever a name appears in narration, so
        # "He reached for the intercom." resolves to the most recently named "he".
        self.pronoun_owner = {}
        self.pronouns = {}
        for sid, s in registry.characters().items():
            for pr in (s.get("pronouns") or []):
                self.pronouns.setdefault(pr.lower(), set()).add(sid)

    # -- helpers ------------------------------------------------------------
    def _names_in(self, text):
        """Speaker ids named in a span, in order of appearance, de-duplicated."""
        found = []
        seen = set()
        for name, sid in self.names:
            m = re.search(r"\b%s\b" % re.escape(name), text)
            if m and sid not in seen:
                seen.add(sid)
                found.append((sid, m.start()))
        found.sort(key=lambda p: p[1])
        return [sid for sid, _ in found]

    def note_names(self, text):
        """Record who each pronoun currently refers to, from a narration span."""
        for name, sid in self.names:
            for m in re.finditer(r"\b%s\b" % re.escape(name), text):
                for pr in (self.registry.get(sid) or {}).get("pronouns") or []:
                    self.pronoun_owner[pr.lower()] = sid

    def _references(self, sentence):
        """(position, speaker_id) for every name and resolvable pronoun, in order."""
        refs = []
        for name, sid in self.names:
            for m in re.finditer(r"\b%s\b" % re.escape(name), sentence):
                refs.append((m.start(), sid, "name"))
        for pr, owners in self.pronouns.items():
            for m in re.finditer(r"\b%s\b" % re.escape(pr), sentence, re.I):
                owner = self.pronoun_owner.get(pr)
                if owner and owner in owners:
                    refs.append((m.start(), owner, "pronoun"))
        refs.sort(key=lambda r: r[0])
        return refs

    def _actor(self, span, which):
        """The acting character in a narration span next to a quote.

        `which` is "last" for the span before a quote (the sentence that sets up the
        line) or "first" for the span after it (the beat that follows it). The actor is
        the earliest character reference in that sentence, which is the grammatical
        subject in this prose style: "Sarah stared at him... Jack pointed at the
        screen." resolves to Jack, and "She glanced from Jack to the computer."
        resolves to Sarah rather than to Jack.
        """
        if not span:
            return None, None
        sentences = [s for s in re.split(r"(?<=[.!?])\s+", span) if s.strip()]
        if not sentences:
            return None, None
        sentence = sentences[-1] if which == "last" else sentences[0]
        refs = self._references(sentence)
        if not refs:
            return None, None
        return refs[0][1], refs[0][2]

    def _tagged_speaker(self, after):
        """`"..." Sarah answered` or `"..." said Jack` in the span right after a quote."""
        head = " ".join(after.split()[:12])
        for name, sid in self.names:
            n = re.escape(name)
            if re.search(r"\b%s\b\s+\w*\s*\b(%s)\b" % (n, SPEECH_VERBS), head):
                return sid
            if re.search(r"\b(%s)\b\s+\b%s\b" % (SPEECH_VERBS, n), head):
                return sid
        # a pronoun tag, e.g. `"These are clean," she murmured`
        for pr, owners in self.pronouns.items():
            if re.search(r"^\s*%s\s+\b(%s)\b" % (re.escape(pr), SPEECH_VERBS), head, re.I):
                owner = self.pronoun_owner.get(pr)
                if owner and owner in owners:
                    return owner
        return None

    def _lead_tagged_speaker(self, before):
        """`Sarah asked, "..."` in the span right before a quote."""
        tail = " ".join(before.split()[-12:])
        for name, sid in self.names:
            n = re.escape(name)
            if re.search(r"\b%s\b[^.!?]{0,40}\b(%s)\b[^.!?]{0,6}$" % (n, SPEECH_VERBS), tail):
                return sid
        return None

    def _remember(self, sid):
        if sid and sid != self.last_character:
            self.prev_character = self.last_character
            self.last_character = sid
        elif sid:
            self.last_character = sid

    # -- the decision -------------------------------------------------------
    def attribute(self, quote, before, after, speaker_in_paragraph, lone_paragraph_quote):
        """Return (speaker_id, method, note)."""
        # 1. A curated machine readout. Exact data, not a heuristic.
        if _canonical_line(quote) in self.system_lines:
            return SYSTEM, "system-line", ""

        # 2. An explicit dialogue tag on either side of the quote.
        sid = self._tagged_speaker(after) or self._lead_tagged_speaker(before)
        if sid:
            self._remember(sid)
            return sid, "explicit-tag", ""

        # 3. The acting character in the beat immediately before the quote.
        if before:
            sid, kind = self._actor(before, "last")
            if sid:
                self._remember(sid)
                return sid, ("action-beat" if kind == "name" else "pronoun-actor"), ""

        # 4. A later quote in the same paragraph continues the same character, but only
        #    when nothing between them named somebody else, and never inheriting from
        #    the system voice.
        if speaker_in_paragraph and speaker_in_paragraph != SYSTEM and not before:
            return speaker_in_paragraph, "same-paragraph-continuation", ""

        # 4b. The acting character in the beat immediately after the quote. Used only
        #     when nothing before the quote identified a speaker, which is the shape
        #     `"Oh." Jack rolled sideways` and `"No, no, no." He reached for the keyboard`.
        if after:
            sid, kind = self._actor(after, "first")
            if sid:
                self._remember(sid)
                return sid, ("reaction-beat" if kind == "name" else "pronoun-actor"), ""

        # 5. A bare quote on its own line, in a two-hander, alternating. This is an
        #    INFERENCE and is labelled as one so review can weigh it.
        if lone_paragraph_quote and self.last_character and self.prev_character:
            other = self.prev_character
            self._remember(other)
            return other, "alternation", "inferred from the two-speaker exchange"

        return REVIEW, "unresolved", "no explicit speaker signal"


def chapter_number(path):
    """The chapter a manuscript file is, from its name. Used to SCOPE an override."""
    m = re.search(r"chapter-(\d{4})\.md$", str(path))
    return int(m.group(1)) if m else None


def _pin_applies(pin, number, order):
    """Whether a pinned correction is for THIS segment.

    AN OVERRIDE IS KEYED BY SPEAKER PLUS TEXT, WHICH IS GLOBAL, and that is fine for a
    sentence that occurs once and dangerous for one that does not. "No.", "Maybe.",
    "Good." and "Stop." each occur many times across six chapters; a pin written for
    one of them would silently rewrite every other, in the wrong voice, and the only
    symptom would be somebody noticing months later that a line sounds like the wrong
    person -- which is exactly the fault this project has already shipped once.

    So a pin may name the chapters it is for (`chapters: [3, 6]`, or `chapter: 3`) and
    the segment order within them. A pin that names neither still applies everywhere,
    which is right for a line that genuinely occurs once -- and such a pin has to say
    `scope: "everywhere"` so that "applies to every match" is a decision somebody made
    rather than the default nobody checked. A test enforces it.
    """
    scope = pin.get("chapters")
    if scope is None and pin.get("chapter") is not None:
        scope = [pin["chapter"]]
    if scope is not None and number not in [int(x) for x in scope]:
        return False
    at = pin.get("orders")
    if at is None and pin.get("order") is not None:
        at = [pin["order"]]
    if at is not None and order not in [int(x) for x in at]:
        return False
    return True


def parse_chapter(path, registry, overrides=None):
    """Parse one chapter file into an ordered segment list."""
    overrides = overrides or {}
    number = chapter_number(path)
    title, paragraphs = read_manuscript(path)
    attributor = Attributor(registry)
    segments = []

    for p_index, paragraph in enumerate(paragraphs):
        spans = split_paragraph(paragraph)
        quotes_here = [s for s in spans if s[0] == "quote"]
        lone = len(spans) == 1 and spans[0][0] == "quote"
        speaker_in_paragraph = None

        for s_index, (kind, text) in enumerate(spans):
            if kind == "narration":
                attributor.note_names(text)
                segments.append({
                    "speaker": NARRATOR,
                    "method": "narration",
                    "note": "",
                    "displayText": text,
                    "ttsText": text,
                    "paragraph": p_index,
                    "spanInParagraph": s_index,
                })
                continue

            before = spans[s_index - 1][1] if s_index > 0 and spans[s_index - 1][0] == "narration" else ""
            after = spans[s_index + 1][1] if s_index + 1 < len(spans) and spans[s_index + 1][0] == "narration" else ""
            if after:
                attributor.note_names(after)
            sid, method, note = attributor.attribute(
                text, before, after, speaker_in_paragraph, lone)
            if sid != SYSTEM and sid != REVIEW:
                speaker_in_paragraph = sid
            segments.append({
                "speaker": sid,
                "method": method,
                "note": note,
                "displayText": text,
                "ttsText": text,
                "paragraph": p_index,
                "spanInParagraph": s_index,
            })

    # stable identity, then the human overrides, then order
    for i, seg in enumerate(segments):
        seg["order"] = i
        provisional = clip_id(seg["speaker"], seg["ttsText"])
        pinned = overrides.get(provisional)
        if pinned and not _pin_applies(pinned, number, i):
            pinned = None
        if pinned:
            seg["speaker"] = pinned.get("speaker", seg["speaker"])
            if pinned.get("ttsText"):
                seg["ttsText"] = pinned["ttsText"]
            seg["method"] = "override"
            seg["note"] = pinned.get("note", "pinned in audio/speaker-overrides.json")
        seg["clipId"] = clip_id(seg["speaker"], seg["ttsText"], seg.get("variant", ""))

    return {"title": title, "segments": segments}
