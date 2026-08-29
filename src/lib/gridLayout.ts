export interface GridLayout {
  perRow: number;
  rows: number;
  height: number;
}

/** Wraps `count` same-size icons into as many rows as fit `innerWidth`. */
export function layoutGrid(
  count: number,
  innerWidth: number,
  iconSize: number,
  gap: number,
): GridLayout {
  if (count <= 0) return { perRow: 0, rows: 0, height: 0 };
  const perRow = Math.max(1, Math.floor((innerWidth + gap) / (iconSize + gap)));
  const rows = Math.ceil(count / perRow);
  const height = rows * (iconSize + gap) - gap;
  return { perRow, rows, height };
}
