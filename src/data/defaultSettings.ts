import { META } from "./levels";
import { STANDARDS_ROWS } from "./standardsRows";
import type { InfographicSettings } from "../types";

// Ledger-blue paper, indigo ink, carmine accent — the shared design system
// from abundance-data/reference/*.html. Preserved per abundance-data/CLAUDE.md:
// "the deadpan officialdom is doing real work against material that could
// otherwise read as either preachy or grim."
export const DEFAULT_SETTINGS: InfographicSettings = {
  title: META.title,
  subtitle: META.subtitle,
  sourceNote: META.sourceNote,
  peoplePerIconMillions: 100,
  popIconSize: 5,
  popIconGap: 1.5,
  stdIconSize: 26,
  showCaptions: true,
  visibleRowIds: STANDARDS_ROWS.map((r) => r.id),
  colors: {
    paper: "#E9EDF1",
    paperLine: "#D5DCE4",
    card: "#F5F7F9",
    ink: "#1E2A45",
    inkSoft: "#4A5876",
    accent: "#C0392B",
    alive: "#1E2A45",
    dead: "#A7B0C2",
    level: ["#A08C6B", "#7E8A74", "#527690", "#3D5A8A"],
  },
};
