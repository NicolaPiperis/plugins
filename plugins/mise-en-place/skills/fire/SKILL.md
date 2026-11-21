---
name: fire
description: "Implement one task of a ticket's prep list, working from the recipe and from the task file itself. Use when a task is handed over to be built."
---

Implement the work described in the ticket's recipe and in the task.

The task is a file in the ticket's `prep-list/`, under the pantry's `core/tickets/pending/{product}/{code}/`; the recipe is the `recipe.md` beside it. State the task's title before starting. If the reference is ambiguous, ask.

Before writing code, read the project's rules in the pantry, `core/technical/{project}/rules/`: `general.md` always, `design-system.md` when the task touches the interface. They are binding, and `passe` checks the diff against them. Those files and nothing else from the pantry: the entries that bear on this work came through the recipe.

Go into the code through `locate-stations`. The recipe settled the design, not every symbol you are about to touch.

Before creating a shared code element (an entity, DTO, enum, constant, interface, helper, component or the like), look for an existing one that serves the purpose, to reuse or extend it; create a new one when none fits.

Write to the OWASP Top 10: what you write, patterns you copy included, guards against the risks it is exposed to. Existing code is no proof of safety.

Call the Skill tool with "mise-en-place:taste" where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

## Commit and review

Work on the current branch.

1. Commit your work: one commit in every repository the task changed. Subject `{code} - T{NN}`, with the ticket's code, or its title when it has none; body, one line on what the task made work.
2. Call the Skill tool with "mise-en-place:passe" to review the work, with the commit before the task's as the fixed point.
3. Fix the issues the review raised, and commit the fixes with the same subject, the body saying what the review changed.
4. Set the task's `Status` to `done`.

## Comments

What you did goes in the task's `## Comments`: the files touched, what you verified in the code, what is left open. The commit says what changed; the Comments say why, and `bill` reads them to close the ticket.

What the pantry should learn from this task (a trap, a decision, a pattern) goes in the same Comments under `### For the pantry`, one line each. Write only notes you would recommend saving: `bill` proposes them at closing. A task that taught nothing says so under the heading: `Nothing.`

Write the Comments in the language the pantry is written in.

Done when the task's commits are in, the review's issues are fixed and committed, its `Status` is `done` and its Comments are written.
