---
name: plating
description: Build a mockup of a product screen as one self-contained HTML file that looks like the finished product - copied from the project's own code and design system, whatever its framework, shown in the formats it needs - desktop, tablet, mobile - and under the conditions that change it, and refined with the user until approved.
---

A **mockup** shows how a screen of the product will look and behave once built. The developer receives it attached to the ticket and builds from it, so it looks like the finished product: the product's own theme, its own components, its own page around it.

The mockup stands on two sources, the pantry and the code, and copies the product from them. Its scripts run on Node and drive Chrome or Edge, on Windows, macOS or Linux.

## The question

Every mockup answers one question about one screen: what it shows, in which order, how the user reaches it and acts on it. Take it from the branch that calls you, with what the branch already read of the screen: its fields, labels, the screen it starts from, the files. Called without a branch, ask the user for the question and read the screen in the code, through `locate-stations`.

**The formats.** Ask the user before the first version which formats the screen needs: desktop, tablet, mobile, or more than one. A tablet or mobile format covers the device upright and on its side. Only the formats chosen are built, checked and shown: each one costs a round of shots and of fixes.

## The kit

Every product has a **kit** under `~/Documents/mockup/_base/<project>/`, where `<project>` is the project's key in the pantry's `config/vocabulary/projects.yaml`, with dots for slashes; a repo that builds more than one application has a kit for each, under `<project>/<application>/`. The kit has three parts, each rebuilt only when what decides it changes in the code:

- `base.html`: every stylesheet the application holds in the browser. This skill's script builds it from the project's own build, whatever its framework, and rebuilds it by itself whenever the styles change;
- `frame.html`: the product's shell, which every screen sits in. It gives the screen one empty element marked `data-mockup-screen`, where the screen goes, and `window.mockupFrame`, with the services the shell gives screens in the code under fixed names: `title(text)` sets the title the shell shows, `toast(severity, text)` shows a message, `confirm(text, onYes)` asks for a confirmation, `menu(path, icon)` adds the screen's item to the menu under the path that reaches it, and marks it active - for a screen the menu reaches;
- `catalog.html`: the HTML of the pieces screens are made of, read and written only through `scripts/catalog.mjs`:

```
node <this skill>/scripts/catalog.mjs --kit <kit folder> --list | --get <piece> | --missing
node <this skill>/scripts/catalog.mjs --kit <kit folder> --add <piece> --source <repo file> --html <file with the piece> [--css <file>,<file>]
```

The frame and the catalog are written by hand, as [references/kit.md](references/kit.md) says. `scripts/render.mjs` prints an element of the product as the browser renders it, the way the frame and the pieces are copied:

```
node <this skill>/scripts/render.mjs --kit <kit folder> --route <path> --selector <css selector>
```

Run `scripts/build-base.mjs` with `--check`. It brings the kit up to the code - it rebuilds the base itself when only the styles changed - and prints the kit's state on its last line:

```
node <this skill>/scripts/build-base.mjs --project <project folder> --key <project key> --root ~/Documents/mockup/_base [--app <application>] --check
```

- `same`: the kit is current; work from it.
- `missing`: first tell the user that this mockup takes from twenty to thirty minutes, because the product's kit has to be built first, that they can do something else meanwhile, and that you will tell them when it is ready. Then run the script again without `--check`: it builds the project and reads its styles. Read `references/kit.md`, build `frame.html` and the catalog's base, and record them with `--record`.
- `incomplete`: tell the user first that it takes a few minutes, read `references/kit.md`, and complete what the check names - `frame`: build `frame.html` again, or give it what it lacks; a piece: add it to the catalog.
- `choose an app`: the build leaves more than one application; run it again with `--app` set to the one the screen belongs to. A screen shared by more applications takes the one the user names.
- `unsupported`: the script says why. When a build made another way exists, give its folder with `--dist`; when there is none, build `frame.html` in the kit folder by hand from the code, its stylesheets inline, and tell the user.
- `no browser`: tell the user that Chrome or Edge is needed, and stop.

