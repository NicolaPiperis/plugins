---
name: triage
description: Triage a request that has just arrived, before anyone decides to take it on as a ticket or a fix - whether the product or an open ticket already covers it, and for a defect whether the code means to behave that way - on code and pantry brought up to date.
---

Speak to the user in their language, in the words of whoever uses the product: a place is a screen, a menu or a field. The sources may name the code - files, branches, tickets - where the user needs them to check a finding.

This skill reads and reports. The user decides on every finding: a request wrongly called covered is lost without anyone noticing.

Every finding names its **sources**: where you looked, what you found there, and whether it looks like the same thing. A check that finds nothing reports exactly what its sources show. The tickets among them are only those already in the pantry; the code is named by the branch it was read on.

## The ground

The user names the product. Find the active pantry through `locate-stations`: the projects that build the product are listed under its `projects`, in the pantry's `config/vocabulary/products.yaml`. Resolve their paths the same way.

Bring the pantry and each project up to date before reading it. With no local changes, pull its branch. With local changes, the user's copy stays as it is: say what you found, and propose `git fetch` and reading each file with `git show origin/<branch>:<file>`. Read the user's folders where they stand: never create folders or worktrees in them.

A path or a remote that does not answer stops the run: say which one.

Then read the pantry on the point the request sits on, through `inventory`.

**Done when** the pantry and every project are up to date, or left as they stand with the user told why, and the pantry has been read on the point.

## The checks

Each check answers its own question. How the product behaves around the request is explored later, one branch at a time, by the design.

**Already in the product.** Search for an existing implementation of the requested behavior by domain concept, not just the request's wording, under every name it goes by: the label on screen, the term in the product's glossary, the name in the docs and in the code. Look in the pantry's docs first, then in the code. A `decision` in the pantry that already ruled on this need is a finding too.

**Already asked in a ticket.** Look among the open tickets of the product: every folder under the pantry's `core/tickets/pending/{product}/`. A served ticket is already in the code, where the previous check finds it. Read the titles first, the first line of each `order.md`; open the `order.md` or the `recipe.md` only where the title touches the same concept. The tickets still to design sit in the open ticket maps, `core/tickets/maps/{product}/`: read the Tickets of each `map.md` whose status is Open.

**A defect.** When the request reports a defect, find the code that produces the behaviour and judge from it alone whether that is what the code means to do or a departure from it. Where the judgement turns on something the user did not give - a tenant, a configuration, a profile, the data - that is the open question.

**Done when** every check has reported with its sources.

## The outcome

Report the findings of every check, then the outcome that holds:

- **Already covered**: name the feature, or the ticket with its code and folder, and ask whether it is the same thing.
- **Not a defect**: say what the product does there and why the code means it, and ask whether the request becomes a change.
- **Open question**: for each missing piece, a precise question the user can answer or take to the customer.
- **To be designed**: called by `take-order`, hand the findings back and the session goes on. Run on its own, tell the user to type `/take-order`.
