---
name: chefs-table
description: "Validate a ticket you have just implemented, by hand and with you at the screen: design the test cases, walk through them one at a time, judge each outcome. Run once every numbered task of the prep list is done."
disable-model-invocation: true
---

# Chef's table

You have implemented a ticket. This skill makes you prove it works, with the user at the screen.

You read the code, design the cases and judge the outcomes; the user clicks through the real software. Everything goes through the application: the data a case needs, and the evidence of how it ended.

## Gather the inputs

- The ticket in the pantry: `recipe.md`, the tasks in `prep-list/`, `order.md`.
- The ticket's diff: its commits in every project's repository it touched (`git log --grep "{code} - T"`), plus any uncommitted work.
- The session so far.

Go into the code through `locate-stations`. A missing recipe or prep list is not a blocker: proceed and say what you are working without.

## Design the cases

Build each case by climbing the path upstream of the change in the code: which screen reaches it, which action triggers it, which guards and mandatory fields stand in between. Every level you climb adds a precondition. Read it from the code: a screen name alone is a guess.

The count is whatever the change needs. These cases are always there when they apply:

- **Non-regression**: the same operation without the new part, behaving as it did before.
- **Error**: invalid data, a missing permission, an absent related record.
- **Other features reached**: where the change reaches another feature (a modified method it also calls, a parameter or flag it also reads), one or two cases per feature, three at most for the most critical. Find them through the callers and usages. With more than three features reached, cover the three most critical and list the others as not covered.

Keep only the cases whose path can be reached under their conditions: the login's permissions, the configuration the software runs with.

Order the cases so that one can start where the previous one ended: same login, nothing the previous one changed gets in its way. Its steps then go on from there instead of from the home screen. After a failed case, the next one starts from the home screen.

Show the **titles first**, so the coverage is visible before anyone spends half an hour on case one. Then work one case at a time.

## The data: built inside the case

Every record a case needs is created from scratch by the case itself, through the application: its first steps build it, the way a user would. A record built by the application is consistent by construction. Give each one a name that makes it recognisable and keeps it clear of existing data, such as the case number in a description field. A chained case may use what an earlier one built.

The login: say which role and permissions the case needs, read from the code, and let the user pick the account. The password stays with the user, out of every case.

## Each case

```
CASE N - title
Goal            what is verified
Preconditions   state of the system: permissions, active modules, configuration
Data            the records the case builds, and in which steps
Access          the role and permissions the login needs
Steps           the click path from the home screen
Before the fix  how it behaved (absent for a new feature)
Expected        what must happen
Checks          how the outcome will be read back through the application
```

Steps are a **click path from the home screen**, or from where the previous case ended when it is chained. Each step names the label the user sees, says click or double click, and lists the mandatory fields to fill. Read the labels from the frontend code, through the translation files where the code holds a key.

Show the **checks before the test runs**, so what will be judged is known in advance.

## Hand the case over

The user runs the case by hand. Give the instructions and wait.

## Verify

After **each** case, not at the end of the run: by then the later cases have already moved the data.

**A success message is not evidence**: a screen can say "saved" while nothing was kept. Read the outcome back through another path of the application: reopen the record, find it in its list, reload the page and look again. The user tells you what they see, or shows a screenshot; you give the verdict.

For effects the screen does not show (a mail sent, a PDF produced, a file exported), ask the user for what was produced, and judge that.

A failed case does not stop the run, unless it makes the following cases impossible. One pass that collects every failure beats two passes that find one each.

Track which cases have run in a working file in the ticket's folder, and delete it once the run is closed.

## When the run ends

Report how many cases passed, how many failed, and which could not be run and why: *not runnable* is a legitimate outcome. List the records the cases built, so the user can clear them from the environment.

What has to be fixed goes back into the plan as new tasks: call the Skill tool with "mise-en-place:prep-list", which numbers them. The validation resumes once they are done.

When every case has passed, set the `Status` of the ticket's `prep-list/chefs-table.md` to `done`.

What the run taught about the system (a trap, a behaviour nobody expected) goes under `### For the pantry` in the `## Comments` of `chefs-table.md`, below what earlier runs wrote, one line each, for `bill` to propose at closing. Write only notes you would recommend saving. A run that taught nothing says so under the heading: `Nothing.`

Done when every case has run or is marked not runnable, each has its verdict, and the report and the Comments are written.
