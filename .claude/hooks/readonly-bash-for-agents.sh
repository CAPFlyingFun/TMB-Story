#!/usr/bin/env bash
# PreToolUse hook on Bash: when the call comes from a subagent (agent_type is set),
# allow only read-only commands. The main session is unaffected. Exit 2 = block.
set -u
input="$(cat)"
agent="$(printf '%s' "$input" | sed -n 's/.*"agent_type"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"
[ -z "$agent" ] && exit 0

if command -v jq >/dev/null 2>&1; then
  cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"
elif command -v python3 >/dev/null 2>&1; then
  cmd="$(printf '%s' "$input" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))')"
else
  cmd="$(printf '%s' "$input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p' | head -n1)"
fi
[ -z "$cmd" ] && exit 0

deny() { echo "BLOCKED for subagent '$agent': $1. Specialists are read-only; use git log/show/diff/blame/status, cat, grep, find, head, tail, wc, ls." >&2; exit 2; }

# No redirections into files, no command substitution tricks, no in-place edits.
stripped="$(printf '%s' "$cmd" | sed -E 's/2>&1//g; s/2>[[:space:]]*\/dev\/null//g; s/[<>]\(//g')"
printf '%s' "$stripped" | grep -q '>' && deny "output redirection is not allowed"
printf '%s' "$cmd" | grep -Eq '\$\(|`' && deny "command substitution is not allowed"

readonly_git='^(log|show|diff|status|blame|ls-files|ls-tree|rev-parse|rev-list|grep|shortlog|describe|cat-file|show-ref|tag|branch|stash list|name-rev|for-each-ref|reflog|count-objects|whatchanged|check-ignore)$'
allowed_bin='^(cat|head|tail|wc|ls|grep|rg|egrep|fgrep|find|awk|cut|sort|uniq|tr|echo|printf|pwd|date|diff|stat|file|basename|dirname|realpath|test|true|column|nl|fold|tac|xargs|which|env|type)$'

# Split on ; && || | and newlines; check the first word of each segment.
printf '%s\n' "$stripped" | sed -E 's/(&&|\|\||;|\|)/\n/g' | while IFS= read -r seg; do
  seg="$(printf '%s' "$seg" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  [ -z "$seg" ] && continue
  set -- $seg
  bin="$1"
  case "$bin" in
    git)
      sub="${2:-}"; [ "$sub" = "stash" ] && sub="stash ${3:-}"
      printf '%s' "$sub" | grep -Eq "$readonly_git" || { echo "git $sub"; exit 3; }
      case " $* " in *" --write-"*|*" -i "*|*" --amend "*|*" -d "*|*" -D "*|*" --delete "*) echo "git $sub with a writing flag"; exit 3;; esac
      ;;
    sed)  case " $* " in *" -i"*|*" --in-place"*) echo "sed -i"; exit 3;; esac ;;
    find) case " $* " in *" -delete "*|*" -exec "*|*" -ok "*) echo "find with -delete/-exec"; exit 3;; esac ;;
    xargs) case " $* " in *" rm"*|*" mv"*|*" cp"*|*" sed -i"*|*" git "*) echo "xargs into a writing command"; exit 3;; esac ;;
    *) printf '%s' "$bin" | grep -Eq "$allowed_bin" || { echo "$bin"; exit 3; } ;;
  esac
done > /tmp/.ro-hook-verdict.$$ 2>/dev/null
rc=$?
verdict="$(cat /tmp/.ro-hook-verdict.$$ 2>/dev/null)"; rm -f /tmp/.ro-hook-verdict.$$
[ "$rc" = "3" ] && deny "'$verdict' is not a read-only command"
exit 0
