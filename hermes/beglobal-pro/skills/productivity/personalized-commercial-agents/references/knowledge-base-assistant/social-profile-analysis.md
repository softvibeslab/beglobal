# Social profile analysis for KB-governed persona agents

Use when the user asks to analyze a public social profile for a brand/persona already governed by a local KB.

For Mario Villanueva-style persona work, treat Instagram/latest social activity as a **radar de contexto**: it helps detect what he is currently focused on, recent topics, tone, events, alliances, CTAs, and content direction. It should inform the answer, but not replace the internal KB as the source of approved facts.

## Concise workflow

1. Read governing KB instructions first (`AGENTS.md`, tone, brand, services, social-links if present).
2. Open the supplied profile URL and collect only public signals:
   - title/name/handle/verified status
   - bio/category/CTA/link text
   - follower/post counts if visible
   - highlights
   - pinned/recent post captions and repeated themes
3. Cross-check identity against the KB:
   - unique method names, project names, brand phrases, domains, collaborators, industries
   - avoid homonyms unless several signals match
4. Synthesize for strategy:
   - current positioning shown by the profile
   - overlap with KB positioning
   - gaps/opportunities
   - one recommended next decision or question
5. If the profile is verified enough and the project has a social-links KB file, patch that KB with:
   - URL/handle
   - visible name/bio/category
   - observed public counts with “approximately”
   - date-sensitive note
   - evidence bullets

## Response style

For chat/Telegram, keep the result short unless asked for a full audit:

- “Ya lo revisé.”
- 3–5 bullets of what the profile signals
- 1 crisp positioning/propuesta de valor line
- 1 next-step question

## Pitfalls

- Do not treat follower counts, bios, or recent posts as permanent facts.
- Do not merge external findings into the approved KB narrative without provenance.
- Do not call a profile official from username alone; require multiple matching signals.
- Do not produce a long marketing audit when the user is testing conversation flow.
