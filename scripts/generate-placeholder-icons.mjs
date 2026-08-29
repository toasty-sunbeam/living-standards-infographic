#!/usr/bin/env node
// Regenerates the "still-to-be-determined" living-standards placeholder icons
// in src/icons/standards/. Safe to re-run: it only writes files that don't
// already carry a `data-placeholder="true"` marker attribute, so real
// artwork dropped in to replace a placeholder is never overwritten.
//
// Usage: node scripts/generate-placeholder-icons.mjs [--force]

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "..", "src", "icons", "standards");
mkdirSync(outDir, { recursive: true });

const rowsSrc = readFileSync(
  path.join(here, "..", "src", "data", "standardsRows.ts"),
  "utf8",
);
const rowIds = [...rowsSrc.matchAll(/id:\s*"([a-z]+)"/g)].map((m) => m[1]);
const blankData = new Map();
for (const m of rowsSrc.matchAll(/id:\s*"([a-z]+)"[\s\S]*?(?=\n  \{|\n\];)/g)) {
  const block = m[0];
  const id = block.match(/id:\s*"([a-z]+)"/)[1];
  const blankMatch = block.match(/blankLevels:\s*\[([\d,\s]*)\]/);
  blankData.set(
    id,
    blankMatch ? blankMatch[1].split(",").map((s) => Number(s.trim())) : [],
  );
}

const force = process.argv.includes("--force");
let written = 0;
let skipped = 0;

for (const rowId of rowIds) {
  const blanks = blankData.get(rowId) ?? [];
  for (let level = 1; level <= 4; level++) {
    if (blanks.includes(level)) continue; // intentionally no icon
    const file = path.join(outDir, `${rowId}-${level}.svg`);
    if (existsSync(file) && !force) {
      const existing = readFileSync(file, "utf8");
      if (!existing.includes('data-placeholder="true"')) {
        skipped++;
        continue; // real artwork now lives here — don't clobber it
      }
    }
    writeFileSync(file, placeholderSvg(rowId, level));
    written++;
  }
}

console.log(`placeholder icons: wrote ${written}, left ${skipped} real icon(s) in place`);

function placeholderSvg(rowId, level) {
  const dots = Array.from({ length: 4 }, (_, i) => {
    const x = 7 + i * 3.4;
    const filled = i < level;
    return `<circle cx="${x}" cy="19.5" r="1.15" ${filled ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="0.8"'}/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-placeholder="true" data-row="${rowId}" data-level="${level}">
  <!-- placeholder: replace this file with real ${rowId} L${level} artwork -->
  <rect x="2.5" y="2.5" width="19" height="14.5" rx="2" stroke-width="1.4" stroke-dasharray="2.4 2"/>
  <path d="M7 12.5l3-3.2 2.6 2.6L17 7.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="17" cy="7.5" r="1" fill="currentColor" stroke="none"/>
  ${dots}
</svg>
`;
}
