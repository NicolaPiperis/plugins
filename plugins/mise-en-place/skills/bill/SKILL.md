---
name: bill
description: "Close a ticket: bring the pantry up to date with what the ticket taught, write its bill (work log, changelog, QA tests), move it to served, commit and push the pantry. Run once chefs-table has passed."
disable-model-invocation: true
---

# Bill

Close the ticket. Its folder is in the pantry, under `core/tickets/pending/{product}/{code}/`.

## 1. Gather what happened

- The `## Comments` of every task in `prep-list/`, `chefs-table.md` included: the richest source, written while the work was done.
- The ticket's commits, in every project's repository it touched (`git log --grep "{code} - T" --stat`), for what the Comments left out.
- `recipe.md`, with the documentation line of its `## Estimate`, and `order.md`.

## 2. Bring the pantry up to date

Two sources: every note under `### For the pantry` in the tasks' Comments, read in full, and the documentation the recipe's estimate planned.

No note goes in as written. Check each one again in the current code, through `locate-stations`, since a later task may have changed it; and against the pantry, through `inventory`, to see whether it confirms, overturns or adds. Drop the notes not worth keeping. Propose the others to `restock` one at a time, in this order: docs first, then the project's `rules/`, then the feature's entries, then the rest. Each is written before the next is proposed.

Done when every note has been checked, those worth keeping settled with the user one at a time, and every one the user accepted is saved.

## 3. Write the bill

Write `bill.md` in the ticket's folder from the template `config/templates/tickets/bill.md`, in the language the pantry is written in. Its sections have different readers, and each guide comment says how to write for its own.

**Every line says one thing, in plain words.** Short sentences in the active voice, with a clear subject: the user, the program, the server. A line that carries two facts becomes two lines. The same word for the same thing throughout, with the names of the glossary and the vocabularies, not of the technology behind them.

**The tests are not invented.** What to test comes from the work that was done, and `chefs-table` knows it best: it had to find out which kind of record each case needs. The number follows the size of the work: one or two for a bug fix, three or four for a feature, more when it earns them. Always one edge or error case, plus the regression tests `chefs-table` ran on other features.

**One bill per ticket, always written as if for the first time.** A ticket that comes back gets its bill rewritten whole, to the state it is in now.

Show the whole bill and wait for an explicit go-ahead: silence is not approval. Then write it.

## 4. Serve the ticket

1. Set the `Status` of `prep-list/bill.md` to `done`.
2. Move the ticket's folder from `pending/` to `core/tickets/served/{product}/{code}/`.
3. Commit the pantry, adding by path the files this ticket wrote; anything else uncommitted stays out, and you say so. Subject `{code} - bill`, with the ticket's code, or its title when it has none; the body lists what entered the pantry: entries, rules, glossary, docs.
4. Push to the pantry's current branch. When the push is rejected, `git pull --rebase --autostash`, then push again.

Done when the push has gone through.
