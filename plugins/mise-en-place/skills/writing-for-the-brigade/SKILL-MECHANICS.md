# Skill mechanics

The skill-specific branch of [`writing-for-the-brigade`](SKILL.md): what changes when the document is a skill (frontmatter, the invocation choice, and router skills). Everything else about writing it is in `SKILL.md`.

## Frontmatter

- `name`: the folder's name, lowercase, words joined by dashes.
- `description`: what the skill does, never instructions to the caller on when or how to use it. Its weight depends on the invocation, below.
- `disable-model-invocation: true` for a skill only the user starts.

## Invocation

Ask the user which of the two the skill is. They trade the two loads:

- A **model-invoked** skill keeps its `description` in the agent's context, so the agent can fire it on its own, and other skills can reach it; the user can still type its name. The description is the skill's top-level context pointer, loaded at all times: permanent context load in exchange for discoverability. Write it to trigger: what the skill does, with the words a user or a task would use for each branch that should fire it (the pointer rules in `SKILL.md` apply in full). The agent consults a skill only for work it cannot easily do alone: a one-step request does not fire a skill, whatever its description, so the description names the substantial work the skill does.
- A **user-invoked** skill sets `disable-model-invocation: true`: only the human typing its name can invoke it, and no other skill can. Zero context load, but the user is the index that must remember it exists. Its description is one plain line for that user, with no triggers.

Pick model-invocation only when the agent must reach the skill on its own, or another skill must. A model-invoked skill whose content is all reference is one home for shared reference: each skill that needs it calls it. Reference two user-invoked skills both need lives in a plain file both point to, since neither can fire the other.

A skill that tells a sub-agent to load it names itself with its plugin's prefix, so the sub-agent loads this one and not a namesake from another plugin.

## Splitting by invocation

Split off a model-invoked skill when you have a distinct leading word that should trigger it on its own (a trigger word you actually use in your prompts), or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it.

## Router skills

When user-invoked skills multiply past what you can remember, one user-invoked **router skill** names the others and when to reach for each, so the human has one skill to remember instead of many. It can only hint, never fire them: user-invoked skills have no description, so nothing but the human can reach them.
