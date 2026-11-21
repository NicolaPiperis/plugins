---
name: prep-list
description: Break a ticket's recipe into a prep list of tracer-bullet tasks, each declaring its blocking edges, written into the ticket's folder in the pantry. Use when a ticket has a recipe and no prep list yet, and when the validation sends back work.
---

# Prep list

Break the ticket's recipe into a set of **tasks**: tracer-bullet vertical slices, each declaring the tasks that **block** it. Together they are the prep list.

## Process

### 1. Gather context

The input is the ticket's `recipe.md`, in the pantry's `core/tickets/pending/{product}/{code}/`. Without it there is nothing to slice: tell the user to run `/recipe`. Work also from whatever is already in the conversation context.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code: `inventory` and `locate-stations` take you there. Task titles and descriptions should use the product's glossary vocabulary, and respect the decision entries in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tasks.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each task its **blocking edges**: the other tasks that must complete before it can start. A task with no blockers can start immediately.

**A refactoring the recipe calls for is a task of its own**, the first one, blocking every other. Folded into the task that needs it, it vanishes from the plan and from its acceptance criteria.

**The threat model becomes tasks**, following the decision `haccp` took for each threat:

- mitigated in this ticket: an acceptance criterion of the task that builds that part, proved by a security test;
- a weakness already in the code: a preparatory task, right after the refactoring where there is one, blocking the tasks that build on that code;
- out of scope: it stays in the recipe.

**Two named tasks close every prep list**, after the numbered ones:

- `chefs-table` (the user validating the finished work), blocked by every numbered task;
- `bill` (closing the ticket: the pantry brought up to date and the bill written), blocked by `chefs-table`.

Their body names the skill that does the work.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own task blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a task blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify task; green is promised only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list, then the two named tasks. For each task, show:

- **Title**: short descriptive name
- **Blocked by**: which other tasks (if any) must complete first
- **What it delivers**: the end-to-end behaviour this task makes work

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each task only depend on tasks that genuinely gate it?
- Should any tasks be merged or split further?

Iterate until the user approves the breakdown.

### 5. Write the prep list

One file per task, never a single combined file, in the ticket's folder:

```
prep-list/
  01-slug.md    the numbered tasks, from 01 in dependency order, blockers first
  chefs-table.md
  bill.md
```

Use the template `config/templates/tickets/task.md`, in the language the pantry is written in, with `Status: ready` and the guide comments stripped.

Avoid specific file paths or code snippets: they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

Done when every task the user approved has its file.

## Fixes from the validation

When `chefs-table` sends work back (a case that failed, or something no task covered), each behaviour to put right becomes a new task, the trivial ones together. It takes the next free number after the highest in `prep-list/`; a number once given stays with its task. The named tasks are already blocked by every numbered task, so the new ones sit ahead of them as they are.

Run steps 3 to 5 for the new tasks alone. Where the fix shows the recipe missed something, bring `recipe.md` up to date as well.
