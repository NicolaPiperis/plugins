---
name: writing-for-the-brigade
description: Write or change the content of a plugin or a skill - skills, agents, hooks, scripts, the CLAUDE.md or AGENTS.md of the repository that holds them - so the agent takes the same process every run at the lowest cost; then review it with the user, version it and offer a test.
---

Reference for writing the content of a plugin or a skill: a skill and the files it points to, an agent, a hook, a script, the `CLAUDE.md` / `AGENTS.md` of the repository that holds them. The packaging differs; the writing does not: the same levers make each one predictable, since the agent takes the same _process_ every run rather than producing the same output.

A document written for people as well - an analysis, a request, a knowledge-base entry, a project's documentation - keeps the language and the form the skill producing it gives it.

The document is written in plain English, its frontmatter included: short sentences, everyday words, the same word for the same thing throughout. Talk to the user in their language, and review the document with them in it.

When the document is a skill, read [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md) for frontmatter, invocation choice, and router skills.

## Before writing

Settle with the user, one question at a time, what the conversation does not already answer:

- **what it does**, and the condition that tells it is done;
- **who invokes it**, for a skill: the agent on its own, another skill, or only the user typing its name. `SKILL-MECHANICS.md` says what each choice costs;
- **what it produces**, and in which format. The format of every document a skill produces is written in the skill, or in a file of its folder, so whoever has the skill has the format;
- **the cases at the edges**: what the input can lack, what can go wrong, what it must leave untouched;
- **its neighbours**: the documents it points to and the ones that point to it. Read them: a hand-off two documents describe differently breaks in the run.

Changing an existing document, read it whole first, and its neighbours. Keep its name.

## Context pointers

A **context pointer** is a reference held in the agent's context that names some out-of-context material and encodes the condition for reaching it. A skill's description is one; a line in `AGENTS.md` naming a doc is the same object. The pointer's _wording_, not its target, decides when the agent reaches the material, and how reliably. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first, and inline the material only if sharpening fails.

A pointer does two jobs: state what the material is, and list the **branches** that should trigger reaching it (a branch is a distinct case the document handles, so different runs take different paths through it). Every word of an always-loaded pointer costs on every turn, so it earns even harder pruning than the body:

- **Front-load the leading word**: the pointer is where it does its triggering work.
- **One trigger per branch.** Synonyms that rename a single branch are one branch written twice; collapse them and keep only genuinely distinct branches.
- **Cut identity the body already carries.**

## The two loads

Every document and pointer you add spends one of two budgets:

- **Context load** is the cost of always-loaded material on the agent's window: an `AGENTS.md` line, a skill description, anything sitting in context every turn, spending tokens and attention whether or not it fires.
- **Cognitive load** is the cost on the human: which documents exist and when to reach for each. The human is the index. Not a cost to minimise: it is the price of human agency; spend it where human judgement matters, remove it where it does not.

Material reached only through a pointer escapes context load at the price of the pointer's own line; material with no pointer at all rides entirely on cognitive load.

## Information hierarchy

A document is built from two content types: **steps** (the ordered actions the agent performs) and **reference** (definitions, rules, facts consulted on demand). The core decision is where each piece sits on the **information hierarchy**, a ladder ranked by how immediately the agent needs the material:

1. **In-file step** is the primary tier: what the agent does, in order.
2. **In-file reference** is consulted on demand. Often a legitimately flat peer-set (every rule of a review on one rung), which is a fine arrangement, not a smell.
3. **Disclosed reference** is pushed out into a separate file, reached by a context pointer, loaded only when the pointer fires.

Push too little down and the top bloats; push too much and you hide material the agent actually needs. That tension is the whole decision.

**Progressive disclosure** is the move down the ladder, so the top stays legible. Branching is the cleanest test: inline what every branch needs, and push behind a pointer what only some branches reach. When a document has steps, in-file reference that should be disclosed buries them and turns attending to them into a coin-flip.

**Co-location** decides what sits beside a piece once placed: keep a concept's definition, rules, and caveats under one heading, so reading one part brings its neighbours with it. The document should read like documentation written for the agent.

**Sprawl** is the failure mode: a document simply too long, even when every line is live and unique. Attention thins across the excess. A `SKILL.md` stays under 500 lines; a disclosed file over 300 lines opens with a table of contents.

A skill's folder holds the disclosed material by kind:

- `scripts/`: work that is the same every run, executed without being read into context;
- `references/`: documents read when a pointer sends the agent there. When the skill covers several variants - products, stacks, providers - one file per variant, so the agent reads only the one in hand;
- `assets/`: files the output is built from, such as templates and icons.

## Steps and completion criteria

Every step ends on a **completion criterion**, the condition that tells the agent the work is done. Two properties make it a lever:

