// Row definitions for the living-standards matrix.
// Rows + per-level captions follow abundance-data/design/thesis-and-icons.md
// ("Icon Matrix") and abundance-data/design/icon-sourcing.md (resolved slug set,
// Pinhead Map Icons / CC0 — not yet vendored here, see src/icons/standards/README.md).
//
// Actual artwork is still being designed, so every cell currently points at a
// placeholder icon file named `${row.id}-${level}.svg` in src/icons/standards/.
// Swap in real artwork by overwriting those files in place — nothing else
// needs to change.

export interface StandardsRow {
  id: string;
  label: string;
  /** caption for levels 1-4, in order */
  captions: [string, string, string, string];
  /**
   * Levels that should render with no icon at all. Currently only
   * Data/Level 1: "nothing" is the datum, per thesis-and-icons.md.
   */
  blankLevels?: number[];
}

export const STANDARDS_ROWS: StandardsRow[] = [
  {
    id: "water",
    label: "Water",
    captions: [
      "hours on foot, from a mud hole or well",
      "a communal pump nearby",
      "a cold tap at home",
      "hot & cold, on demand",
    ],
  },
  {
    id: "cooking",
    label: "Cooking",
    captions: ["an open fire", "a gas canister", "a stove", "an oven & range"],
  },
  {
    id: "eating",
    label: "Eating",
    captions: [
      "the same porridge, daily",
      "vegetables & eggs",
      "meat & cold drinks",
      "fast food, any time",
    ],
  },
  {
    id: "sleeping",
    label: "Sleeping",
    captions: ["a mat on the floor", "a mattress", "a bed", "a bedroom"],
  },
  {
    id: "transportation",
    label: "Transportation",
    captions: ["your feet", "a bicycle", "a motorcycle", "a car"],
  },
  {
    id: "light",
    label: "Light",
    captions: ["a candle", "a lantern", "a lightbulb", "a desk lamp"],
  },
  {
    id: "data",
    label: "Data",
    captions: ["nothing", "a feature phone", "a smartphone", "phone & laptop"],
    blankLevels: [1],
  },
];
