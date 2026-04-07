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

  if (mode === "rename_all") return (
    <>
      {field("Nama baru", (
        <input
          className="input-field"
          value={options.newBaseName}
          onChange={e => opt("newBaseName", e.target.value)}
          placeholder="contoh: vacation, foto_wisuda ..."
        />
      ))}

      {/* Toggle numbering */}
      {checkbox("Tambah numbering otomatis", "useNumbering")}

      {/* Opsi numbering — hanya tampil kalau useNumbering = true */}
      {options.useNumbering && (
        <>
          {field("Mulai dari", (
            <input
              type="number"
              className="input-field"
              value={options.numberingStart}
              onChange={e => opt("numberingStart", e.target.value)}
            />
          ))}
          {field("Padding (digit)", (
            <input
              type="number"
              className="input-field"
              value={options.numberingPad}
              onChange={e => opt("numberingPad", e.target.value)}
              min={1} max={6}
            />
          ))}
          {field("Separator", (
            <input
              className="input-field"
              value={options.numberingSep}
              onChange={e => opt("numberingSep", e.target.value)}
              placeholder="_"
            />
          ))}
          {field("Posisi nomor", (
            <div className="position-switcher">
              {["prefix", "suffix"].map(p => (
                <button
                  key={p}
                  onClick={() => opt("numberingPos", p)}
                  className={`position-btn ${options.numberingPos === p ? 'active' : ''}`}
                >
                  {p}
                </button>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Preview live */}
      {options.newBaseName && (
        <div style={{
          marginTop: 8,
          padding: "12px 14px",
          background: "var(--panel-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          fontSize: 13,
          fontFamily: "var(--font-mono)",
          color: "var(--text-main)",
        }}>
          Preview:{" "}
          <strong style={{color: "var(--accent-color)"}}>
            {options.useNumbering
              ? options.numberingPos === "prefix"
                ? `${"1".padStart(parseInt(options.numberingPad) || 3, "0")}${options.numberingSep || "_"}${options.newBaseName}.ext`
                : `${options.newBaseName}${options.numberingSep || "_"}${"1".padStart(parseInt(options.numberingPad) || 3, "0")}.ext`
              : `${options.newBaseName}.ext`}
          </strong>
        </div>
      )}
    </>
  );

  return null;
}
