import React, { useState, useCallback, useEffect } from "react";
import { applyRename, RENAME_MODES } from "./utils/renameLogic";
import OptionsPanel from "./components/OptionsPanel";
import DropZone from "./components/DropZone";
import "./App.css";

export default function BulkRenamer() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("replace");
  const [options, setOptions] = useState({
    find: "", replace: "", useRegex: false, caseSensitive: false,
    prefix: "", suffix: "",
    padding: "3", start: "1", separator: "_", position: "suffix",
    caseType: "lower",
    trimSpaces: true, spaceReplace: "_", trimSpecial: false, trimDots: false,
    newBaseName: "", useNumbering: true, numberingPad: "3", numberingStart: "1", numberingSep: "_", numberingPos: "suffix",
  });
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [jszip, setJszip] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => setJszip(window.JSZip);
    document.head.appendChild(script);
  }, []);

  const processFiles = (fileList) => {
    const arr = Array.from(fileList).map(f => {
      const dotIdx = f.name.lastIndexOf(".");
      const hasExt = dotIdx > 0;
      return {
        id: Math.random().toString(36).slice(2),
        file: f,
        original: hasExt ? f.name.slice(0, dotIdx) : f.name,
        ext: hasExt ? f.name.slice(dotIdx) : "",
      };
    });
    setFiles(arr);
    setDone(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const items = e.dataTransfer.items;
    if (items) {
      const fileArr = [];
      for (let item of items) {
        if (item.kind === "file") fileArr.push(item.getAsFile());
      }
      if (fileArr.length) processFiles(fileArr);
    }
  }, []);

  const handleFolderPick = async () => {
    try {
      if (!window.showDirectoryPicker) {
        alert("Browser kamu tidak support File System Access API.\nCoba pakai Chrome/Edge desktop.");
        return;
      }
      const dir = await window.showDirectoryPicker();
      const fileArr = [];
      for await (const entry of dir.values()) {
        if (entry.kind === "file") fileArr.push(await entry.getFile());
      }
      processFiles(fileArr);
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    }
  };

  const handleFilePick = (e) => {
    if (e.target.files.length) processFiles(e.target.files);
  };

  const previews = files.map((f, i) => ({
    ...f,
    newName: applyRename(f.original, f.ext, mode, options, i) + f.ext,
  }));

  const hasChange = previews.some(p => p.newName !== p.original + p.ext);

  const handleDownloadZip = async () => {
    if (!jszip) return;
    setZipping(true);
    const zip = new jszip();
    for (const p of previews) {
      const buf = await p.file.arrayBuffer();
      zip.file(p.newName, buf);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renamed_files.zip";
    a.click();
    URL.revokeObjectURL(url);
    setZipping(false);
    setDone(true);
  };

  const handleDownloadAll = () => {
    previews.forEach(p => {
      const url = URL.createObjectURL(p.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = p.newName;
      a.click();
      URL.revokeObjectURL(url);
    });
    setDone(true);
  };

  const opt = (key, val) => setOptions(o => ({ ...o, [key]: val }));

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="logo-icon">📁</div>
        <div>
          <div className="logo-text">
            Bulk<span>Renamer</span>
          </div>
          <div className="logo-subtitle">
            rename massal — langsung di browser, tanpa upload
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="header-actions">
            <span className="file-count-badge">{files.length} file</span>
            <button className="reset-btn" onClick={() => { setFiles([]); setDone(false); }}>
              Reset
            </button>
          </div>
        )}
      </div>

      <div className="main-wrapper">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Mode selector */}
          <div>
            <div className="section-title">Mode</div>
            <div className="mode-selector">
              {RENAME_MODES.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => setMode(m.id)} 
                  className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <div className="section-title">Opsi</div>
            <OptionsPanel mode={mode} options={options} opt={opt} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="workspace">
          {files.length === 0 ? (
            <DropZone
              dragging={dragging}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onFolderPick={handleFolderPick}
              onFilePick={handleFilePick}
            />
          ) : (
            <>
              {/* Preview table */}
              <div className="preview-table-container">
                <div className="preview-header">
                  <span>Nama Asli</span>
                  <span></span>
                  <span>Nama Baru</span>
                </div>
                <div className="preview-body">
                  {previews.map(p => {
                    const changed = p.newName !== p.original + p.ext;
                    return (
                      <div key={p.id} className={`preview-row ${changed ? 'changed' : ''}`}>
                        <span className="preview-original" title={p.original + p.ext}>
                          {p.original + p.ext}
                        </span>
                        <span className="preview-arrow">→</span>
                        <span className={`preview-new ${changed ? 'changed-text' : ''}`} title={p.newName}>
                          {p.newName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action bar */}
              <div className="action-bar">
                <div className={`status-text ${hasChange ? 'has-changes' : ''}`}>
                  {hasChange ? (
                    <><span className="highlight">{previews.filter(p => p.newName !== p.original + p.ext).length}</span> file akan direname</>
                  ) : "Tidak ada perubahan"}
                </div>
                <div className="action-buttons">
                  <button
                    onClick={handleDownloadAll}
                    disabled={!hasChange}
                    title="Download satu-satu (cocok untuk sedikit file)"
                    className="secondary-btn"
                  >
                    ↓ Satu-satu
                  </button>
                  <button
                    onClick={handleDownloadZip}
                    disabled={!hasChange || zipping || !jszip}
                    title="Download semua dalam 1 file ZIP"
                    className="primary-btn"
                  >
                    {zipping ? "⏳ Membuat ZIP..." : "↓ Download ZIP"}
                  </button>
                </div>
              </div>

              {done && (
                <div className="success-banner">
                  ✓ Selesai! Cek folder Downloads kamu.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}