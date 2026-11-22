---
name: restock
description: Write to the pantry: record a gotcha, a decision or a pattern, add a coding rule, register a vocabulary name, create a new level. Use when the user asks to save something to the pantry, and when another skill hands over knowledge to keep. Reading has its own skill, inventory.
---

# Restock

You are the gatekeeper of what the pantry knows: entries, level documents, coding rules and vocabulary names. Reading has its own skill: `inventory`.

**Guiding principle:** discipline first. Ten high-quality entries beat a hundred noisy ones.

**The pantry's structure is not described here.** Its `README.md` says how it is laid out, and `config/` holds the vocabularies and the templates that govern it. Read them at runtime: they evolve with the pantry.

**Write in the language the pantry is already written in**; in an empty pantry, in the user's language.

## 1. Find the pantry

Find the active pantry through `locate-stations`.

## 2. The vocabularies

Four vocabularies in `config/vocabulary/` fix the names. Read the ones your write touches.

| File | Governs |
|---|---|
| `projects.yaml` | `project`, in technical: the codebases |
| `products.yaml` | `product`, in docs and tickets, with the projects each product runs on |
| `topology/{project}.yaml` | `module` and `feature`, and `topic` in docs |
| `tags.yaml` | `tags`: cross-cutting subjects |

What the files do not say themselves:

- **Technical speaks of codebases, docs and tickets speak of products.** A gotcha lives in one project's code; a manual covers a product as a whole. The same word may appear in both: same entity, two angles.
- **A topology file is a vocabulary of names, not a map of the code**: the code itself is that map. It comes into existence with the first entry that needs it.
- **A tag is a technical subject**: never a module, never a business domain. Those are already said by the project, the product and the path.

## 3. What goes where

Three **entry types**, each a file `{type}-{slug}.md` in its own folder:

| Type | Folder | What it holds |
|---|---|---|
| `gotcha` | `gotchas/` | a trap: something behaves in a way that catches you out |
| `pattern` | `patterns/` | how a recurring thing is done here |
| `decision` | `decisions/` | why we chose this over the alternatives |

**Level documents** are not entries: one per level, fixed filename, no type.

| File | Where | What it holds |
|---|---|---|
| `map.md` | every level | the index of the level, one line per entry |
| `rules/general.md` | project | the project's coding rules |
| `rules/design-system.md` | project with an interface | the interface rules |

A level document is updated whenever the level it describes changes. The test is whether it still matches reality: a change that does not alter how the thing works leaves nothing to update.

**The docs area has no entries**: every node carries a level document, `overview.md` for product, module and feature, `topics/{topic}/topic.md` for a topic. It says what each feature does, its rules and the settings that change it, in the user's words: classes, tables and code paths stay in technical. The words of the domain are fixed in the product's `glossary.md`, which `menu` keeps; the rest of docs uses them.

A coding rule (*"every component extends `BaseComponent`"*) goes in `rules/`: entries describe the system, rules are what the code must comply with. What the user sees goes in docs.

## 4. Writing an entry

The template of what you write, in `config/templates/`, carries its frontmatter and its headings, with a guide comment under each. Read it before writing.

Fill the frontmatter down to your `level` and remove the lines below it. **The body template is the contract**: its headings are the only sections allowed, the ones whose guide comment opens with `required` must be there, the rest you include when you have something to put in them. Strip the guide comments from the finished file.

1. **Check the vocabularies first.** Every name must already exist. A missing one is registered as a separate, confirmed action (section 7).
2. **Propose the tags** the entry actually deals with, from `tags.yaml`. A subject that deserves a tag of its own is registered first (section 7); otherwise the field stays empty.
3. **Write the map line as a decision aid.** Title and summary together are what a future reader decides on. The title carries the rule, the summary carries **when it bites**: what breaks, on which path, under what condition. The test: would a colleague working on another feature know, from this line alone, whether it concerns them?
4. **Show the entry whole before writing it**, exactly as it will be saved: frontmatter, title, body and map line. Say how each claim is known, and wait for the user's go.
5. **Write it**, then update the level's `map.md`, and those above it if the entry is promoted.

Done when the entry and its map line are saved exactly as the user approved them.

### How much to write

**The title is a sentence that states the fact, not a label that names the subject.** *"An event closes on a STATE, not on the last action"* tells a reader in the map whether it concerns them; *"HTTP error handling"* makes them open it to find out. Around a dozen words.

**The body must be worth more than the title and summary above it.** It is read by someone who has already decided the entry concerns them and wants to know what to do. Four things are never worth their words:

- **the history of the defect**: how many times it was got wrong does not change what you do today;
- **alternatives considered and dropped**: that is a decision, or it stays in the ticket;
- **a copy of the code**: name the symbol and say in words what it does; for a list, say how to find it. A snippet belongs only where it is a template to reuse;
- **a derivation the reader does not have to redo**: give the result.

For scale, not as a ceiling: a gotcha runs about 240 words, a decision 300, a pattern 400.

### Placement

**The area follows the reader, not the subject.** What serves someone writing code goes in technical; what serves someone using the product goes in docs. The same subject may live in both, never the same content.

**Put the entry in the project the code belongs to.** Knowledge that spans server and client is split, each part in its own project.

**Level: the lowest one that covers the entry's whole scope.** If it holds for one feature it sits on that feature; for two or more, it rises to the module; and so on up to the project. Placing it higher "to be safe" puts it in front of people it does not concern. A module that does several distinct things has a feature for each, registered when missing (section 7).

## 5. Writing a coding rule

A coding rule goes in the project's `rules/`, one per `##`: in `design-system.md` when it is about the interface (components, layout, styles, on-screen text), in `general.md` otherwise. Their template says how to write one. When you create one of the two files, link it under `## Rules` in the project's `map.md`.

## 6. Creating a new level

When the first entry of a level not yet in `core/` is written, or on request, create its skeleton: the missing `map.md` files along the chain down to that level. Confirm before creating it.

## 7. Registering a vocabulary name

A name an entry needs is registered, never coined inside the entry. First check whether a similar name already exists, to avoid synonyms; then add it to the right vocabulary, leaving valid YAML.

**Registering is ordinary flow.** When an entry's exact level does not exist, registering it is the way forward: placing the entry higher to avoid it is the commonest form of drift. Propose the name and its place, and wait for the user's go.

## 8. Promotion

An entry rises a level when it holds for two or more units of the level below. **Propose** it and wait for the go. The highest level is the project. A promoted entry keeps its type: a gotcha at project level is still a gotcha.

## 9. Commit and push

Before any commit or push to the pantry, read [git.md](./git.md) beside this skill, and follow it.

## What to save

- **A gotcha or a pattern** is saved only when all four hold: a genuine discovery rather than official documentation, useful in six months, verified behaviour, a clear trigger for consulting it. Every claim in it is checked before it is proposed, against what this machine holds: the code, a library. What you could not check stays out.
- **A decision** is saved only when it passes the three tests in [WHEN-A-DECISION.md](./WHEN-A-DECISION.md). Read it before proposing one.

Leave out ordinary bug fixes already in the ticket, volatile details, session logs, unverified hypotheses, and anything already in a `CLAUDE.md` or a README.

## Boundaries

You write files in the pantry, read code and data only to check a claim, and run git as [git.md](./git.md) says.
