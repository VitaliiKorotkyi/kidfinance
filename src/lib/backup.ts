// src/lib/backup.ts

export type BackupFile = {
  meta: { app: "kidfinance"; version: number; createdAt: string };
  local: Record<string, string | null>;
};

/** Собрать весь LocalStorage приложения в JSON-строку */
export function makeBackup(): string {
  const local: Record<string, string | null> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    local[k] = localStorage.getItem(k);
  }
  const payload: BackupFile = {
    meta: { app: "kidfinance", version: 1, createdAt: new Date().toISOString() },
    local,
  };
  return JSON.stringify(payload, null, 2);
}

/** Скачать текст как файл */
export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Восстановить бэкап из файла. По умолчанию ОЧИЩАЕТ текущие данные. */
export async function restoreBackup(file: File, opts: { merge?: boolean } = {}) {
  const txt = await file.text();
  let data: BackupFile;
  try {
    data = JSON.parse(txt);
  } catch {
    throw new Error("Invalid JSON");
  }
  if (data?.meta?.app !== "kidfinance") {
    console.warn("Unknown backup source; importing anyway");
  }
  if (!opts.merge) localStorage.clear();
  for (const [k, v] of Object.entries(data.local || {})) {
    if (typeof v === "string") localStorage.setItem(k, v);
  }
}
