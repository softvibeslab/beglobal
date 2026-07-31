# Markdown agent-library inspection notes

Use this when a repo is mostly `.md` agent/persona files plus converter/install scripts, rather than an application codebase.

## Inspection pattern

1. Confirm repo basics: path exists, `du -sh`, `git status --short --branch`, `git remote -v`, last commit.
2. Count tracked/files by type without relying only on LOC tools:
   - total files excluding `.git`
   - Markdown count
   - category/directory counts
   - total text lines across `.md`, `.sh`, `.yml`, `.yaml`, `.json`, `.mdc`
3. Read the top-level `README.md`, integration docs, strategy/orchestration docs, CI workflow, and key scripts (`install.sh`, `convert.sh`, `lint-agents.sh`).
4. Run project-native lint if present. For agent libraries, distinguish:
   - real agent files with frontmatter
   - strategy/reference docs that may not be intended to pass agent-frontmatter lint
5. Inspect git diffs carefully. A diff stat with `0 insertions, 0 deletions` often means file-mode-only changes; verify with `git diff --stat` and diff headers.

## Findings format

Keep the user-facing summary short:
- what it is
- size/structure
- most useful parts
- problems/risks
- recommended next step

Avoid long file inventories unless asked.