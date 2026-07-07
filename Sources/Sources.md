Books, adventures, articles, and other references used by the campaign wiki.

```dataview
TABLE source_type AS Type
WHERE type = "source"
AND !contains(file.path, "Templates/")
SORT file.name ASC
```
