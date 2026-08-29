export interface InfographicColors {
  paper: string;
  paperLine: string;
  card: string;
  ink: string;
  inkSoft: string;
  accent: string;
  alive: string;
  dead: string;
  level: [string, string, string, string];
}

export interface InfographicSettings {
  title: string;
  subtitle: string;
  sourceNote: string;
  /** how many real people one icon in the population pictogram stands for, in millions */
  peoplePerIconMillions: number;
  popIconSize: number;
  popIconGap: number;
  stdIconSize: number;
  showCaptions: boolean;
  visibleRowIds: string[];
  colors: InfographicColors;
}
