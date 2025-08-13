// Универсальная резервная копия всех ключей localStorage проекта (префикс "kf_")

const PREFIX = "kf_";
const FILE_PREFIX = "kidfinance-backup";

type BackupFile = {
  meta: {
    app: "KidFinance";
    version: 1;
    createdAt: string; // ISO
  };
  values: Record<string, unknown>;
};

function collect(): BackupFile {
  const values: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    if (key.startsWith(PREFIX)) {
      try {
        const raw = localStorage.getItem(key);
        values[key] = raw ? JSON.parse(raw) : null;
      } catch {
        // если это число/строка — кладём как есть
        values[key] = localStorage.getItem(key);
      }
    }
  }
  return {
    meta: { app: "KidFinance", version: 1, createdAt: new Date().toISOString() },
    values,
  };
}

export function exportBackup() {
  const data = collect();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${FILE_PREFIX}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

export async function importBackup(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text) as BackupFile;

  if (!parsed?.meta?.app || parsed.meta.app !== "KidFinance") {
    throw new Error("Invalid backup file");
  }

  // применяем значения
  Object.entries(parsed.values).forEach(([k, v]) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      localStorage.setItem(k, String(v));
    }
  });
}
