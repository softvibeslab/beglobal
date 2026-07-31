#!/usr/bin/env bash
set -euo pipefail

# Generic installer for a portable Hermes skill pack.
# Run from the unpacked folder that contains category directories such as productivity/.

PACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -n "${HERMES_PROFILE:-}" ]]; then
  SKILLS_ROOT="$HOME/.hermes/profiles/$HERMES_PROFILE/skills"
else
  SKILLS_ROOT="$HOME/.hermes/skills"
fi

mkdir -p "$SKILLS_ROOT"

for category_dir in "$PACK_DIR"/*; do
  [[ -d "$category_dir" ]] || continue
  category="$(basename "$category_dir")"
  [[ "$category" == "client-agents" ]] && continue
  [[ "$category" == .* ]] && continue

  # Only copy directories that look like skill directories.
  found=0
  for skill_dir in "$category_dir"/*; do
    [[ -f "$skill_dir/SKILL.md" ]] || continue
    mkdir -p "$SKILLS_ROOT/$category"
    cp -R "$skill_dir" "$SKILLS_ROOT/$category/"
    found=1
    echo "Installed skill: $category/$(basename "$skill_dir")"
  done

  [[ "$found" == "1" ]] || true
done

echo "✅ Skills installed into: $SKILLS_ROOT"
echo "Restart Hermes or open a new session so the skills are detected."
