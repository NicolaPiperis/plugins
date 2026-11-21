# Testing a document

A test shows whether the agent takes the process the document describes, and what it costs. It runs only with the user's yes.

## The requests

Write two or three requests the way a real user would type them: concrete, with the details a user gives, in the user's language. Each one is substantial enough to need the document: a one-step request never fires a skill. Show them to the user and run them once approved.

For a model-invoked skill, the full test adds two or three **near misses**: requests that share words with the skill but need something else. They must not fire it.

## The runs

- **Light**: each request in a sub-agent that loads the document.
- **Full**: each request twice, in the same turn - with the document, and without it or with its previous version - so both finish together.

A test acts: a run writes files and calls tools as a real run would. Point its writes to a scratch folder, and its work to copies, never to the user's projects or documents. Make each copy a git repository of its own: a session started inside the user's repository loads the user's memory, and the test then measures that memory instead of the document. Record the time and the cost of each run.

## Reading the results

Before reading the outputs, write the criteria they must meet: checkable, and able to tell the document's runs from the others. A criterion that passes with the document and without it proves nothing: replace it.

Read the transcripts, not only the outputs: the skipped steps, the wasted work and the misread rules show there. A helper every run writes for itself becomes a script of the skill.

Report to the user, in their language: each criterion with its result, the time and the cost, and what the transcripts showed. A failure is fixed for the class of cases it belongs to, then the review in `SKILL.md` runs again on what the fix touches.

When the test ends, delete the copies, what the runs wrote and the sessions' transcripts: nothing of the test stays behind.

**Done when** the user is satisfied, or a new round no longer improves the results, and the test has left nothing behind.
