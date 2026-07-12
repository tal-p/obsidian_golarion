# Project Instructions

This vault is a local Pathfinder wiki for Golarion lore, including regions, locations, factions, deities, peoples, history, characters, items, and related setting material. 

Write concise, organized, wiki-friendly Markdown with useful internal links. Do not add Pathfinder rules or mechanics unless explicitly requested.

## Core Writing Principles

- Write compact lore entries that work as standalone reference notes.
- Preserve all key lore information from source material while keeping notes concise and easy to scan.
- Avoid repetition between sections, between prose and frontmatter/profile fields, or between related notes.
- Delete tiny, empty, or duplicative sections rather than keeping template headings.
- Link to relevant notes, including notes that do not exist yet but should be created later.
- Put each fact where it is most useful. Some light overlap is acceptable for reference value, but do not restate the same information unnecessarily.

## Source Work

- Read the full relevant PDF article or section before editing from a source.
- Summarize the source completely enough that the note can serve as a concise reference for that topic.
- Preserve important names, relationships, locations, dates, motivations, conflicts, and historical context.

## Note Structure

- Use templates from `Pathfinder/Templates` when creating new notes.
- Preserve template frontmatter, heading order, and section names.
- After the H1 title, put the profile Dataview block first.
- Put the note’s core summary prose directly below the profile block without adding another heading.
- Avoid adding new H2 sections.
- Create H3 or deeper subheadings when they help break up dense sections.
- Treat `Related Notes` sections as generated navigation only. Do not add prose or hand-written lists there.

## Frontmatter, Profiles, and Views

Use frontmatter and profile properties for structured data that supports Dataview tables, filtering, or navigation.

Use body sections for narrative details, motives, goals, descriptions, history, and other prose-style facts.

Use shared Dataview views instead of duplicating profile fields or table logic in individual notes:

- `Pathfinder/Views/profile.js` renders each note’s editable Meta Bind profile block based on its `type` frontmatter. Add or change profile fields there, then call it from notes and templates with `await dv.view("Views/profile", { current: dv.current() })`.
- `Pathfinder/Views/tables.js` renders reusable Dataview index and relationship tables. Add new table renderers there, then call them with `await dv.view("Views/tables", { table: "tableName", current: dv.current() })`.

## Creating Notes

Always use the Obsidian CLI to create notes so Templater expressions resolve:

```powershell
obsidian templater:create-from-template template="Locations/Site Template.md" file="Atlas/Nations/Isger/Example.md"
```

## Location Notes

For locations, the summary below the profile should explain what the place is, why it matters, and its current identity or situation.

Use the following location sections for distinct reference value:

- `Key Figures and Factions`: a selective hub index for the most important named people, groups, monsters, or organizations, with brief descriptions and forward links.
- `Key Locations`: a selective hub index for the most important named places within or strongly tied to the location, with brief descriptions and forward links.

## Character Notes

For characters, the summary below the profile should explain who the character is, why they matter, and their current role, allegiance, or situation.

Always fill out the frontmatter when a Pathfinder NPC line is available. It will always be in the format `(descriptor gender ancestry role level)`.

## Events Notes and Timelines

Use April automatic timelines for dated lore that should appear on timeline notes.

### Major Events

For major events that deserve their own note, create an event note from:

`Pathfinder/Templates/Lore/Event Template.md`

Add relevant regional or topic `timelines`. Keep timeline slugs lowercase, short, and stable. Prefer existing slugs from nearby notes before inventing new ones.

Use April date fields exactly as:

```yaml
aat-event-start-date: "YYYY-MM-DD"
aat-event-end-date: "YYYY-MM-DD"
```

Use `0` for unknown months or days, such as `"4697-0-0"` for an unknown date in 4697 AR.

### Inline Events

Use inline April events inside an existing note when a dated item is useful on a timeline but too small for a full event note.

Place the block near the prose it summarizes, usually directly after the paragraph that mentions the date.

Inline event blocks must use this shape:

```markdown
%%aat-inline-event
aat-event-start-date: "4725-6-0"
aat-render-enabled: true
timelines: [example]
image: none
aat-event-title: Short Event Title
aat-event-body: One concise sentence summarizing the timeline-relevant fact about [[example]].
%%
```

`aat-event-body` values should use wiki links where helpful, but should never link to their own note. If the value starts with a wiki link, wrap the entire value in double quotes so the leading `[[...]]` is not treated as YAML syntax.

Use exactly `image: none` when the event should not display an image in the timeline.

Timeline notes use April code blocks such as:

````markdown
```aat-vertical
isger
```
````

## Plugins

- Templater: reusable note templates.
- Dataview: lightweight frontmatter-backed indexes and lists.
- Meta Bind: interactive fields and controls for note metadata.
- TTRPG Tools - Maps: image-based world, regional, and location maps.
- April automatic timelines: automatic timeline creation.
- Waypoint: folder navigation and generated map-of-content notes.