export const RENAME_MODES = [
  { id: "replace", label: "Find & Replace" },
  { id: "prefix", label: "Tambah Prefix" },
  { id: "suffix", label: "Tambah Suffix" },
  { id: "numbering", label: "Numbering Otomatis" },
  { id: "case", label: "Ubah Case" },
  { id: "trim", label: "Hapus Spasi/Karakter" },
   { id: "rename_all", label: "Ganti Semua Nama" },
];

export const DEFAULT_OPTIONS = {
  newBaseName: "",
  useNumbering: true,
  numberingPad: "3",
  numberingStart: "1",
  numberingSep: "_",
  numberingPos: "suffix",
};

export const CASE_OPTIONS = [
  { id: "lower", label: "lowercase" },
  { id: "upper", label: "UPPERCASE" },
  { id: "title", label: "Title Case" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
];

export function applyRename(name, ext, mode, options, index) {
  const base = name;
  switch (mode) {
    case "replace": {
      const { find, replace, useRegex, caseSensitive } = options;
      if (!find) return base;
      try {
        const flags = caseSensitive ? "g" : "gi";
        const pattern = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
        return base.replace(pattern, replace || "");
      } catch { return base; }
    }
    case "prefix":
      return (options.prefix || "") + base;
    case "suffix":
      return base + (options.suffix || "");
    case "numbering": {
      const pad = parseInt(options.padding) || 3;
      const start = parseInt(options.start) || 1;
      const sep = options.separator || "_";
      const num = String(index + start).padStart(pad, "0");
      return options.position === "prefix"
        ? num + sep + base
        : base + sep + num;
    }
    case "case":
      switch (options.caseType) {
        case "lower": return base.toLowerCase();
        case "upper": return base.toUpperCase();
        case "title": return base.replace(/\b\w/g, c => c.toUpperCase());
        case "snake": return base.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
        case "kebab": return base.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
        default: return base;
      }
    case "trim": {
      let result = base;
      if (options.trimSpaces) result = result.replace(/\s+/g, options.spaceReplace || "");
      if (options.trimSpecial) result = result.replace(/[^a-zA-Z0-9\s_\-\.]/g, "");
      if (options.trimDots) result = result.replace(/\.+/g, "");
      return result;
    }
    case "rename_all": {
      const base = options.newBaseName || "file";
      if (!options.useNumbering) return base;
      const pad   = parseInt(options.numberingPad)   || 3;
      const start = parseInt(options.numberingStart) || 1;
      const sep   = options.numberingSep ?? "_";
      const num   = String(index + start).padStart(pad, "0");
      return options.numberingPos === "prefix"
    ? num + sep + base
    : base + sep + num;
}
    default: return base;
  }
}
