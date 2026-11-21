---
name: inventory
description: Read what the pantry already knows about the point you work on: the traps, the decisions, the patterns, the rules, what the products do. Use before going into a project's code, and when the user asks what is known about something. Writing has its own skill, restock.
---

# Inventory

The **pantry** is the knowledge base of the mise-en-place skills. This skill is how you read it; writing has its own skill and its own discipline, `restock`.

The pantry is not only a source of truth: it is the **operating guide** you work against. Before acting, take in what binds the point you work on: the gotcha, decision and pattern entries, and the level documents that describe it.

## 1. Find the pantry

Find the active pantry through `locate-stations`.

Then read the pantry's `README.md`: it describes the areas, the levels, the entry types and the level documents. Done when you know the chain of levels that leads to your point.

## 2. Read the chain

Locate the point you work on (project → module → feature) and read its chain in both `technical` and `docs`. Starting from a product, `config/vocabulary/products.yaml` lists the projects under it. The `tickets` area is read only when working on a specific ticket.

**Read the index of every node in the chain, top-down, from the highest node down to yours. Skip nothing.**

- In technical the index is `map.md`: a one-line summary of every entry at its level, so the whole chain in maps costs a fraction of a single level read in full.
- In docs it is `overview.md`, read whole.

**The product's `glossary.md` is read whole**, whatever the point: it is the domain's vocabulary. When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the glossary. Don't drift to synonyms the glossary explicitly avoids. If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `menu`).

**Then open the entries the map lines call for, at every level, your own included.** An entry whose line bears on the work in hand is opened; one whose line does not stays closed. Decide on the whole line, title and summary together, and open the entry when the line does not settle it. What lives at your point and above binds it: what you skip, you skip on your own responsibility.

**The project's rules are read whole by whoever writes code**, since the code must obey them: `rules/general.md` always, `rules/design-system.md` when the work touches the interface.

**An entry applies prescription by prescription.** Its scope is declared by its frontmatter and body, never by its title or filename: an entry about another module can still bind you, and one whose prescriptions are half off-topic still binds through the other half.

Sibling branches, other modules and sister features, are read only when the work touches them. Where the pantry holds nothing yet for your point, **proceed silently**. Don't flag the absence; don't suggest creating entries upfront.

Done when every index in the chain is read and every entry its lines call for is open.

## 3. Apply and report

**Reading is not applying.** Apply every prescription that bears on the work, and report back to whoever invoked you what you applied.

If your output contradicts an existing decision entry, surface it explicitly rather than silently overriding:

> _Contradicts decision-<slug>, but worth reopening because…_

A copy of the code in an entry (a snippet, a line number, a list) is checked against the code before you rely on it. `locate-stations` gives you the project's path.

## 4. Flag stale entries

`last_verified` is the last time an entry was confirmed correct, not the last time it changed: an entry can be valid though untouched for long.

On the entries you open, flag any whose `last_verified` is older than **3 months** in `technical` or **12 months** in `docs`. It is an invitation to re-check, not a verdict. Tickets are excluded.
