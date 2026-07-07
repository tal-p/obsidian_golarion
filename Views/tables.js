const current = input?.current ?? dv.current();
const table = input?.table;
const helperSource = await dv.io.load("Views/helpers.js");
const pf = new Function(`${helperSource}; return PathfinderViews;`)();

const hasValue = pf.hasValue;
const asArray = (value) => Array.isArray(value) ? value : (hasValue(value) ? [value] : []);
const linkPath = (value) => value?.path ?? String(value ?? "").replace(/^\[\[|\]\]$/g, "").split("|")[0];
const sameLink = (left, right) => hasValue(left) && hasValue(right) && linkPath(left) === linkPath(right);
const pageType = (page) => page.type ?? "note";
const formatType = (type) => String(type ?? "note").replace(/\b\w/g, (letter) => letter.toUpperCase());
const leaders = (page) => page.leaders ?? page.leader;

const containsLinkOrName = (values, link, name) => {
  const list = asArray(values);
  return list.some((value) => sameLink(value, link) || value === name || linkPath(value) === name);
};

const pageMatchesValue = (page, values) => containsLinkOrName(values, page.file.link, page.file.name);
const inCurrentLocation = (page) => sameLink(page.location, current.file.link) || containsLinkOrName(page.location, current.file.link, current.file.name);
const inCurrentParent = (page) => sameLink(page.parent, current.file.link) || containsLinkOrName(page.parent, current.file.link, current.file.name);
const isRealPage = (page) => !page.file.path.includes("Templates/");
const notCurrent = (page) => !sameLink(page.file.link, current.file.link);
const isLocation = (page) => ["nation", "region", "settlement", "site"].includes(page.type);
const linksToCurrent = (page) => containsLinkOrName(page.file.outlinks, current.file.link, current.file.name);
const sourcesCurrent = (page) => containsLinkOrName(page.sources, current.file.link, current.file.name);

const pagesOfType = (type) => dv.pages()
  .where((page) => page.type === type && isRealPage(page))
  .sort((page) => page.file.name, "asc");

const eventsAtCurrent = () => pagesOfType("event").where((page) => inCurrentLocation(page));
const eventsWithCurrentParticipant = () => pagesOfType("event")
  .where((page) => containsLinkOrName(page.participants, current.file.link, current.file.name));

const displayValue = (value) => {
  if (Array.isArray(value) && !value.length) return "";
  if (value?.array && !value.length) return "";
  return value ?? "";
};

const renderValue = async (value, container) => {
  await dv.api.renderValue(displayValue(value), container, dv.component, current.file.path, false);
};

const rowArray = (rows) => rows.array ? rows.array() : rows;

const renderDetailsTable = async (container, title, headers, rows) => {
  const rowList = rows.array ? rows.array() : rows;
  if (!rowList.length) return false;

  const details = container.createEl("details", { cls: "pf-nav-table" });
  details.createEl("summary", { text: `${title} (${rowList.length})` });

  const tableEl = details.createEl("table");
  const thead = tableEl.createEl("thead");
  const headerRow = thead.createEl("tr");
  headers.forEach((header) => headerRow.createEl("th", { text: header }));

  const tbody = tableEl.createEl("tbody");
  for (const row of rowList) {
    const tr = tbody.createEl("tr");
    for (const cell of row) {
      await renderValue(cell, tr.createEl("td"));
    }
  }

  return true;
};

const renderGroups = async (groups) => {
  const visibleGroups = groups
    .map((group) => ({ ...group, rows: rowArray(group.rows) }))
    .filter((group) => group.rows.length);

  if (!visibleGroups.length) return false;

  const wrapper = dv.container.createEl("details", { cls: "pf-related-notes" });
  wrapper.createEl("summary", { text: "Related Notes" });

  let rendered = false;
  for (const group of visibleGroups) {
    rendered = await renderDetailsTable(wrapper, group.title, group.headers, group.rows) || rendered;
  }
  return rendered;
};

const characterRows = (pages) => pages.map((page) => [
  page.file.link,
  page.descriptor,
  page.gender,
  page.ancestry,
  page.role,
  page.level
]);

const organizationRows = (pages) => pages.map((page) => [
  page.file.link,
  leaders(page),
  page.location
]);

const eventRows = (pages) => pages.map((page) => [
  page.file.link,
  pf.formatTimelineDate(page["aat-event-start-date"]),
  page.location
]);

const childPlaces = () => dv.pages()
  .where((page) =>
    isRealPage(page) &&
    notCurrent(page) &&
    isLocation(page) &&
    (
      inCurrentParent(page) ||
      inCurrentLocation(page)
    )
  )
  .sort((page) => page.file.name, "asc");

const placeDetail = (page) => {
  if (page.type === "settlement") return page.government;
  return page.subtype;
};

const placeLeader = (page) => page.leader ?? leaders(page);

const placeRows = (pages) => pages.map((page) => [
  page.file.link,
  formatType(page.type),
  placeDetail(page),
  placeLeader(page)
]);

const peoplePowerDescription = (page) => {
  if (page.type === "character") return page.role ?? page.descriptor;
  if (page.type === "organization") return page.subtype ?? page.members;
  if (isLocation(page)) return page.location ?? page.parent ?? page.subtype ?? page.government;
  return page.location ?? page.parent;
};

