#!/usr/bin/env bash
# PreToolUse on Write, Edit, MultiEdit, Bash and PowerShell. Before the first write to
# the content of a plugin or a skill - a file in a skill's folder, an agent, a plugin's
# hook or manifest, the CLAUDE.md or AGENTS.md of a folder holding a plugin - the session
# must have loaded mise-en-place:writing-for-the-brigade. Until then the write is denied with the
# instruction to load it; once it is loaded, every write passes. A shell command counts as
# a write when it names such a file and holds a writing operation.

input=$(cat)

# Fast exit: most calls touch nothing of a plugin or a skill.
grep -qE 'skills|agents|hooks|claude-plugin|CLAUDE\.md|AGENTS\.md' <<<"$input" || exit 0

# Field of the input JSON (perl ships with Git for Windows).
campo() {
  perl -MJSON::PP -0777 -e '
    my $v = decode_json(<STDIN>);
    $v = ref $v eq "HASH" ? $v->{$_} : undef for split /\./, $ARGV[0];
    print $v // "";
  ' "$1" <<<"$input"
}

# A folder holding a plugin, or a marketplace of plugins, carries .claude-plugin/.
holds_plugin() {
  [ -d "$1/.claude-plugin" ]
}

guarded=0
case "$(campo tool_name)" in
  Bash|PowerShell)
    command=$(campo tool_input.command)
    command=${command//\\//}
    cwd=$(campo cwd)
    cwd=${cwd//\\//}
    # Redirections to nowhere write nothing.
    writes=$(sed -E 's#[0-9]?>&[0-9]##g; s#[0-9]?>+ *(/dev/null|\$null|NUL)##g' <<<"$command")
    if grep -qE '(^|[^-])>|sed +-i|sed +[^|;&]* -i|(^|[ |;&(])(tee|cp|mv|rm|touch|install)( |$)|Set-Content|Add-Content|Out-File|Copy-Item|Move-Item|Remove-Item|New-Item|WriteAllText|open\([^)]*["'"'"'][wa]' <<<"$writes"; then
      case "$command" in */.claude/projects/*/memory/*) ;; *)
        if grep -qE '(^|[^A-Za-z0-9_.-])skills/[^ /]+/|\.claude-plugin/' <<<"$command"; then
          guarded=1
        elif grep -qE '(^|[^A-Za-z0-9_.-])(agents/[^ ]*\.md|hooks/)|CLAUDE\.md|AGENTS\.md' <<<"$command" && holds_plugin "$cwd"; then
          guarded=1
        fi ;;
      esac
    fi
    ;;
  *)
    file=$(campo tool_input.file_path)
    file=${file//\\//}
    [ -n "$file" ] || exit 0
    # The memory of Claude Code holds notes, not the content of a plugin.
    case "$file" in */.claude/projects/*/memory/*) exit 0 ;; esac
    case "$file" in
      */skills/*/*) guarded=1 ;;
      */.claude-plugin/*) guarded=1 ;;
      */agents/*.md|*/hooks/*)
        holds_plugin "$(dirname "$(dirname "$file")")" && guarded=1 ;;
      */CLAUDE.md|*/AGENTS.md)
        holds_plugin "$(dirname "$file")" && guarded=1 ;;
    esac
    ;;
esac
[ "$guarded" = 1 ] || exit 0

# Loaded: the skill's text sits in the transcript, opened by its base directory.
transcript=$(campo transcript_path)
if [ -n "$transcript" ] && [ -f "$transcript" ] &&
   grep -qE 'Base directory for this skill: [^"]*mise-en-place[\\/]+[^"]*writing-for-the-brigade' "$transcript"; then
  exit 0
fi

motivo='This write touches the content of a plugin or a skill: first call the Skill tool with \"mise-en-place:writing-for-the-brigade\" and apply it, then try again.'
printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$motivo"
exit 0
