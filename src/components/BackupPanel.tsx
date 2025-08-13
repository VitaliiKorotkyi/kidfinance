// src/components/BackupPanel.tsx
import { exportBackup, importBackup } from "../lib/backup";

type Lang = "uk" | "en" | "cs";

const L: Record<Lang, { save: string; restore: string; confirm: string }> = {
  uk: { save: "Зберегти копію", restore: "Відновити", confirm: "Замінити поточні дані?" },
  en: { save: "Save backup", restore: "Restore", confirm: "Replace current data?" },
  cs: { save: "Uložit zálohu", restore: "Obnovit", confirm: "Nahradit aktuální data?" },
};

export default function BackupPanel({ lang }: { lang: Lang }) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        onClick={() => exportBackup()}
      >
        {L[lang].save}
      </button>

      <label className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50 cursor-pointer">
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (!confirm(L[lang].confirm)) return;
            try {
              await importBackup(file);
              location.reload(); // чтобы подтянуть восстановленные данные
            } catch (err) {
              alert((err as Error).message || "Import failed");
            }
          }}
        />
        {L[lang].restore}
      </label>
    </div>
  );
}
