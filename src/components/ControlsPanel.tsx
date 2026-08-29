import type { ChangeEvent } from "react";
import { STANDARDS_ROWS } from "../data/standardsRows";
import type { InfographicSettings } from "../types";

interface Props {
  settings: InfographicSettings;
  onChange: (patch: Partial<InfographicSettings>) => void;
  onExport: () => void;
  onReset: () => void;
  totalIcons: number;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export default function ControlsPanel({ settings, onChange, onExport, onReset, totalIcons }: Props) {
  const setColor = (key: keyof InfographicSettings["colors"]) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ colors: { ...settings.colors, [key]: e.target.value } });

  const toggleRow = (id: string) => {
    const has = settings.visibleRowIds.includes(id);
    onChange({
      visibleRowIds: has
        ? settings.visibleRowIds.filter((r) => r !== id)
        : [...settings.visibleRowIds, id],
    });
  };

  return (
    <aside className="panel">
      <h1 className="panel-title">Infographic Builder</h1>
      <p className="panel-hint">
        Living-standards icons are placeholders — swap files in{" "}
        <code>src/icons/standards/</code> to update artwork, no code changes needed.
      </p>

      <button className="btn btn-primary" onClick={onExport}>
        Export SVG
      </button>
      <div className="icon-count">{totalIcons.toLocaleString()} icons in this render</div>

      <section>
        <h2>Text</h2>
        <Field label="Title">
          <input value={settings.title} onChange={(e) => onChange({ title: e.target.value })} />
        </Field>
        <Field label="Subtitle">
          <textarea
            rows={3}
            value={settings.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
          />
        </Field>
        <Field label="Source note">
          <textarea
            rows={3}
            value={settings.sourceNote}
            onChange={(e) => onChange({ sourceNote: e.target.value })}
          />
        </Field>
      </section>

      <section>
        <h2>Population pictogram</h2>
        <Field label={`People per icon: ${settings.peoplePerIconMillions}M`}>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={settings.peoplePerIconMillions}
            onChange={(e) => onChange({ peoplePerIconMillions: Number(e.target.value) })}
          />
        </Field>
        <Field label={`Icon size: ${settings.popIconSize}px`}>
          <input
            type="range"
            min={3}
            max={14}
            step={0.5}
            value={settings.popIconSize}
            onChange={(e) => onChange({ popIconSize: Number(e.target.value) })}
          />
        </Field>
        <Field label={`Icon gap: ${settings.popIconGap}px`}>
          <input
            type="range"
            min={0}
            max={4}
            step={0.5}
            value={settings.popIconGap}
            onChange={(e) => onChange({ popIconGap: Number(e.target.value) })}
          />
        </Field>
      </section>

      <section>
        <h2>Living-standards matrix</h2>
        <Field label={`Icon size: ${settings.stdIconSize}px`}>
          <input
            type="range"
            min={16}
            max={44}
            step={1}
            value={settings.stdIconSize}
            onChange={(e) => onChange({ stdIconSize: Number(e.target.value) })}
          />
        </Field>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={settings.showCaptions}
            onChange={(e) => onChange({ showCaptions: e.target.checked })}
          />
          Show captions
        </label>
        <div className="row-toggles">
          {STANDARDS_ROWS.map((row) => (
            <label key={row.id} className="checkbox">
              <input
                type="checkbox"
                checked={settings.visibleRowIds.includes(row.id)}
                onChange={() => toggleRow(row.id)}
              />
              {row.label}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2>Colors</h2>
        <div className="color-grid">
          <Field label="Paper">
            <input type="color" value={settings.colors.paper} onChange={setColor("paper")} />
          </Field>
          <Field label="Card">
            <input type="color" value={settings.colors.card} onChange={setColor("card")} />
          </Field>
          <Field label="Ink">
            <input type="color" value={settings.colors.ink} onChange={setColor("ink")} />
          </Field>
          <Field label="Ink (soft)">
            <input type="color" value={settings.colors.inkSoft} onChange={setColor("inkSoft")} />
          </Field>
          <Field label="Alive">
            <input type="color" value={settings.colors.alive} onChange={setColor("alive")} />
          </Field>
          <Field label="Dead">
            <input type="color" value={settings.colors.dead} onChange={setColor("dead")} />
          </Field>
        </div>
      </section>

      <button className="btn" onClick={onReset}>
        Reset to defaults
      </button>
    </aside>
  );
}