const peoplePowerKeyFigure = (page) => {
  if (page.type === "organization") return leaders(page);
  if (isLocation(page)) return page.leader ?? leaders(page);
  return "";
};

const peoplePowerRows = (pages) => pages.map((page) => [
  page.file.link,
  formatType(page.type),
  peoplePowerDescription(page),
  peoplePowerKeyFigure(page)
]);

const locatedPeopleAndPowers = () => dv.pages()
  .where((page) =>
    isRealPage(page) &&
    notCurrent(page) &&
    ["character", "organization"].includes(page.type) &&
    inCurrentLocation(page)
  )
  .sort((page) => page.file.name, "asc");

const affiliatedPeopleAndPowers = () => dv.pages()
  .where((page) => {
    if (!isRealPage(page) || notCurrent(page) === false) return false;
    if (!["character", "organization"].includes(page.type)) return false;

    return containsLinkOrName(current.affiliations, page.file.link, page.file.name) ||
      containsLinkOrName(page.affiliations, current.file.link, current.file.name);
  })
  .sort((page) => page.file.name, "asc");

const participantPeopleAndPowers = () => dv.pages()
  .where((page) =>
    isRealPage(page) &&
    notCurrent(page) &&
    (["character", "organization"].includes(page.type) || isLocation(page)) &&
    pageMatchesValue(page, current.participants)
  )
  .sort((page) => page.file.name, "asc");

const groupPresets = {
  places() {
    return {
      title: "Places",
      headers: ["Place", "Type", "Description", "Notable Figure(s)"],
      rows: placeRows(childPlaces())
    };
  },

  peopleAndPowers({ title = "People & Powers", mode = "located" } = {}) {
    const sources = {
      located: locatedPeopleAndPowers,
      affiliations: affiliatedPeopleAndPowers,
      participants: participantPeopleAndPowers
    };

    return {
      title,
      headers: ["Name", "Type", "Description", "Notable Figure(s)"],
      rows: peoplePowerRows(sources[mode]())
    };
  },

  events({ mode = "location" } = {}) {
    return {
      title: "Events",
      headers: mode === "participant" ? ["Event", "Date", "Location"] : ["Event", "Date", "Participants"],
      rows: mode === "participant"
        ? eventRows(eventsWithCurrentParticipant())
        : eventsAtCurrent().map((page) => [page.file.link, pf.formatTimelineDate(page["aat-event-start-date"]), page.participants])
    };
  }
};

const renderers = {
  async allCharacters() {
    const pages = pagesOfType("character");

    dv.table(
      ["Character", "Descriptor", "Gender", "Ancestry", "Role", "Level"],
      characterRows(pages)
    );
  },

  async allOrganizations() {
    const pages = pagesOfType("organization");

    dv.table(
      ["Organization", "Leaders", "Location"],
      organizationRows(pages)
    );
  },

  async locationNavigation() {
    await renderGroups([
      groupPresets.places(),
      groupPresets.peopleAndPowers(),
      groupPresets.events()
    ]);
  },

  async siteNavigation() {
    await renderGroups([
      groupPresets.peopleAndPowers(),
      groupPresets.events()
    ]);
  },

  async characterNavigation() {
    await renderGroups([
      groupPresets.peopleAndPowers({ title: "Affiliations", mode: "affiliations" }),
      groupPresets.events({ mode: "participant" })
    ]);
  },

  async organizationNavigation() {
    await renderGroups([
      groupPresets.peopleAndPowers({ title: "Affiliations", mode: "affiliations" }),
      groupPresets.events({ mode: "participant" })
    ]);
  },

  async itemMentions() {
    const pages = dv.pages()
      .where((page) => {
        const mentionType = ["character", "organization", "event"].includes(page.type) || isLocation(page);
        return isRealPage(page) && notCurrent(page) && mentionType;
      })
      .where((page) => linksToCurrent(page) || sourcesCurrent(page))
      .sort((page) => page.file.name, "asc");

    await renderGroups([
      {
        title: "Mentions",
        headers: ["Note", "Type", "Context"],
        rows: pages.map((page) => [page.file.link, formatType(page.type), page.location ?? page.parent])
      }
    ]);
  },

  async eventNavigation() {
    await renderGroups([
      groupPresets.peopleAndPowers({ title: "Participants", mode: "participants" })
    ]);
  },

  async sourceLinkedNotes() {
    const pages = dv.pages()
      .where((page) => isRealPage(page) && notCurrent(page) && sourcesCurrent(page))
      .sort((page) => page.file.name, "asc");

    const types = [...new Set(pages.array().map((page) => pageType(page)))].sort();
    await renderGroups(types.map((type) => ({
      title: `${formatType(type)} Notes`,
      headers: ["Note", "Type"],
      rows: pages
        .where((page) => pageType(page) === type)
        .map((page) => [page.file.link, formatType(page.type)])
    })));
  }
};

if (!renderers[table]) {
  dv.paragraph(`_Unknown table: ${table ?? "missing"}_`);
} else {
  await renderers[table]();
}
