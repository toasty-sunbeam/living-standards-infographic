// Population figures sourced from the "abundance-data" package:
// data/10_levels_living_and_dead.csv (== data/bundle.json -> levels_living_and_dead).
// Income boundaries & level descriptions from data/07_rosling_income_levels.csv
// and reference/four-levels.html (Rosling's Factfulness levels, 2026 reconstruction).
//
// "alive" = alive today at this level. "died" = died while living at this level
// (NOT the same population as "born into" this level — see abundance-data/CLAUDE.md
// semantic trap #1). One dot/icon in the source CSV = 100 million people; that is
// also this app's default people-per-icon scale.

export interface LevelPopulation {
  level: 1 | 2 | 3 | 4;
  label: string;
  incomeRange: string;
  aliveBillions: number;
  diedBillions: number;
  /** count of icons at the source scale of 1 icon = 100,000,000 people */
  dotsAlive: number;
  dotsDied: number;
}

export const PEOPLE_PER_ICON_DEFAULT = 100_000_000;

export const LEVELS: LevelPopulation[] = [
  {
    level: 1,
    label: "Level 1",
    incomeRange: "< $2/day",
    aliveBillions: 1.0,
    diedBillions: 101.07,
    dotsAlive: 10,
    dotsDied: 1011,
  },
  {
    level: 2,
    label: "Level 2",
    incomeRange: "$2 – 8/day",
    aliveBillions: 3.8,
    diedBillions: 6.15,
    dotsAlive: 38,
    dotsDied: 61,
  },
  {
    level: 3,
    label: "Level 3",
    incomeRange: "$8 – 32/day",
    aliveBillions: 2.3,
    diedBillions: 1.66,
    dotsAlive: 23,
    dotsDied: 17,
  },
  {
    level: 4,
    label: "Level 4",
    incomeRange: "> $32/day",
    aliveBillions: 1.1,
    diedBillions: 0.53,
    dotsAlive: 11,
    dotsDied: 5,
  },
];

export const META = {
  title: "The Four Levels",
  subtitle:
    "How today's 8.2 billion people live, and how the roughly 109 billion who came before them died — sorted by the same four levels of material living standards.",
  sourceNote:
    "Population: Gapminder / abundance-data 2026 reconstruction. Levels: Rosling, Rosling & Rönnlund, Factfulness (2018) & Gapminder Dollar Street. “Died while at this level” uses country-year death data × lognormal level shares 1800–2026 plus pre-1800 deaths (~all Level 1); the Level 4 figure is uncertain by roughly ±50%.",
};
