---
name: take-order
description: Design a request's functional behaviour with the user, one branch and one question at a time, grounded in the pantry and the code, with mockups of its screens, and write it into the ticket's order in the pantry; a request too big for one session is split into a ticket map, designed one ticket per session.
disable-model-invocation: true
---

Call the Skill tool for "mise-en-place:menu".

Speak to the user in their language. The files this skill writes are in the language the pantry is written in.

Called with the path of a ticket map, or with no request, read [TICKET-MAP.md](TICKET-MAP.md): the work resumes there.

## Before the first branch

The design stands on the triage: code and pantry brought up to date, and neither the product nor an open ticket already covering the request. Call the Skill tool with "mise-en-place:triage" for whatever the conversation does not hold yet. When the triage finds the request covered, not a defect, or short of information, the user decides how to go on.

Then get the user describing the need, with open questions in their own words and nothing to pick from: what does not work today, what the customer must be able to do. Options offered before the need is clear steer the answer. Ask there too, once, whether another ticket touches the same data. A request that arrives vague - the user cannot yet say what does not work, or where in the product - goes to "mise-en-place:sourcing" on the area it names while the user describes the need, without waiting for it: the approaches and the branches start from its findings.

Once the need is clear and the product offers more than one functional way to meet it - a setting on what exists, a new screen, a rule on a document - lay out the two or three that hold, each with what it trades off, recommend one, and let the user pick.

**A request too big for one session.** Count the functionalities the chosen way touches that can be designed on their own: a search, a detail, a tab, a flow. With more than two, or when the user asks, propose to split the request into tickets, one per functionality - never one per layer of the software. The first ticket is the one the others stand on, and it settles what they all inherit, such as the perimeter and the permissions; two small tabs that depend on each other can share a ticket. Give the list, each ticket with the tickets it depends on. The user decides; a split request goes on as [TICKET-MAP.md](TICKET-MAP.md) says.

**The ticket.** A request designed whole opens its ticket now, before the design reshapes it:

1. Ask for the ticket's code once. With none, propose a short name drawn from the request (`partial-cancellation`) for the user to confirm or change.
2. The product is the one the triage worked on.
3. Draft `core/tickets/pending/{product}/{code}/order.md` from the template `config/templates/tickets/order.md`, with the request in the user's words. Show it whole and write it on the user's go.

The research files and the mockups of the session go in the ticket's folder; a research file written before the folder existed moves into it.

**Done when** the user has named the need in their own words, picked the way to meet it, said whether to split a request with more than two functionalities, and the ticket's folder, or the ticket map's, is open.

## The perimeter

This design settles **behaviour**: what the product does, for whom, in which cases, under which rules, and who may see and change what across roles and, where the product has them, tenants.

How it is built belongs to the developer. A question about tables, classes, endpoints or how data is stored leaves the design as a point for the developer, with the functional reason it matters. When the user proposes a technical solution, settle the need behind it as the decision, and pass the solution on as a point for the developer.

## The branches

See the design as a tree: every decision branches into the decisions that hang off it. A branch is a part of the behaviour that can be settled on its own. Take the branches in order of dependency: first the ones the others stand on.

**Before opening a branch, explore it.** Read the pantry with `inventory` for a module not read yet, then read the code of that part of the product in depth, through `locate-stations`: which screens and flows reach it, which cases it handles, which rules it applies. Where the branch touches a regulated area - fiscal documents, prices and taxes, personal data, working time and shifts, stock - call the Skill tool with "mise-en-place:by-the-book".

**Follow the data, not the screen.** For every piece of data the branch sets a rule on, find:

- its **writers**: the screen, with every operation on it - insert as much as change and delete; the automatic processes that write it; copies and imports; and the data already there, written before the rule existed, once a user saves it again;
- its **readers**: the flows, documents and prints that use it, the cases the request makes them run in that they do not run in today included;
- the **tickets on the same data** that the user or the request names: read their order and recipe in the pantry's tickets, and keep their rules and facts.

