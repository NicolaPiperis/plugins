# Commit and push in the pantry

All work goes on the pantry's current branch.

## When

At each of these moments, ask the user whether to commit and push. Do both only on a yes: the user knows when a batch of knowledge is complete.

| Moment |
|---|
| end of `recipe` |
| end of `prep-list`, the tasks from the validation included |
| closing the ticket, in `bill` |
| `restock` has written, except when `bill` called it: `bill` commits at the close |

## What goes in

One step per commit. Add the files by path: the ticket's folder, and the entries, docs and config the step changed. Other changes in the working copy stay where they are, and you say so: they may be someone else's work in progress.

## Subject

The first case that applies:

| Case | Subject |
|---|---|
| end of `recipe` | `{code} - recipe` |
| end of `prep-list` | `{code} - prep-list` |
| closing the ticket | `{code} - bill` |
| `restock`, more than 3 areas | the zones touched: `config, docs, technical` |
| `restock` | the areas touched: `config, docs/{product}, technical/{project}` |

`{code}` is the ticket's code, or its title when it has none. An area is `config`, or the path under `core/` down to the project in technical and the product in docs. Several names go in alphabetical order, separated by `, `.

## Body

In the pantry's language: what changed. With more than 3 areas, it ends with the list of areas, one per line.

## Push

To the current branch. When the push is rejected, `git pull --rebase --autostash`, then push again. A pantry with no remote gets the commit only, and you say so.
