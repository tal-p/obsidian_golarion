---
type: site
image:
subtype:
parent: "[[<% (() => { const parts = tp.file.folder(true).split('/'); const folder = parts[parts.length - 1]; return folder === tp.file.title ? parts[parts.length - 2] : folder; })() %>]]"
leader:
sources:
tags:
  - atlas
  - location
---

# `= this.file.name`

```dataviewjs
await dv.view("Views/profile", { current: dv.current() })
```

## History

## Features

## Current Affairs

## Key Figures and Factions

```dataviewjs
await dv.view("Views/tables", { table: "siteNavigation", current: dv.current() })
```
