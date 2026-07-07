---
type: source
source_type: adventure path
tags:
  - source
---

# `= this.file.name`

```dataviewjs
await dv.view("Views/profile", { current: dv.current() })
```

Pathfinder adventure path source for Isger, the Chitterwood, Elidir, Saringallow, and related Hellbreakers campaign material.

## Linked Notes

```base
filters:
  and:
    - sources.contains(this.file)
views:
  - type: table
    name: Notes
    order:
      - file.name
      - type

```

## Notes
