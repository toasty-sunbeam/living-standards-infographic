import { forwardRef } from "react";
import { LEVELS } from "../data/levels";
import { STANDARDS_ROWS } from "../data/standardsRows";
import { PEOPLE_ICONS, STANDARDS_ICONS, standardsIconKey, type ParsedIcon } from "../icons/loadIcons";
import { layoutGrid } from "../lib/gridLayout";
import { wrapText } from "../lib/wrapText";
import type { InfographicSettings } from "../types";

const PAD = 40;
const CONTENT_W = 1000;
const LABEL_W = 150;
const COL_W = (CONTENT_W - LABEL_W) / 4;
const CANVAS_W = CONTENT_W + PAD * 2;

const HEADER_PAD_X = 26;
const HEADER_PAD_Y = 22;
const GAP_SECTION = 24;

const COLHEAD_H = 60;
const POP_CELL_PAD = 10;
const POP_LABEL_LINE_H = 18;
const NOTE_ROW_H = 30;
const STD_ROW_H = 78;
const STD_ICON_PAD_TOP = 10;

const SANS = "'Libre Franklin','Segoe UI',sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Consolas,monospace";

function fmtBillions(b: number): string {
  if (b >= 10) return `${b.toFixed(0)}B`;
  return `${b.toFixed(2).replace(/0$/, "")}B`;
}

interface Props {
  settings: InfographicSettings;
}

