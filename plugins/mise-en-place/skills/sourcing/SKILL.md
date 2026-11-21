---
name: sourcing
description: Investigate a wide question across the code, the pantry and the web - each fact traced to its source, dated, marked with how it was established and where it was searched - written to a file, with its answer handed back in a few lines.
---

An **investigation** answers one wide question - how an area of the product works, who writes and reads a piece of data, what a norm asks - that would fill a conversation with the pages read to answer it. The pages it reads stay out of the conversation; its findings go to a file, so they outlive the conversation and can be checked one by one, and the work goes on with the answer in a few lines.

## The request

The caller gives:

- **the question**, and what the answer is for;
- **the sources**: the projects whose code to read, the pantry, the web;
- **where to write the file**. With no place given: the folder of the ticket, or of the ticket map, the work belongs to; with neither, `~/Documents/research/<year>/<yyyy-mm-dd>-<topic>.md`;
- **anything its own field adds**, such as where each kind of norm lives and its levels.

## Running it

Called as the research sub-agent, go straight to the investigation, and hand back the file's text whole: a sub-agent may not write report files, so the caller writes it.

Otherwise the investigation runs in a sub-agent, so the pages it reads stay out of the caller's conversation. Load this skill once, then dispatch the sub-agent with a prompt that opens with *"You are the research sub-agent: call the Skill tool with "mise-en-place:sourcing" and carry out the investigation below"*, followed by the request whole. The rules below then reach the sub-agent through this skill, not through the prompt.

The caller decides whether to wait for it: it waits when its next step needs the answer, and goes on with its own work otherwise.

## The investigation

Every fact rests on a source read in this run. What you remember is a lead for the search, never a source.

**The code** is read as it stands: bringing it up to date is the caller's work. Record the branch and the commit. Go into the code through `locate-stations`:

- a fact found with a code-analysis tool, which resolves symbols, is established by the tool;
- a fact found by text search, which finds names - comments, strings, unrelated members with the same name - is marked to be checked again.

A question about who writes or reads a piece of data covers every operation - insert, change, delete -, the automatic processes, the copies and imports, and the data already there.

**The pantry** is read through `inventory`: it knows which entries bind which level and which are stale. Cite the entry a fact comes from.

**The web** answers through primary sources: the official text, the documentation of whoever owns the thing, in the version in force today. A secondary write-up is a way to find the primary source; cite the primary one. A source out of reach - behind a paywall, offline - is named, and the facts resting on it stay to be checked.

**Done when** every fact carries its source, how it was established and, when it differs from the file's date, the date it was read; every place searched is named, the empty ones included; and every part of the question you could not answer names who can - the customer, a running system, data that does not exist yet.

## The file

Written in the language the pantry is written in:

```
# <the question>

Date: <yyyy-mm-dd> · Asked by: <the skill that called, and the user> · Sources: <projects with branch and commit; pantry; web>

## Answer
<three to six lines: what the investigation found>

## Facts
### <one part of the question>
1. <the fact, in one or two sentences>
   Source: <file and line, with branch and commit> | <link> | <pantry entry> · Established by: code-analysis tool | text search, to check again | primary source | pantry · Read on: <yyyy-mm-dd>, only when not the file's date · Level: obligation | standard | practice, for a norm only

## Where it was searched
- <every place searched, and what it gave, "nothing" included>

## Open
- <what could not be established, and who can establish it>
```

## Back with the caller

Write the text the sub-agent handed back to the file, as it came. Its **Answer** is what the work goes on with; the decisions take from the file only the facts they stand on, each with its source, and the rest is read again only to check a fact.
