import { useRef, useState } from "react";
import { makeBackup, downloadText, restoreBackup } from "../lib/backup";

export default function BackupPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onExport = () => {
    const text = makeBackup();
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadText(`kidfinance-backup-${stamp}.json`, text);
  };

  const onImport = async (file?: File | null) => {
    const f = file ?? fileRef.current?.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      await restoreBackup(f, { merge: false }); // перезаписываем
      alert("Backup restored. The app will reload.");
      location.reload();
    } catch (e: any) {
      alert("Import failed: " + (e?.message || "Unknown error"));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        onClick={onExport}
      >
        Export JSON
      </button>

      <label className="rounded-xl border px-3 py-1 text-sm cursor-pointer hover:bg-slate-50">
        Import JSON
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => onImport(e.target.files?.[0] || null)}
          disabled={busy}
        />
      </label>
    </div>
  );
}
