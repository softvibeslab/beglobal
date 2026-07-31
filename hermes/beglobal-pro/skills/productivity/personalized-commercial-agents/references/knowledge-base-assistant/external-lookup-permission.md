# External lookup permission pattern

## Situation

A project-level knowledge assistant was governed by an `AGENTS.md` rule: answer only from files in the project folder, and if a fact is missing, use the configured fallback sentence. The user asked for a public fact not present in the KB: social media profiles.

## Correct handling

1. Search the local KB first for the requested fact.
2. If missing, answer with the configured fallback.
3. If the user then explicitly permits internet search for that class of question, save the permission as a compact user memory.
4. On the next request, perform the external search and clearly label the results as outside the internal KB.
5. Use cautious wording for public profiles: “asociadas a”, “encontré”, “conviene validarlo directamente”.

## Example final wording

> Busqué fuera de la base de conocimiento y encontré estas redes asociadas a [persona]: ...
>
> Nota: esto no estaba en la base interna; lo encontré mediante búsqueda web, así que conviene validarlo directamente abriendo los perfiles.

## Why this matters

This preserves the integrity of the approved knowledge base while still allowing the assistant to be useful when the user explicitly expands the scope.