- **Clarity**: can the agent tell done from not-done? A vague bound ("understanding reached") invites **premature completion**: ending the step before it is genuinely done, attention slipping to _being done_. The visible steps still ahead (the **post-completion steps**) supply the pull; the criterion's clarity is the resistance. **Sharpen the bound first**; only if it is irreducibly fuzzy _and_ you observe the rush, hide the later steps by splitting the sequence. Hiding only works across a real context boundary (a hand-off or a subagent dispatch).
- **Demand**: how much it requires. "Every modified model accounted for" forces thorough work where "produce a change list" does not. Demand drives **legwork** (the digging the agent does within the work, latent in the wording), and it binds a body of flat reference as well as a sequence.

The strongest criteria are both checkable and exhaustive.

## When to split

Splitting one document into two spends one of the two loads, so split only when the cut earns it:

- **By sequence**: split a run of steps where the post-completion steps tempt the agent to rush the one in front of it. Beware the reverse: merging sequences exposes each step's later steps, inviting premature completion.
- **By invocation**, skill-specific: see [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md).

## Leading words

A **leading word** is a compact concept already living in the model's pretraining that the agent thinks with while running the document (_lesson_, _fog of war_, _tracer bullets_). Repeated as a token, never as a sentence, it anchors a whole region of behaviour in the fewest tokens. A made-up word recruits no priors: you pay in definition tokens what a pretrained word gives free; reach for an existing word first.

It anchors twice: in the body, the agent reaches for the same behaviour every time the word appears; in a pointer, the same word in your prompts, docs and code links the shared language to the material.

Hunt for passages that spell out one idea in a sentence or a triad, and collapse them into one word: "fast, deterministic, low-overhead" → _tight_; "a loop you believe in" → _red_. Fewer tokens, and a sharper hook.

**Negation** is the failure mode beside this lever: a prohibition drags the forbidden behaviour into context and makes it _more_ available. Prompt the **positive**: state the target behaviour ("write one-line comments") so the banned one is never spoken. A prohibition earns its place only as a hard guardrail you cannot phrase positively; even then, pair it with the positive target.

## Rules with their reasons

Each directive carries its reason, in a clause: "Read the pantry through inventory: it knows which entries are stale." The reason lets the agent handle the case the rule did not foresee. A rule in capitals - ALWAYS, NEVER - with no reason is a sign the reason is missing.

A document states the rule as it holds now. What changed from a previous version, who asked for a rule, the ticket or conversation it came from belong to the commit and the patch notes. An example taken from a real case binds the agent to that case: describe the class of cases instead, and fix a failure for its class, never for its example.

## Cost

Every run pays for what the document makes the agent do. Choose the cheapest way that gives the same result:

- **a script** for work that is the same every run: it costs no context and answers the same every time;
- **a sub-agent** when the pages it reads would fill the conversation, or when jobs run in parallel. It starts cold and pays its own tokens: hand it the whole request and the skills it must load;
- **nothing read twice**: what the conversation already holds is used as it stands;
- **one question at a time to the user**, and only what the code, the files and the conversation cannot answer.

## Pruning

- Keep each meaning in a **single source of truth**: one authoritative place, so changing the behaviour is a one-place edit. **Duplication** costs maintenance and tokens, and inflates a meaning's prominence on the ladder.
- The **environment** is a source of truth too (scripts, config files, the directory layout, `--help` output), and a document that restates it is a **cache**: it earns its load only when the lookup is expensive. Cache what the agent cannot find by looking: the unwritten convention, the reason behind a choice, the gotcha no config confesses.
- Check every line for **relevance**: does it still bear on what the document does? Without a pruning discipline the default fate is **sediment**: stale layers that settle because adding feels safe and removing feels risky.
- Hunt **no-ops** sentence by sentence: an instruction the model already obeys by default pays load to say nothing. When a sentence fails, delete the whole sentence. A leading word too weak to beat the default (_be thorough_) is a no-op too; the fix is a stronger word (_relentless_).

## Review with the user

The document's files change only after the user approves: until then the text is a draft. A change the user dictated word for word is approved by the request itself; what you add to it or reword is not. Read the draft again, top to bottom, with fresh eyes:

- every piece sits where the run needs it, in the order of the run;
- no rule repeats or contradicts another, here or in its neighbours;
- every name it cites - a skill, a file, a section - exists.

Then present it to the user, translated into their language, and ask for approval:

- **a new document**: all of it, section by section;
- **a change**: each point changed, before and after.

The user's corrections go in, and the review runs again on what they touch. **Done when** the user approves and the files hold the approved text.

## Version

A skill has no version of its own: the plugin that ships it does. At a release, show the user the current version of each plugin touched and ask which version it becomes: the number is the user's choice. The commit and the patch notes follow the rules of the repository the plugin lives in.

## A test

When the document is new or its behaviour changes, ask the user whether to test it, with the price of each kind:

- **light**, about 1 to 3 dollars: two or three realistic requests, run with the document;
- **full**, about 10 to 20 dollars: the same requests with the document and without it - or with its previous version - side by side.

With a yes, read [`TESTING.md`](TESTING.md).
