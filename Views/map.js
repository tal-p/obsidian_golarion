const current = input?.current ?? dv.current();
const helperSource = await dv.io.load("Views/helpers.js");
const pf = new Function(`${helperSource}; return PathfinderViews;`)();

const firstValue = (value) => Array.isArray(value) ? value[0] : value;

const linkTarget = (value) => {
  if (!pf.hasValue(value)) return null;

  const raw = firstValue(value);
  if (!pf.hasValue(raw)) return null;
  if (raw?.path) return raw.path;

  const text = String(raw).trim();
  const wikiMatch = text.match(/^\[\[([^|\]]+)(?:\|[^\]]+)?\]\]$/);
  if (wikiMatch) return wikiMatch[1].trim();

  return text;
};

const resolveVaultPath = (path) => {
  const cleanPath = String(path ?? "").trim();
  if (!cleanPath) return null;
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  const obsidianApp = typeof app !== "undefined" ? app : globalThis.app ?? dv.app;
  return obsidianApp?.metadataCache?.getFirstLinkpathDest(cleanPath, current.file.path)?.path ?? cleanPath;
};

const mapPath = resolveVaultPath(linkTarget(current.map));

if (mapPath) {
  const markerPath = `${mapPath}.markers.json`;
  const id = `map-${current.file.path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;

  const mapBlock = [
    "```zoommap",
    `image: ${mapPath}`,
    `markers: ${markerPath}`,
    "height: 520px",
    "width: 100%",
    "resizable: true",
    "resizeHandle: native",
    "render: canvas",
    "storage: json",
    "responsive: true",
    "wrap: false",
    `id: ${id}`,
    "```"
  ].join("\n");

  const details = dv.container.createEl("details", { cls: "pf-map-section" });
  details.open = input?.open ?? false;
  details.style.margin = "1.25rem 0";
  details.style.padding = "0.45rem 0 0.65rem";
  details.style.borderTop = "1px solid var(--background-modifier-border)";
  details.style.borderBottom = "1px solid var(--background-modifier-border)";

  const summary = details.createEl("summary", { text: input?.title ?? "Location Map" });
  summary.style.fontWeight = "600";
  summary.style.color = "var(--text-accent)";

  const content = details.createDiv({ cls: "pf-map-content" });
  content.style.marginTop = "0.5rem";
  await dv.api.renderValue(mapBlock, content, dv.component, current.file.path, false);
}
