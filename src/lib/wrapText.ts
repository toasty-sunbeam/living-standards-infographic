/**
 * Rough word-wrap for SVG <text>, which has no native wrapping. Estimates
 * character width as a fraction of font size rather than measuring glyphs,
 * so it's approximate — generous enough that lines don't overflow their box
 * for the sans/mono stacks this app uses, at the cost of sometimes wrapping
 * a little earlier than strictly necessary.
 */
export function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number,
  charWidthFactor = 0.56,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const maxChars = Math.max(1, Math.floor(maxWidth / (fontSize * charWidthFactor)));
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}
