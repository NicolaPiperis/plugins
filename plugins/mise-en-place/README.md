# mise-en-place

Inspired by [Matt Pocock's skills](https://github.com/mattpocock/skills).

*Mise en place* is "everything in its place": the discipline a kitchen keeps for the whole shift, not only before it. Here it means a fixed place for every piece of knowledge, a fixed path for every ticket, and a human check at every step.

**The pantry** is the knowledge base the skills read from and write to: what was learned about the code, what the products do, and the record of every ticket. Like a kitchen's storeroom, you take only what you need, and everything in it is labelled and dated.

The skills marked `/` run only when you type them. The others you can type too, and Claude also calls them on its own, or when another skill needs them.

## Install

```
/plugin marketplace add NicolaPiperis/plugins
/plugin install mise-en-place@nicolapiperis-plugins
```

Then run `/setup-pantry` once, to create your pantry or connect to an existing one.

## The ticket, from order to bill

```
take-order (triage, plating) → grill-from-pantry → recipe → prep-list → fire (taste, passe) → chefs-table → bill
```

`take-order` is optional: the functional design, before the developer's interview.

| Skill | What it does | Why the name |
|---|---|---|
| `/take-order` | Designs a request's behaviour with you, one topic and one question at a time, with mockups of its screens, and writes it into the ticket's order. A request too big for one session becomes a ticket map. | The waiter takes the order: what the guest wants, before the kitchen starts. |
| `triage` | Checks a request that has just arrived, before anyone takes it on: already in the product, already in an open ticket, or, for a defect, meant by the code. | Triage sorts what comes in before anyone works on it. |
| `plating` | Builds a mockup of a screen that looks like the finished product, from the project's own code, in the formats it needs. | Plating decides how the dish looks on the plate before it goes out. |
| `/grill-from-pantry` | A relentless interview that sharpens a ticket or a design, grounded in the pantry and the code. Opens the ticket, fixes the terms, settles the threats and the test seams. | The ingredients taken from the pantry go on the grill. |
| `/recipe` | Turns the interview into the ticket's spec, with its threat model and its estimate. | The recipe says what the dish is and how it is made. |
| `costing` | Sizes a recipe in hours: development, documentation, test. | Food costing prices a dish before it goes on the menu. |
| `haccp` | Threat-models a design on the trust boundaries it touches, with STRIDE. | HACCP is the food-safety system that finds the hazards at each critical point. |
| `prep-list` | Breaks the recipe into tasks, thin vertical slices with their blocking edges. | The prep list is the sheet of preparations to do, in order, before service. |
| `fire` | Builds one task: code, tests, commit, review. | "Fire!" is the call that starts cooking a dish. |
| `taste` | Test-driven development: a failing test first, then the code that makes it pass. | A cook tastes while cooking, against the flavour the dish must reach. |
| `passe` | Reviews the code along three axes: the project's rules, the spec, security. | The pass is where the chef checks every plate before it leaves the kitchen. |
| `/chefs-table` | Guided validation of the finished ticket, case by case, with you at the screen. | At the chef's table the guest tastes the dish in front of the chef. |
| `/bill` | Closes the ticket: brings the pantry up to date, writes the bill, moves the ticket to served. | The bill sums up what was served. |

## The pantry

| Skill | What it does | Why the name |
|---|---|---|
| `/setup-pantry` | Creates a new pantry, connects to an existing one, or switches between the pantries you know; after a plugin update, brings the pantry up to date. | — |
| `inventory` | Reads what the pantry already knows about the point you work on. | Taking stock of what is on the shelves. |
| `restock` | Writes to the pantry: traps, decisions, patterns, coding rules, names. | Restocking the shelves, everything labelled and dated. |
| `menu` | Sharpens the domain's language and fixes its terms in the product's glossary. | The menu names every dish once, the same way for the kitchen and the guests. |
| `locate-stations` | Finds each project's code on this machine, and how to read it. | Every cook has a station on the line; here every project has a place on disk. |

## Around the work

| Skill | What it does | Why the name |
|---|---|---|
| `/grill` | The same relentless interview, without the pantry. | — |
| `grilling` | The interview itself, used by the other skills. | — |
| `partie` | The vocabulary for designing deep modules: interface, seam, depth. | The chef de partie runs one station and knows its tools. |
| `/deep-clean` | Finds where the architecture can be made deeper, and designs the change with you. | The deep clean takes the kitchen apart down to the walls, beyond the daily wipe. |
| `/handover` | Compacts the session into a document for the next one. | The handover passes the work from one shift to the next. |
| `sourcing` | Investigates a wide question across the code, the pantry and the web, each fact traced to its source, and writes it to a file. | Sourcing finds where each ingredient comes from. |
| `by-the-book` | Finds what the norm asks on a point of the product's behaviour (law, agreement, standard, practice) and sets it against what the software does. | Doing it by the book: following the rules as written. |
| `writing-for-the-brigade` | Writes or changes a skill of the plugin, so the agent takes the same process every run at the lowest cost. | The house rules for writing the brigade's own skills. |

## Licence

[MIT](../../LICENSE). Third-party material, with its own licence, is listed in [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
