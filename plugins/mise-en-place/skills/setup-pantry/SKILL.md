---
name: setup-pantry
description: "Set up your pantry: create a new, empty one, connect to one that already exists, switch to another, or bring it up to date with the plugin. Run once before the first use of the other mise-en-place skills, again to switch pantry, and after updating the plugin."
disable-model-invocation: true
---

# Setup pantry

The **pantry** is the knowledge base the mise-en-place skills read from and write to: what the kitchen knows about the code (`technical`), what the products do (`docs`), and every ticket (`tickets`). A user may know several pantries (their own, their company's), one of them active at a time.

Two files tie it together:

- **`pantry.yaml`**, at the pantry root, describes the pantry. Its presence is what makes a folder a pantry.
- **The pointer**, `~/.claude/mise-en-place.yaml`, tells the skills which pantry is active and where each known pantry sits. It is personal: each user has their own.

This skill writes the pantry and the pointer. It is prompt-driven: explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Read the pointer.

- **Its active pantry is a folder holding a `pantry.yaml`**: the user already has a pantry. Tell them which one is active and which others are known, and stop. If they asked you to verify it, follow [VERIFY.md](VERIFY.md). If they want to switch, or to add another pantry, go on to step 2.
- **Its active pantry is a folder without a `pantry.yaml`, or a folder that is gone**: tell the user, then go on to step 2.
- **There is no pointer**: go on to step 2.

A pointer from an earlier version is brought up to date first, and the user is told: one at `~/.claude/brigade.yaml` moves to `~/.claude/mise-en-place.yaml`; one in the old shape, a bare `pantry: <path>` with no `pantries`, is rewritten in the shape of step 4, keeping its path and its projects.

Done when you know which of the three cases applies.

### 2. Ask

One question, one answer, then the next. Lead each question with the recommended answer, so the user can accept it in a word.

**Which pantry.** When the pointer knows other pantries, list them as numbered options first, then a new pantry and another existing one.

With no other pantry known:

> Do you want a new pantry, or to connect to one that already exists? (recommended: **new**)

A known pantry needs nothing more: go on to step 3.

**New pantry: its name.** Ask what to call it, proposing the user's name; the pantry is `{name}-pantry`, and that is also its folder's name.

**New pantry: where.** Propose `~/{name}-pantry`. The folder must be empty or not exist yet.

**Existing pantry: where.** A folder on this machine, or a git URL to clone (then ask where to clone it). Check that its root holds a `pantry.yaml`; a folder without one is not a pantry, so tell the user and ask again.

Done when you have a folder and know whether to create it or connect to it.

### 3. Confirm

Show the user a draft:

- **New pantry**: the folder tree you will create from [seed/](seed/), and the pointer.
- **Existing or known pantry**: the pointer.

Let them edit it. Done when the user approves the draft.

### 4. Write

**New pantry:**

1. Copy [seed/](seed/) into the folder.
2. Set `name` in `pantry.yaml` to `{name}-pantry`, and `created` to today's date.
3. Run `git init` and commit everything as the first commit.

**Every case**, write the pointer: add the pantry under `pantries` when it is not there, keyed by the `name` in its `pantry.yaml`, and make it the active one. Leave the other pantries and their projects as they are.

```yaml
pantry: nick-pantry                  # the active one
pantries:
  nick-pantry:
    path: C:/Users/nick/nick-pantry
    projects: {}                     # filled by locate-stations
```

Two pantries carrying the same name: ask the user for another key for the one being added.

Done when `pantry` names an entry whose `path` holds a `pantry.yaml`.

### 5. The glossary, in every conversation

The skills read the product's glossary when they run, but a quick request runs no skill. So offer to add one line to the user's global instructions, `~/.claude/rules/mise-en-place.md`, which every conversation loads:

> When your work names a domain concept, read the product's `glossary.md` in the active pantry through `mise-en-place:inventory`, and use its terms.

Write it on the user's go. When the file already holds it, leave it as it is.

### 6. Done

Tell the user which pantry is active and where it is. To switch pantry they run this skill again; after updating the plugin, they run it and ask it to verify the pantry.
