Items, artifacts, relics, and other notable objects tracked by the campaign wiki.

```dataview
TABLE item_level AS Level, rarity AS Rarity
WHERE type = "item"
AND !contains(file.path, "Templates/")
SORT item_level ASC, file.name ASC
```
