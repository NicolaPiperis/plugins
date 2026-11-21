# The ticket map

A request too big for one session is split into tickets, one per functionality, each designed in a session of its own. The ticket map holds them together: what the whole request reaches, the tickets, what each one depends on, and where each one stands.

## The folder

`core/tickets/maps/{product}/{code}-{short-name}/` in the pantry, where `{code}` is the request's code in the tracker or, for a request with no ticket yet, the date the map was made (`yyyy-mm-dd`). Lowercase, words joined by dashes, no spaces: the path goes into the command that resumes the work.

It holds `map.md`, from the template `config/templates/tickets/map.md`, and the research files the request needed before it was split. Each ticket of the map has a folder of its own under `core/tickets/pending/{product}/{code}/`, opened when its design starts: its order, research files and mockups go there.

**The map gists, the ticket holds.** Each ticket's line names the decisions the other tickets need - the perimeter, the permissions, a rule they all follow - in one line; the decisions themselves live only in the ticket's order.

**A ticket exists once its functionality can be named precisely.** What the request will need but cannot yet be named that sharply goes under Not Yet Defined, and becomes a ticket when a designed ticket makes it clear.

## Making it

Draft `map.md`, with the request as it was made and each ticket the user accepted listed `to design`. Show it whole and write it on the user's go. Then design ticket 1, the one the others stand on, in this session.

## One ticket per session

A ticket becomes `designing` when its design starts. Open its ticket as `SKILL.md` says, with its functionality, as the map names it, for the request, and write its code on its line of the map. Its design reads the ticket map and the orders of the tickets it depends on: their decisions are its facts. It runs as `SKILL.md` says for any request, with its branches inside its own functionality. A decision that would change a ticket already `ready` is said to the user; with their yes, that ticket goes back to `to design`, and its order is designed again in a session of its own.

## Closing a ticket

At the end, write its order as for any request, and update `map.md`: the ticket's state, the one line of its key decisions, the tickets and the parts of Not Yet Defined it made clear. Show the changes and write them on the user's go.

When every ticket is `ready`, or the user closes the map, set its status to `Closed`.

While the map is open, tell the user to type `/clear`, and give them the command that resumes the work, whole: `/take-order <the map's folder>`.

**Done when** the ticket designed in this session holds its order, `map.md` says where every ticket stands, and the user has the command to resume.

## Resuming

With a path, open that ticket map. With none, list the open ticket maps under the pantry's `core/tickets/maps/`, and let the user pick one or start a new request. The triage the map passed stands: bring code and pantry up to date as the triage does, and go on. Propose the first ticket `to design` whose tickets it depends on are `ready`; the user may pick another.
