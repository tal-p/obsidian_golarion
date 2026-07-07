const PathfinderViews = {
  golarionMonths: [
    "Abadius",
    "Calistril",
    "Pharast",
    "Gozran",
    "Desnus",
    "Sarenith",
    "Erastus",
    "Arodus",
    "Rova",
    "Lamashan",
    "Neth",
    "Kuthona"
  ],

  hasValue(value) {
    return value !== null && value !== undefined && value !== "";
  },

  formatTimelineDate(value) {
    if (!this.hasValue(value)) return "";

    const match = String(value).trim().replace(/^["']|["']$/g, "").match(/^(-?\d+)-(\d{1,2})-(\d{1,2})$/);
    if (!match) return value;

    const [, year, monthText, dayText] = match;
    const month = Number(monthText);
    const day = Number(dayText);
    const monthName = this.golarionMonths[month - 1];

    if (!month) return `${year} AR`;
    if (!monthName) return value;
    if (!day) return `${monthName} ${year} AR`;

    return `${day} ${monthName} ${year} AR`;
  }
};
