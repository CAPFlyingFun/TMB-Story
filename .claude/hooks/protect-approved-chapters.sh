#!/usr/bin/env bash
# PreToolUse hook: block Edit/Write/MultiEdit on any chapters/**/*.md whose
# frontmatter says `review_status: approved`, on every branch. Backstop for the
# canon-protection rule in CLAUDE.md. Exit 2 = block (stderr is shown to Claude).
set -u
input="$(cat)"

# Collect every file_path in tool_input (Edit/Write carry one; MultiEdit may carry several).
paths=""
if command -v jq >/dev/null 2>&1; then
  paths="$(printf '%s' "$input" | jq -r '[.tool_input | .. | objects | .file_path? // empty] | .[]' 2>/dev/null)"
elif command -v python3 >/dev/null 2>&1; then
  paths="$(printf '%s' "$input" | python3 -c '
import json,sys
def walk(o):
    if isinstance(o,dict):
        if isinstance(o.get("file_path"),str): print(o["file_path"])
        for v in o.values(): walk(v)
    elif isinstance(o,list):
        for v in o: walk(v)
walk(json.load(sys.stdin).get("tool_input",{}))' 2>/dev/null)"
else
  paths="$(printf '%s' "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:[[:space:]]*"//; s/"$//')"
fi

[ -z "$paths" ] && exit 0
cwd="$(printf '%s' "$input" | sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"

while IFS= read -r p; do
  [ -z "$p" ] && continue
  case "$p" in
    */chapters/*.md|chapters/*.md) ;;
    *) continue ;;
  esac
  abs="$p"
  [ "${p#/}" = "$p" ] && abs="${cwd:-$PWD}/$p"
  [ -f "$abs" ] || continue
  # Frontmatter = lines between the first '---' and the next '---'.
  if awk 'NR==1{ if($0!="---") exit 1; next } /^---[[:space:]]*$/{exit 1} {print}' "$abs" \
       | grep -Eq '^review_status:[[:space:]]*approved[[:space:]]*$'; then
    echo "BLOCKED: $p is an APPROVED chapter (review_status: approved). Approved chapters are canon and are never rewritten without an explicit instruction from Joshua naming this chapter. If he has given one, say so in the handoff report and ask him to set review_status to in-review first." >&2
    exit 2
  fi
done <<< "$paths"
exit 0
