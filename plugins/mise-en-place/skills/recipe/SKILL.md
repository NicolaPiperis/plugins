---
name: recipe
description: "Turn the current conversation into the ticket's recipe in the pantry: no interview, just synthesis of what you've already discussed."
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces the ticket's recipe. Do NOT interview the user; just synthesize what you already know.

The recipe goes in the ticket's folder, the one `grill-from-pantry` opened: `core/tickets/pending/{product}/{code}/recipe.md` in the pantry. With no ticket folder, tell the user and stop.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already: `inventory` reads the pantry, `locate-stations` takes you into the code. Use the product's glossary vocabulary throughout the spec, and respect any decision entries in the area you're touching.

2. Carry the seams the grill settled, and what it decided where no sound seam existed. For any seam it left open, sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Carry the threat model: the block `haccp` produced during the grill, or its line "no trust boundary touched". Where it did not run, call the Skill tool with "mise-en-place:haccp".

4. Size it: call the Skill tool with "mise-en-place:costing".

5. Write the recipe from the template `config/templates/tickets/recipe.md`, in the language the pantry is written in: haccp's block under `## Threat Model`, costing's under `## Estimate`, the guide comments stripped.

Done when `recipe.md` is written with every required section of the template filled.

## Rules

**A recipe is a closed document.** A question it cannot answer is unfinished work, not a line to write in it: say what is missing, and settle it with the user before writing.

**Cite the pantry only where it changes something.** A gotcha that confirms what was already decided stays out: it sends the reader back over a choice already paid for. Where a fact overturns a decision, say so plainly: "this invalidates X".
