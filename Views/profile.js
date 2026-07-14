const current = input?.current ?? dv.current();
const type = input?.type ?? current.type;
const helperSource = await dv.io.load("Views/helpers.js");
const pf = new Function(`${helperSource}; return PathfinderViews;`)();

const eventDateInput = (field) => {
  const formatted = pf.formatTimelineDate(current[field]);

  return formatted || "";
};

const imageMarkdown = (value) => {
  if (!pf.hasValue(value)) return null;

  const raw = Array.isArray(value) ? value[0] : value;
  const path = raw?.path ? raw.path : String(raw).trim();

  if (!path) return null;
  if (path.toLowerCase() === "none") return null;
  if (path.startsWith("![") || path.startsWith("![[") || path.startsWith("<img")) return path;
  if (path.startsWith("[[")) return `!${path}`;
  if (/^https?:\/\//i.test(path)) return `![Profile image](${path})`;

  return `![[${path}]]`;
};

const scheduleSuperchargedProfileLinks = () => {
  const obsidianApp = typeof app !== "undefined" ? app : globalThis.app ?? dv.app;
  const superchargedLinks = obsidianApp?.plugins?.plugins?.["supercharged-links-obsidian"];
  if (!superchargedLinks?.updateContainer || !dv.container?.findAll) return;

  const clearSuperchargedAttributes = (el) => {
    el.classList.remove("data-link-icon", "data-link-icon-after", "data-link-text");
    Array.from(el.attributes)
      .filter((attr) => attr.name.startsWith("data-link-"))
      .forEach((attr) => el.removeAttribute(attr.name));
  };

  const decorateProfileLinks = () => {
    dv.container
      .querySelectorAll(
        '.callout[data-callout="pf-profile"] .mb-suggest-text:has(a.internal-link), .callout[data-callout="pf-profile"] .mb-inline-list-item > span:has(a.internal-link)'
      )
      .forEach(clearSuperchargedAttributes);

    [
      '.callout[data-callout="pf-profile"] a.internal-link',
      '.callout[data-callout="pf-profile"] .mb-suggest-text:not(:has(a.internal-link))',
      '.callout[data-callout="pf-profile"] .mb-inline-list-item > span:not(:has(a.internal-link))'
    ].forEach((selector) => superchargedLinks.updateContainer(dv.container, superchargedLinks, selector));
  };

  let refreshTimer = null;
  const scheduleRefresh = () => {
    if (refreshTimer) window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(decorateProfileLinks, 50);
  };

  window.requestAnimationFrame(scheduleRefresh);

  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(dv.container, { childList: true, subtree: true });
  dv.component?.register?.(() => {
    if (refreshTimer) window.clearTimeout(refreshTimer);
    observer.disconnect();
  });
};

const profiles = {
  character: [
    ["Location", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):location]'],
    ["Descriptor", "INPUT[text:descriptor]"],
    ["Gender", "INPUT[text:gender]"],
    ["Ancestry", "INPUT[text:ancestry]"],
    ["Role", "INPUT[text:role]"],
    ["Level", "INPUT[number:level]"],
    ["Status", "INPUT[inlineSelect(option(alive), option(undead), option(dead), option(missing), option(unknown)):status]"],
    ["Affiliations", "INPUT[inlineList:affiliations]"]
  ],

  organization: [
    ["Type", "INPUT[inlineSelect(option(religious), option(military), option(political), option(mercantile), option(criminal), option(civic), option(secret), option(tribe), option(movement), option(other)):subtype]"],
    ["Location", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):location]'],
    ["Leaders", "INPUT[inlineList:leaders]"],
    ["Deity", "INPUT[text:deity]"],
    ["Members", "INPUT[text:members]"],
    ["Affiliations", "INPUT[inlineList:affiliations]"]
  ],

  deity: [
    ["Titles", "INPUT[inlineList:titles]"],
    ["Areas of Concern", "INPUT[inlineList:areas_of_concern]"],
    ["Symbol", "INPUT[text:symbol]"],
    ["Realm", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):realm]'],
    ["Worshippers", "INPUT[text:worshippers]"]
  ],

  site: [
    ["Type", "INPUT[text:subtype]"],
    ["Parent", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):parent]'],
    ["Leader", 'INPUT[suggester(optionQuery("Characters"), useLinks(true), allowOther(true)):leader]']
  ],

  region: [
    ["Type", "INPUT[text:subtype]"],
    ["Parent", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):parent]'],
    ["Leader", 'INPUT[suggester(optionQuery("Characters"), useLinks(true), allowOther(true)):leader]'],
    ["Peoples", "INPUT[inlineList:peoples]"],
    ["Languages", "INPUT[inlineList:languages]"],
    ["Religions", "INPUT[inlineList:religions]"]
  ],

  settlement: [
    ["Location", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):location]'],
    ["Government", "INPUT[text:government]"],
    ["Leader", 'INPUT[suggester(optionQuery("Characters"), useLinks(true), allowOther(true)):leader]'],
    ["Population", "INPUT[text:population]"],
    ["Peoples", "INPUT[inlineList:peoples]"],
    ["Languages", "INPUT[inlineList:languages]"],
    ["Religions", "INPUT[inlineList:religions]"]
  ],

  nation: [
    ["Capital", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):capital]'],
    ["Government", "INPUT[text:government]"],
    ["Leader", 'INPUT[suggester(optionQuery("Characters"), useLinks(true), allowOther(true)):leader]'],
    ["Population", "INPUT[text:population]"],
    ["Peoples", "INPUT[inlineList:peoples]"],
    ["Languages", "INPUT[inlineList:languages]"],
    ["Religions", "INPUT[inlineList:religions]"]
  ],

  item: [
    ["Subtype", "INPUT[inlineSelect(option(artifact), option(divine artifact), option(weapon), option(armor), option(devotional object), option(consumable), option(tool), option(text), option(religious text), option(material), option(vehicle), option(other)):subtype]"],
    ["Level", "INPUT[number:item_level]"],
    ["Rarity", "INPUT[inlineSelect(option(common), option(uncommon), option(rare), option(unique)):rarity]"]
  ],

  event: [
    ["Start Date", () => eventDateInput("aat-event-start-date")],
    ["End Date", () => eventDateInput("aat-event-end-date")],
    ["Location", 'INPUT[suggester(optionQuery("Atlas"), useLinks(true), allowOther(true)):location]'],
    ["Participants", "INPUT[inlineList:participants]"]
  ],

  source: [
    ["Type", "INPUT[text:source_type]"],
    ["URL", "INPUT[text:url]"]
  ],

  map: [
    ["Status", "INPUT[inlineSelect(option(draft), option(active), option(archived)):status]"],
    ["Aliases", "INPUT[inlineList:aliases]"]
  ]
};

if (!profiles[type]) {
  dv.paragraph(`_Unknown profile type: ${type ?? "missing"}_`);
} else {
  const profileImage = type !== "source" ? imageMarkdown(current.image) : null;
  if (profileImage) {
    const imageContainer = dv.container.createDiv({ cls: "pf-profile-image" });
    await dv.api.renderValue(profileImage, imageContainer, dv.component, current.file.path, false);
  }

  const profileBlock = [
    "> [!pf-profile] Info",
    "> | Field | Value |",
    "> | --- | --- |",
    ...profiles[type].map(([label, input]) => `> | ${label} | ${typeof input === "function" ? input() : `\`${input}\``} |`)
  ].join("\n");

  await dv.api.renderValue(profileBlock, dv.container, dv.component, current.file.path, false);
  scheduleSuperchargedProfileLinks();
}
