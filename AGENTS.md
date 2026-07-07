# Project Instructions

This vault is a local Pathfinder wiki for Golarion lore: regions, locations, factions, deities, peoples, history, characters, items, and related setting material.

Write concise, organized, wiki-friendly Markdown with useful internal links. Do not add Pathfinder rules or mechanics unless explicitly requested.

## Note Style

- Write compact lore entries that work as standalone reference notes.
- Prefer concise paraphrase over transcription.
- Avoid repetition between sections or between prose and frontmatter/profile fields.
- Avoid tiny or duplicate sections, preferring to delete them entirely if there's no meaningful additions.
- Link to relevant notes, including notes that will be created later.
- After the H1 title, put the profile Dataview block first. Put the note's core summary prose directly below that profile block without another heading.
- Use frontmatter/profile properties for data that will support Dataview tables, filtering, or navigation. Put narrative details, motives, goals, and other prose-style facts in the body sections instead.
- Treat `Related Notes` sections as generated navigation only. Do not add prose or hand-written lists there; update `Views/tables.js` or frontmatter links/properties instead.

## Source Work

- Read the full relevant PDF article or section before editing from a source.
- Preserve all key lore information from the source. The note should serve as a complete but concise summary of the content, organized for easy viewing and reference.

## Templates

Use templates from `Pathfinder/Templates` when creating new notes. Preserve frontmatter, heading order, and section names unless the user asks for a different structure.

Use shared Dataview views instead of duplicating profile fields or table logic in individual notes:

- `Pathfinder/Views/profile.js` renders each note's editable Meta Bind profile block based on its `type` frontmatter. Add or change profile fields there, then call it from notes and templates with `await dv.view("Views/profile", { current: dv.current() })`.
- `Pathfinder/Views/tables.js` renders reusable Dataview index and relationship tables. Add new table renderers there, then call them with `await dv.view("Views/tables", { table: "tableName", current: dv.current() })`.
- Templates include a separated `Related Notes` section with the appropriate shared table call already loaded. Preserve that section and its Dataview block, but leave it otherwise empty.

Always use the Obsidian CLI to create notes so Templater expressions resolve:

```powershell
obsidian templater:create-from-template template="Locations/Site Template.md" file="Atlas/Nations/Isger/Example.md"
```

## Location Notes

- Follow the matching template's H2 structure for nations, settlements, and sites. Delete H2 sections only when no relevant information exists for them. Use subheadings wherever they would help split separate ideas within a section.
- Put the place's core premise and essential context in the summary prose below the profile block.
- Put each fact where it is most useful; later sections may overlap for reference value, but should not restate information.
- Use `Key Figures and Factions` and `Key Locations` as selective, hand-written hub indexes for the most important named people, groups, and places, with brief descriptions and forward links.
- Use `History` only when the past is independently important or too detailed to fit cleanly elsewhere. Fold tiny or duplicate history notes into the relevant current/context section.

## Events + Timelines

Use April automatic timelines for dated lore that should appear on timeline notes.

### Major Events
- For major events that deserve their own note, create an event note from `Pathfinder/Templates/Lore/Event Template.md`.
- Add any relevant regional or topic `timelines`. Keep timeline slugs lowercase, short, and stable. Prefer existing slugs from nearby notes before inventing new ones.
- Use April date fields exactly as `aat-event-start-date` and, when needed, `aat-event-end-date`. Dates should be quoted strings in `YYYY-MM-DD` form. Use `0` for unknown month or day, such as `"4697-0-0"` for an unknown date in 4697 AR.

### Inline Events
- Use inline April events inside an existing note when the dated item is useful on a timeline but too small for a full event note. Place the block near the prose it summarizes, usually after the paragraph that mentions the date.
- `aat-event-body` values should use wiki links where it makes sense. However, they should never link to their own note. If starting with a wiki link, wrap the entire value in double quotes to avoid the leading `[[...]]` being treated as YAML syntax.
- Inline event blocks must use this shape:

```markdown
%%aat-inline-event
aat-event-start-date: "4725-6-0"
aat-render-enabled: true
timelines: [example]
aat-event-title: Short Event Title
aat-event-body: One concise sentence summarizing the timeline-relevant fact about [[example]].
%%
```

- Timeline notes use April code blocks such as:

````markdown
```aat-vertical
isger
```
````

## Plugins

- Templater: reusable note templates.
- Dataview: light frontmatter for future indexes and lists.
- Meta Bind: interactive fields and controls for note metadata.
- TTRPG Tools - Maps: image-based world, regional, and location maps.
- April automatic timelines: automatic timeline creation
- Waypoint: folder navigation and generated map-of-content notes.