**Done when** the check answers `same`, or, for `unsupported` with no build, `frame.html` is built.

## The screen

Write the **screen** in a file of its own: its markup, its styles and its script, and nothing of the frame; it reaches the frame only through `window.mockupFrame`. Read the project's `rules/design-system.md` through `inventory`: its rules bind every element. Each piece comes from the catalog with `--get`; a piece the screen needs beyond the catalog is built as `references/kit.md` says for a piece and added with `--add`, under its component's name, before the screen uses it. The code of the screen and of its neighbours gives the fields, labels and buttons. Where the design system does not cover an element, build it from the code and note it for the design system.

- **Example data**, chosen to test the screen: long descriptions, zeros, empty fields, large quantities; codes, dates and numbers in the product's format, written as the product's code formats them.
- **The first view shows the screen at work**, with its data: a search opens on its results, a detail on a filled record.
- **Working controls**: buttons, fields and tabs act on the screen's data in memory. An action that reaches outside the screen - print, send, a batch run - shows a toast saying what would happen.
- **Conditions** that change the screen - a profile that only reads, a feature on or off - are listed in a conditions file. The screen redraws itself in `window.onMockupConditions(values)`.
- **States**: what a click opens - a dialog, a menu, a row in edit, a confirmation - is also a function in `window.mockupStates`, under a name of its own, that opens it.
- **Overlays** - an open dropdown, a dialog, a toast of the screen's own - live in the screen too, placed as the product's component library places them over the page.

The files live in the folder the caller names; with none, under `~/Documents/mockup/<screen>/`. They are named after the screen: `<screen>.screen.html`, `<screen>.conditions.json`, and the mockup `<screen>.html`.

**Check every version** - the first and each change - with `scripts/check.mjs`. It puts the screen in the frame, opens the page in Chrome or Edge without a window at each format's exact size, and shoots it in every format chosen, under each condition, and in each state:

```
node <this skill>/scripts/check.mjs --screen <screen.html> --kit <kit folder> --out <mockup folder>/check --formats <format>,<format> [--conditions <conditions.json>] [--states <state>,<state>]
```

Read every shot and the console, which also reports a page wider than its screen and the element the overflow starts at. A version passes when the console is clear and, in every shot, every element sits where the product's code and the design system put it. A fault the product's own code brings - its shell, its theme - is a defect you hand back, and leaves the version passing.

A version that passes becomes the mockup through `scripts/compose.mjs`: it puts the screen into the frame's slot, its scripts after the frame's, and the page into the viewer:

```
node <this skill>/scripts/compose.mjs --screen <screen.html> --kit <kit folder> --out <mockup.html> --title <screen> --question <question> --formats <format>,<format> [--conditions <conditions.json>]
```

The viewer shows the page between two fixed neobrutalist bars: the question and the formats chosen at the top - a single format needs no button -, the conditions at the bottom. Desktop fills the space between the bars; tablet and mobile show the device upright and on its side, side by side, and the product's own stylesheets lay the screen out for each. Every format opens the page afresh at its own size, so what the page decides on load holds for that device.

## With the user

Open the mockup for the user in their default browser: `start "" <mockup.html>` on Windows, `open <mockup.html>` on macOS, `xdg-open <mockup.html>` on Linux. Every change the user asks for goes into the screen and is a new version: check it, compose it, and tell the user to reload. A format added later is a new version too. A change for tablet or mobile only goes into the screen's styles for that width, and becomes a decision of its own.

**Done when** the user approves the mockup.

## The end

Delete the `check` folder: the shots served the versions, the approved mockup stays.

Ask the user whether to propose, as notes for the design system, the interface rules the mockup settled that the design system does not hold; name them.

Hand back to the caller: the mockup and its folder; the formats it was designed in; the decisions it settled - the fields, their order and labels, how the screen is reached, what changes in each format and under each condition; the notes for the design system the user chose to propose; and the defects of the product's code the kit or the screen met.
