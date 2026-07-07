Maps and map-linked reference pages for the campaign wiki.

```dataview
TABLE map_scope AS Scope
WHERE type = "map"
AND !contains(file.path, "Templates/")
SORT file.name ASC
```
