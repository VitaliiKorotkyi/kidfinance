// src/lib/backup.ts
const PREFIX = "kf_";
const FILE_PREFIX = "kidfinance-backup";

type BackupFile = {
  meta: { app: "KidFinance"; version: 1; createdAt: string };
  values: Record<string, unknown>;
};

function collect(): BackupFile {
  const values: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    if (key.startsWith(PREFIX)) {
      const raw = localStorage.getItem(key);
      try { values[key] = raw ? JSON.parse(raw) : null; }
      catch { values[key] = raw; }
    }
  }
  return { meta: { app: "KidFinance", version: 1, createdAt: new Date().toISOString() }, values };
}

export function exportBackup() {
  const blob = new Blob([JSON.stringify(collect(), null, 2)], { type: "application/json" });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${FILE_PREFIX}-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importBackup(file: File) {
  const parsed = JSON.parse(await file.text()) as BackupFile;
  if (parsed?.meta?.app !== "KidFinance") throw new Error("Invalid backup file");
  for (const [k, v] of Object.entries(parsed.values)) {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch { localStorage.setItem(k, String(v)); }
  }
}