const InfographicSvg = forwardRef<SVGSVGElement, Props>(function InfographicSvg(
  { settings },
  ref,
) {
  const { colors } = settings;
  const peoplePerIcon = Math.max(1, settings.peoplePerIconMillions) * 1_000_000;
  const popIconSize = settings.popIconSize;
  const popIconGap = settings.popIconGap;
  const popIconStep = popIconSize + popIconGap;

  const visibleRows = STANDARDS_ROWS.filter((r) => settings.visibleRowIds.includes(r.id));

  const popCounts = LEVELS.map((lvl) => ({
    level: lvl.level,
    alive: Math.max(0, Math.round((lvl.aliveBillions * 1e9) / peoplePerIcon)),
    dead: Math.max(0, Math.round((lvl.diedBillions * 1e9) / peoplePerIcon)),
  }));

  const colInnerW = COL_W - POP_CELL_PAD * 2;
  const aliveLayouts = popCounts.map((c) => layoutGrid(c.alive, colInnerW, popIconSize, popIconGap));
  const deadLayouts = popCounts.map((c) => layoutGrid(c.dead, colInnerW, popIconSize, popIconGap));

  const aliveRowH =
    Math.max(...aliveLayouts.map((l) => l.height), popIconSize) + POP_CELL_PAD * 2 + POP_LABEL_LINE_H;
  const deadRowH =
    Math.max(...deadLayouts.map((l) => l.height), popIconSize) + POP_CELL_PAD * 2 + POP_LABEL_LINE_H;

  // ---- header block ----
  const subtitleLines = wrapText(settings.subtitle, CONTENT_W - HEADER_PAD_X * 2 - 12, 15, 0.64);
  const headerContentH = 16 + 8 + 44 + 8 + subtitleLines.length * 21;
  const headerBoxH = HEADER_PAD_Y * 2 + headerContentH;
  const headerY = PAD;
  const headerBottom = headerY + headerBoxH;

  // ---- table geometry ----
  const tableX = PAD;
  const tableY = headerBottom + GAP_SECTION;
  const colHeadY = tableY;
  const aliveRowY = colHeadY + COLHEAD_H;
  const deadRowY = aliveRowY + aliveRowH;
  const noteRowY = deadRowY + deadRowH;
  const stdRowsY = noteRowY + NOTE_ROW_H;
  const stdRowsH = visibleRows.length * STD_ROW_H;
  const tableBottomY = stdRowsY + stdRowsH;
  const tableH = tableBottomY - tableY;

  const colX = (i: number) => tableX + LABEL_W + i * COL_W;

  // ---- footer ----
  const footerY = tableBottomY + GAP_SECTION;
  const sourceLines = wrapText(settings.sourceNote, CONTENT_W - 12, 12, 0.64);
  const generatedLabel = `Generated ${new Date().toISOString().slice(0, 10)} · 1 icon ≈ ${settings.peoplePerIconMillions}M people`;
  const footerH = 20 + sourceLines.length * 15.5 + 10 + 16;

  const CANVAS_H = footerY + footerH + PAD;

  // ---- icon symbols actually needed ----
  const symbols: { id: string; icon: ParsedIcon }[] = [];
  if (PEOPLE_ICONS.alive) symbols.push({ id: "sym-alive", icon: PEOPLE_ICONS.alive });
  if (PEOPLE_ICONS.dead) symbols.push({ id: "sym-dead", icon: PEOPLE_ICONS.dead });
  for (const row of visibleRows) {
    for (let level = 1; level <= 4; level++) {
      if (row.blankLevels?.includes(level)) continue;
      const key = standardsIconKey(row.id, level);
      const icon = STANDARDS_ICONS[key];
      if (icon) symbols.push({ id: `sym-${key}`, icon });
    }
  }

  function renderIconGrid(count: number, layout: { perRow: number }, top: number, left: number, useId: string, color: string) {
    if (count <= 0) return null;
    const uses = [];
    for (let j = 0; j < count; j++) {
      const col = j % layout.perRow;
      const rowIdx = Math.floor(j / layout.perRow);
      const x = left + col * popIconStep;
      const y = top + rowIdx * popIconStep;
      uses.push(
        <use key={j} href={`#${useId}`} xlinkHref={`#${useId}`} x={x} y={y} width={popIconSize} height={popIconSize} />,
      );
    }
    return <g color={color}>{uses}</g>;
  }

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ fontFamily: SANS }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`}</style>

      <defs>
        {symbols.map((s) => (
          <symbol
            key={s.id}
            id={s.id}
            viewBox={s.icon.viewBox}
            {...s.icon.rootAttrs}
            dangerouslySetInnerHTML={{ __html: s.icon.inner }}
          />
        ))}
      </defs>

      <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill={colors.paper} />

      {/* ---------------- header ---------------- */}
      <rect x={PAD} y={headerY} width={CONTENT_W} height={headerBoxH} fill={colors.card} stroke={colors.ink} strokeWidth={2} />
      <text x={PAD + CONTENT_W - 14} y={headerY + 18} textAnchor="end" fontFamily={MONO} fontSize={10.5} letterSpacing="0.08em" fill={colors.inkSoft}>
        FORM 117-L
      </text>
      <text
        x={PAD + HEADER_PAD_X}
        y={headerY + HEADER_PAD_Y + 12}
        fontFamily={SANS}
        fontWeight={600}
        fontSize={12}
        letterSpacing="0.28em"
        fill={colors.inkSoft}
      >
        BUREAU OF ALL HUMANITY &mdash; STANDARDS OF LIVING DIVISION
      </text>
      <text
        x={PAD + HEADER_PAD_X}
        y={headerY + HEADER_PAD_Y + 12 + 44}
        fontFamily={SANS}
        fontWeight={900}
        fontSize={38}
        letterSpacing="-0.01em"
        fill={colors.ink}
      >
        {settings.title}
      </text>
      {subtitleLines.map((line, i) => (
        <text
          key={i}
          x={PAD + HEADER_PAD_X}
          y={headerY + HEADER_PAD_Y + 12 + 44 + 26 + i * 21}
          fontFamily={MONO}
          fontSize={14.5}
          fill={colors.inkSoft}
        >
          {line}
        </text>
      ))}

      {/* ---------------- population + standards table ---------------- */}
      <rect x={tableX} y={tableY} width={CONTENT_W} height={tableH} fill={colors.card} stroke={colors.ink} strokeWidth={2} />

      {/* vertical dividers */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={tableX + LABEL_W + i * COL_W}
          y1={tableY}
          x2={tableX + LABEL_W + i * COL_W}
          y2={tableBottomY}
          stroke={colors.paperLine}
          strokeWidth={1}
        />
      ))}

      {/* column headers */}
      <line x1={tableX} y1={colHeadY + COLHEAD_H} x2={tableX + CONTENT_W} y2={colHeadY + COLHEAD_H} stroke={colors.ink} strokeWidth={2} />
      {LEVELS.map((lvl, i) => (
        <g key={lvl.level}>
          <text x={colX(i) + COL_W / 2} y={colHeadY + 24} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={15} letterSpacing="0.12em" fill={colors.ink}>
            LEVEL {lvl.level}
          </text>
          <text x={colX(i) + COL_W / 2} y={colHeadY + 41} textAnchor="middle" fontFamily={MONO} fontSize={12} fill={colors.inkSoft}>
            {lvl.incomeRange}
          </text>
          <rect x={colX(i) + COL_W / 2 - 16} y={colHeadY + 50} width={32} height={3} fill={colors.level[i]} />
        </g>
      ))}

      {/* alive row */}
      <line x1={tableX} y1={deadRowY} x2={tableX + CONTENT_W} y2={deadRowY} stroke={colors.paperLine} strokeWidth={1} />
      <text x={tableX + 14} y={aliveRowY + aliveRowH / 2 - 4} fontFamily={SANS} fontWeight={600} fontSize={10.5} letterSpacing="0.14em" fill={colors.inkSoft}>
        ALIVE
      </text>
      <text x={tableX + 14} y={aliveRowY + aliveRowH / 2 + 12} fontFamily={SANS} fontWeight={600} fontSize={10.5} letterSpacing="0.14em" fill={colors.inkSoft}>
        TODAY
      </text>
      {LEVELS.map((lvl, i) => {
        const left = colX(i) + POP_CELL_PAD;
        const top = aliveRowY + POP_CELL_PAD + POP_LABEL_LINE_H;
        return (
          <g key={lvl.level}>
            <text x={left} y={aliveRowY + POP_CELL_PAD + 11} fontFamily={MONO} fontWeight={600} fontSize={13} fill={colors.ink}>
              {fmtBillions(lvl.aliveBillions)}
            </text>
            {renderIconGrid(popCounts[i].alive, aliveLayouts[i], top, left, "sym-alive", colors.alive)}
          </g>
        );
      })}

      {/* dead row */}
      <line x1={tableX} y1={noteRowY} x2={tableX + CONTENT_W} y2={noteRowY} stroke={colors.paperLine} strokeWidth={1} />
      <text x={tableX + 14} y={deadRowY + deadRowH / 2 - 4} fontFamily={SANS} fontWeight={600} fontSize={10.5} letterSpacing="0.14em" fill={colors.inkSoft}>
        DIED AT
      </text>
      <text x={tableX + 14} y={deadRowY + deadRowH / 2 + 12} fontFamily={SANS} fontWeight={600} fontSize={10.5} letterSpacing="0.14em" fill={colors.inkSoft}>
        THIS LEVEL
      </text>
      {LEVELS.map((lvl, i) => {
        const left = colX(i) + POP_CELL_PAD;
        const top = deadRowY + POP_CELL_PAD + POP_LABEL_LINE_H;
        return (
          <g key={lvl.level}>
            <text x={left} y={deadRowY + POP_CELL_PAD + 11} fontFamily={MONO} fontWeight={600} fontSize={13} fill={colors.inkSoft}>
              {fmtBillions(lvl.diedBillions)}
            </text>
            {renderIconGrid(popCounts[i].dead, deadLayouts[i], top, left, "sym-dead", colors.dead)}
          </g>
        );
      })}

      {/* note row */}
      <text x={tableX + 14} y={noteRowY + NOTE_ROW_H / 2 + 4} fontFamily={MONO} fontSize={11} fill={colors.inkSoft}>
        1 icon &#8776; {settings.peoplePerIconMillions}M people &nbsp;&middot;&nbsp; ink = alive today &nbsp;&middot;&nbsp; grey = died at that level
      </text>

      {/* standards matrix */}
      <line x1={tableX} y1={stdRowsY} x2={tableX + CONTENT_W} y2={stdRowsY} stroke={colors.ink} strokeWidth={1.5} />
      {visibleRows.map((row, ri) => {
        const rowY = stdRowsY + ri * STD_ROW_H;
        return (
          <g key={row.id}>
            {ri > 0 && (
              <line x1={tableX} y1={rowY} x2={tableX + CONTENT_W} y2={rowY} stroke={colors.paperLine} strokeWidth={1} />
            )}
            <text
              x={tableX + 14}
              y={rowY + STD_ROW_H / 2 + 4}
              fontFamily={SANS}
              fontWeight={600}
              fontSize={10.5}
              letterSpacing="0.14em"
              fill={colors.inkSoft}
            >
              {row.label.toUpperCase()}
            </text>
            {[0, 1, 2, 3].map((i) => {
              const level = i + 1;
              const cx = colX(i) + COL_W / 2;
              const blank = row.blankLevels?.includes(level);
              const icon = blank ? undefined : STANDARDS_ICONS[standardsIconKey(row.id, level)];
              const captionLines = settings.showCaptions
                ? wrapText(row.captions[i], COL_W - 16, 10.5, 0.62)
                : [];
              const iconY = rowY + STD_ICON_PAD_TOP;
              const captionTop = iconY + settings.stdIconSize + 13;
              return (
                <g key={level}>
                  {icon && (
                    <g color={colors.ink}>
                      <use
                        href={`#sym-${row.id}-${level}`}
                        xlinkHref={`#sym-${row.id}-${level}`}
                        x={cx - settings.stdIconSize / 2}
                        y={iconY}
                        width={settings.stdIconSize}
                        height={settings.stdIconSize}
                      />
                    </g>
                  )}
                  {captionLines.map((line, li) => (
                    <text
                      key={li}
                      x={cx}
                      y={captionTop + li * 12.5}
                      textAnchor="middle"
                      fontFamily={MONO}
                      fontStyle={blank ? "italic" : "normal"}
                      fontSize={10.5}
                      fill={colors.inkSoft}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </g>
        );
      })}

      {/* ---------------- footer ---------------- */}
      <line x1={PAD} y1={footerY} x2={PAD + CONTENT_W} y2={footerY} stroke={colors.ink} strokeWidth={2} />
      <text x={PAD} y={footerY + 20} fontFamily={SANS} fontWeight={800} fontSize={11} letterSpacing="0.2em" fill={colors.ink}>
        METHOD &amp; SOURCES
      </text>
      {sourceLines.map((line, i) => (
        <text key={i} x={PAD} y={footerY + 20 + 22 + i * 15.5} fontFamily={MONO} fontSize={11.5} fill={colors.inkSoft}>
          {line}
        </text>
      ))}
      <text
        x={PAD}
        y={footerY + 20 + 22 + sourceLines.length * 15.5 + 14}
        fontFamily={MONO}
        fontSize={11}
        fill={colors.inkSoft}
      >
        {generatedLabel}
      </text>
    </svg>
  );
});

export default InfographicSvg;
