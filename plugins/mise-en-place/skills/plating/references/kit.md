# Building the kit

The kit's HTML and styles come from the product as the browser renders it. The rules come from the project's design system, at the screen; in the kit, the design system only chooses which screen of the product each piece is copied from.

## The base

`build-base.mjs` builds it: it opens the built application in a browser and reads every stylesheet it holds once loaded, those the build emits and those its framework and its component library inject while it runs. A style it lists as skipped is ported into the frame by hand.

A component library that injects a component's styles only when the component renders leaves them out of the base when the first page renders none of it. The check's shots show it: a piece without its look. Give those styles to the piece with `--css`, taken from the library's own files in the project.

## Scoped styles

Many frameworks confine a component's styles to its own elements, rewriting the selectors at build: emulated encapsulation, scoped styles, CSS modules, generated class names. Copy the DOM as the browser renders it, with the attributes and the class names the framework adds: the base already holds the rules that match them. `render.mjs` prints an element that way.

Where the element sits behind a login, read it in the code instead, and port its confined styles by hand: give each element of the component's template an attribute of its own, such as `_c-topbar`, and add it to every selector of those styles.

## The frame

`frame.html` copies the look of the product's shell - top bar, menu and panels - as the browser renders it: print it with `render.mjs` on a route that shows it, or build it from the code when the shell sits behind a login. It holds no stylesheet of the base.

It adds the two things the screen relies on, the same in every kit: the empty element marked `data-mockup-screen`, and `window.mockupFrame` with its four services, each built as the shell builds it.

Of the shell's behaviour, the frame keeps the menu opening and closing, with one tap wherever the shell shows its menu button; the rest stays still. The frame shows the shell working: a defect the shell's code has goes to the defects you hand back.

Once it is built, record the files it was copied from, so a change to the shell clears it:

```
node <this skill>/scripts/build-base.mjs --project <project folder> --key <project key> --root <kits folder> [--app <application>] --record --shell <file>,<file>
```

## A piece

A piece copies the DOM as the browser renders it, the host element and the classes the framework sets on it included; the styles the base lacks go with it as `--css`.

Copy it from the screen of the product that follows the design system most closely, and give that screen's file as `--source`. A piece the product has only in part is copied from the part it has; one it lacks takes `--source none`.

Once the catalog's base is built, record the component libraries its pieces come from, so a new version of one clears the catalog: the same command with `--record --library <package>,<package>`.

## The catalog's base

Built with the kit: `search-panel`, `button-row`, a `grid-<component>` for every grid component the code uses, `empty-grid`, `editable-row`, `tabs`, `dialog`, `form-fields`.

**Done when** `build-base.mjs --check` answers `same`.
