# Living-standards icons (placeholder)

Every file here is a stand-in — a dashed box + a level-progress dial — for a
`{row}-{level}.svg` icon that hasn't been drawn yet. See
`abundance-data/design/icon-sourcing.md` (in the original data package) for
the resolved icon set (Pinhead Map Icons, CC0) and exact slugs to use once
real artwork is ready.

## Swapping in real icons

Replace a file in place, same name, same `viewBox="0 0 24 24"`. Nothing else
needs to change — the app loads every `*.svg` in this folder automatically
(`src/icons/loadIcons.ts`) and re-renders on save.

- `data-1` has no file. It's intentionally blank ("nothing" is the datum for
  Data at Level 1) — don't add one; see `blankLevels` in
  `src/data/standardsRows.ts`.
- Icons should be a single-color silhouette using `fill="currentColor"` (or
  `stroke="currentColor"` for line icons) so the app's color controls apply.
- Run `node scripts/generate-placeholder-icons.mjs` to regenerate any missing
  placeholders — it never overwrites a file that isn't itself a placeholder.
