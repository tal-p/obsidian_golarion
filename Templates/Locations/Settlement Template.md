---
type: settlement
image:
location: "[[<% (() => { const parts = tp.file.folder(true).split('/'); const folder = parts[parts.length - 1]; return folder === tp.file.title ? parts[parts.length - 2] : folder; })() %>]]"
government:
leader:
population:
peoples: []
languages: []
religions: []
map:
sources:
tags:
  - atlas
  - location
---

# `= this.file.name`

```dataviewjs
await dv.view("Views/profile", { current: dv.current() })
```

## Geography

## History

## Government & Military

## People & Culture

## Current Affairs

## Key Figures and Factions

## Key Locations

```dataviewjs
await dv.view("Views/tables", { table: "locationNavigation", current: dv.current() })
```