A writer or reader the rule plainly covers goes into the branch's context as a fact. A writer or reader where the rule's reach is a choice, and every difference from a ticket on the same data, joins the map as a point.

**Research.** An exploration too wide for this conversation - the porting of a legacy feature, or data written and read in more than one module - goes to "mise-en-place:sourcing", with the questions of "Follow the data" as its request; the branch waits for it and opens on its file. A research file, by-the-book's included, goes in the ticket's folder.

**The branch opens** with its context, then its map:

- the context: how the product behaves there today, as the exploration found it, and the norm wherever the software departs from it. Lead with the facts that bear on the decisions; offer the rest by name;
- the map: the titles of the points the branch has to settle, in order.

**Then one question at a time**, each built on the last answer or on a fact the exploration found, so it shows the user a case or a consequence they may have missed. A question carries its variants, each with what it trades off, and your recommended answer; a variant that departs from the norm says so:

```
❓ **<point title>**: <question, with the variants>

➡️ <your recommended answer>
```

Take each answer and go on, without restating it. A point an answer brings up joins the map, after the ones already there.

**A screen.** When a branch creates a screen or changes how one is laid out, propose a mockup with your advice. A screen new to this product counts even when it copies one of another product: the copy settles the fields, not how this product shows them. A defect, a field added or a text changed is settled in words. The user may ask for a mockup or decline it. For a mockup, call the Skill tool with "mise-en-place:plating", passing the question, what the exploration read of the screen - its fields, labels, the screen it starts from, the files - and the ticket's folder as the folder for the mockup. The branch's screen points close on the mockup the user approves. A later decision that changes what an approved mockup shows goes into it as a new version, for the user to approve again.

**A norm the user asks for** in the middle of a branch: call the Skill tool with "mise-en-place:by-the-book" and bring its answer into the branch.

**Closing a branch.** The branch closes when every point on its map is settled and the user closes it. Give its decisions once, under a summary heading, saying they are already taken: one line each. Keep, for the order, each decision's reason and the variants set aside. Then open the next branch.

**A correction.** When the user corrects a fact or gives a rule that reaches beyond the branch, read it again in the code and update every branch it touches. Then give the open branch again whole: its context rewritten, the decisions the correction leaves standing, and the next question; the decisions it touches become questions again. The correction takes the place of what it replaces, inside the branch's own text. The other branches take it when they open.

**A reopened branch.** When a later branch reopens a closed one, say so and bring back only the decisions the new question touches.

## Facts

Finding facts is your job; the decisions are the user's. The customer wants or complains of only what the user said; a case the exploration found is yours to show. A decision closes on facts established in this session: read in the code, in the pantry, by a sub-agent, in a research file. Where a fact is out of reach of everyone here - it needs the customer, a running system, data that does not exist yet - name who can reach it and mark every decision that stands on it.

For every fact read from the code that a decision stands on, keep the file it comes from, the branch and the date it was read on, and the decisions it supports. The code's names - files, classes, methods, tables, lines - stay out of the conversation: they go with the fact into the order. The developer verifies these facts again; a wrong one reopens exactly the decisions tied to it.

**What the product already does is a fact to check, not a decision.** When the user adopts an existing behaviour, of this product or another, read it in the code against every case the branch names: each kind, nature and operation. A case the behaviour leaves out joins the map.

Facts the conversation already holds are a starting point: read again in the code the ones a decision will stand on and that carry no file.

## Candidates for the pantry

The terms `menu` resolves go into the product's glossary, as `menu` says. The decisions, gotchas and names it would offer to `restock`, and the notes for the design system the user chose to propose from the mockups, go into the order as candidates for the pantry: the developer offers them in `grill-from-pantry`, once the facts they stand on are verified.

## The end

The session is done when every branch is closed: every point on every map settled, every mockup approved, every fact a decision stands on established or marked. The points left for the developer do not keep it open.

When the user confirms the shared understanding, read [ORDER.md](ORDER.md) and write the order. A ticket of a ticket map then closes as [TICKET-MAP.md](TICKET-MAP.md) says. The order goes on with the developer, who types `/grill-from-pantry` on the ticket.
