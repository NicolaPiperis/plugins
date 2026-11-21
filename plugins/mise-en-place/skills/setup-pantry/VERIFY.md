# Verify a pantry

Compare the pantry with [seed/](seed/) and bring it up to date with the user, one file at a time.

A difference has one of two causes: the plugin changed the seed, or someone changed the pantry. The pantry's git history tells them apart.

## What is compared

| Part | What to do |
|---|---|
| `README.md`, every file under `config/templates/` | compare file by file |
| the folders under `core/` | create the missing ones, with their `.gitkeep` |
| `pantry.yaml` | check its fields are there; their values are the user's |
| `config/vocabulary/` | check its files exist; their content is the user's data, left as it is |

## Who changed it

For each file that differs, read its history in the pantry: `git log --oneline -- <file>`.

- **Touched only by the commit that created the pantry, with no uncommitted change**: nobody adapted it, so the difference comes from the plugin. Recommended: **apply** the seed's version.
- **Touched by a later commit, or changed in the working tree**: someone adapted it. Show the two versions side by side. Recommended: **merge**, bringing into the user's file only what the seed added and keeping their changes.

A file the seed has and the pantry lacks: recommended **add**.

A template the pantry has and the seed no longer has: untouched since the pantry was created, recommended **delete**; edited later, or never in the seed, recommended **keep**: it may be the user's own.

## One file at a time

Show each difference with the recommended answer first, and write it on the user's go.

Done when every difference has had its answer. Then list the files changed: committing them is left to the user.
