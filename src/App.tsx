import { useRef, useState } from "react";
import ControlsPanel from "./components/ControlsPanel";
import InfographicSvg from "./components/InfographicSvg";
import { DEFAULT_SETTINGS } from "./data/defaultSettings";
import { LEVELS } from "./data/levels";
import { STANDARDS_ROWS } from "./data/standardsRows";
import { downloadSvg } from "./lib/exportSvg";
import type { InfographicSettings } from "./types";

function totalIconCount(settings: InfographicSettings): number {
  const peoplePerIcon = Math.max(1, settings.peoplePerIconMillions) * 1_000_000;
  const popIcons = LEVELS.reduce((sum, lvl) => {
    const alive = Math.round((lvl.aliveBillions * 1e9) / peoplePerIcon);
    const dead = Math.round((lvl.diedBillions * 1e9) / peoplePerIcon);
    return sum + alive + dead;
  }, 0);
  const visibleRows = STANDARDS_ROWS.filter((r) => settings.visibleRowIds.includes(r.id));
  const stdIcons = visibleRows.reduce((sum, row) => sum + 4 - (row.blankLevels?.length ?? 0), 0);
  return popIcons + stdIcons;
}

export default function App() {
  const [settings, setSettings] = useState<InfographicSettings>(DEFAULT_SETTINGS);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const patch = (p: Partial<InfographicSettings>) => setSettings((s) => ({ ...s, ...p }));

  const handleExport = () => {
    if (!svgRef.current) return;
    downloadSvg(svgRef.current, "living-standards-infographic.svg");
  };

  return (
    <div className="app">
      <ControlsPanel
        settings={settings}
        onChange={patch}
        onExport={handleExport}
        onReset={() => setSettings(DEFAULT_SETTINGS)}
        totalIcons={totalIconCount(settings)}
      />
      <main className="preview">
        <div className="preview-scroll">
          <InfographicSvg ref={svgRef} settings={settings} />
        </div>
      </main>
    </div>
  );
}
