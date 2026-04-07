import React from 'react';
import { CASE_OPTIONS } from '../utils/renameLogic';

export default function OptionsPanel({ mode, options, opt }) {
  const field = (label, content) => (
    <div className="option-field">
      <span className="option-label">{label}</span>
      {content}
    </div>
  );

  const checkbox = (label, key) => (
    <label className="checkbox-label">
      <input 
        type="checkbox" 
        checked={options[key]} 
        onChange={e => opt(key, e.target.checked)} 
        className="checkbox-input"
      />
      {label}
    </label>
  );

  if (mode === "replace") return (
    <>
      {field("Cari", <input className="input-field" value={options.find} onChange={e => opt("find", e.target.value)} placeholder="teks yang dicari..." />)}
      {field("Ganti dengan", <input className="input-field" value={options.replace} onChange={e => opt("replace", e.target.value)} placeholder="(kosong = hapus)" />)}
      {checkbox("Case sensitive", "caseSensitive")}
      {checkbox("Gunakan Regex", "useRegex")}
    </>
  );

  if (mode === "prefix") return (
    field("Prefix", <input className="input-field" value={options.prefix} onChange={e => opt("prefix", e.target.value)} placeholder="contoh: 2024_" />)
  );

  if (mode === "suffix") return (
    field("Suffix", <input className="input-field" value={options.suffix} onChange={e => opt("suffix", e.target.value)} placeholder="contoh: _final" />)
  );

  if (mode === "numbering") return (
    <>
      {field("Mulai dari", <input type="number" className="input-field" value={options.start} onChange={e => opt("start", e.target.value)} />)}
      {field("Padding (digit)", <input type="number" className="input-field" value={options.padding} onChange={e => opt("padding", e.target.value)} min={1} max={6} />)}
      {field("Separator", <input className="input-field" value={options.separator} onChange={e => opt("separator", e.target.value)} placeholder="_" />)}
      {field("Posisi", (
        <div className="position-switcher">
          {["prefix", "suffix"].map(p => (
            <button 
              key={p} 
              onClick={() => opt("position", p)} 
              className={`position-btn ${options.position === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      ))}
    </>
  );

  if (mode === "case") return (
    <div className="case-options-list">
      {CASE_OPTIONS.map(c => (
        <button 
          key={c.id} 
          onClick={() => opt("caseType", c.id)} 
          className={`case-btn ${options.caseType === c.id ? 'active' : ''}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );

  if (mode === "trim") return (
    <>
      {checkbox("Hapus/ganti spasi", "trimSpaces")}
      {options.trimSpaces && field("Ganti spasi dengan", <input className="input-field" value={options.spaceReplace} onChange={e => opt("spaceReplace", e.target.value)} placeholder="_ atau kosong" />)}
      {checkbox("Hapus karakter spesial", "trimSpecial")}
      {checkbox("Hapus titik (kecuali ekstensi)", "trimDots")}
    </>
  );

  return null;
}
