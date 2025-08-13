import { useRef } from "react";
import { exportBackup, importBackup } from "../lib/backup";

type Lang = "uk" | "en" | "cs";

const UI = {
  uk: {
    save: "Зберегти копію",
    restore: "Відновити",
    confirm: "Це перезапише поточні дані. Продовжити?",
    ok: "Готово",
    fail: "Помилка імпорту:",
  },
  en: {
    save: "Save backup",
    restore: "Restore",
    confirm: "This will overwrite current data. Continue?",
    ok: "Done",
    fail: "Import failed:",
  },
  cs: {
    save: "Uložit zálohu",
    restore: "Obnovit",
    confirm: "Tím přepíšete současná data. Pokračovat?",
    ok: "Hotovo",
    fail: "Import se nezdařil:",
  },
} as const;

export default function BackupPanel({ lang }: { lang: Lang }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const t = UI[lang] ?? UI.en;

  const handleExport = () => {
    exportBackup();
  };

  const handlePickAndImport = () => fileRef.current?.click();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        onClick={handleExport}
        title={t.save}
      >
        {t.save}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={async (e) => {
          const f = e.currentTarget.files?.[0];
          e.currentTarget.value = ""; // сброс чтобы можно было выбрать тот же файл снова
          if (!f) return;
          if (!window.confirm(t.confirm)) return;
          try {
            await importBackup(f);
            alert(t.ok);
            window.location.reload();
          } catch (err: any) {
            alert(`${t.fail} ${err?.message ?? err}`);
          }
        }}
      />

      <button
        type="button"
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        onClick={handlePickAndImport}
        title={t.restore}
      >
        {t.restore}
      </button>
    </div>
  );
}
