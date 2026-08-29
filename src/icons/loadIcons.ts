// Loads every icon SVG under src/icons/{people,standards}/ at build/dev time
// via Vite's import.meta.glob. Because this globs the *folder*, replacing a
// file's contents (same filename) is picked up automatically by Vite's dev
// server with no code changes — that's the whole swap mechanism.

export interface ParsedIcon {
  id: string;
  viewBox: string;
  /** inner markup of the source <svg>, safe to drop inside a <symbol> */
  inner: string;
  /**
   * Presentation attributes (fill, stroke, stroke-width, ...) set on the
   * source <svg> root. Icon files commonly set these once at the root and
   * let children inherit them via CSS-style cascade; a <symbol> needs them
   * re-applied explicitly, since only its children (not the original root
   * element) get copied in.
   */
  rootAttrs: Record<string, string>;
}

const ROOT_ATTRS_SKIP = new Set(["xmlns", "viewBox", "width", "height", "id"]);

const standardModules = import.meta.glob<string>("./standards/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
});

const peopleModules = import.meta.glob<string>("./people/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
});

function keyFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.svg$/, "");
}

function parseSvg(id: string, raw: string): ParsedIcon {
  const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
  const svg = doc.documentElement;
  const viewBox = svg.getAttribute("viewBox") ?? "0 0 24 24";
  const inner = Array.from(svg.childNodes)
    .filter((n): n is Element => n.nodeType === Node.ELEMENT_NODE)
    .map((el) => el.outerHTML)
    .join("");
  const rootAttrs: Record<string, string> = {};
  for (const attr of Array.from(svg.attributes)) {
    if (attr.name.includes(":") || ROOT_ATTRS_SKIP.has(attr.name)) continue;
    rootAttrs[attr.name] = attr.value;
  }
  return { id, viewBox, inner, rootAttrs };
}

function parseModules(modules: Record<string, string>): Record<string, ParsedIcon> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, raw]) => {
      const key = keyFromPath(path);
      return [key, parseSvg(key, raw)];
    }),
  );
}

export const STANDARDS_ICONS: Record<string, ParsedIcon> = parseModules(standardModules);
export const PEOPLE_ICONS: Record<string, ParsedIcon> = parseModules(peopleModules);

export function standardsIconKey(rowId: string, level: number): string {
  return `${rowId}-${level}`;
}
