import React from 'react';

export default function DropZone({ dragging, onDragOver, onDragLeave, onDrop, onFolderPick, onFilePick }) {
  return (
    <div className="dropzone-container">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`dropzone-box ${dragging ? 'dragging' : ''}`}
      >
        <div className="dropzone-icon">📂</div>
        <div className="dropzone-title">
          Drop file di sini
        </div>
        <div className="dropzone-subtitle">
          atau pilih dari device kamu
        </div>
        <div className="dropzone-actions">
          <button onClick={onFolderPick} className="primary-btn">
            📁 Pilih Folder
          </button>
          <label className="secondary-btn">
            🗂 Pilih File
            <input type="file" multiple onChange={onFilePick} style={{ display: "none" }} />
          </label>
        </div>
        <div className="dropzone-footer">
          File tidak dikirim ke server — semua diproses di browser kamu
        </div>
      </div>
    </div>
  );
}
