// src/components/BackupPanel.tsx
import { useRef } from "react";
import { exportBackup, importBackup } from "../lib/backup";

type Lang = "uk" | "en" | "cs";

const L: Record<
  Lang,
  {
    exportLabel: string;
    importLabel: string;
    exportTitle: string;
    importTitle: string;
    confirm: string;
    done: string;
    error: string;
  }
> = {
  uk: {
    exportLabel: "Зберегти копію",
    importLabel: "Відновити",
    exportTitle: "Завантажити резервну копію як файл",
    importTitle: "Відновити дані з файлу",
    confirm: "Відновити дані з файлу? Поточні дані будуть заміщені.",
    done: "Готово! Дані відновлено.",
    error: "Помилка: файл резервної копії недійсний.",
  },
  en: {
    exportLabel: "Save backup",
    importLabel: "Restore",
    exportTitle: "Download a backup file",
    importTitle: "Restore data from file",
    confirm: "Restore data from file? Current data will be replaced.",
    done: "Done! Data restored.",
    error: "Error: invalid backup file.",
  },
  cs: {
    exportLabel: "Uložit zálohu",
    importLabel: "Obnovit",
    exportTitle: "Stáhnout zálohu jako soubor",
    importTitle: "Obnovit data ze souboru",
    confirm: "Obnovit data ze souboru? Aktuální data budou přepsána.",
    done: "Hotovo! Data obnovena.",
    error: "Chyba: neplatný soubor zálohy.",
  },
};

export default function BackupPanel({ lang = "en" }: { lang?: Lang }) {
  const t = L[lang] || L.en;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportBackup();
  };

  const handlePick = () => {
    fileRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ""; // сбросить выбор (чтобы можно было выбрать тот же файл снова)
    if (!f) return;

    if (!confirm(t.confirm)) return;
    try {
      await importBackup(f);
      alert(t.done);
      // перезагрузим, чтобы подхватить восстановленные данные
      location.reload();
    } catch (err) {
      alert(t.error);
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        title={t.exportTitle}
        onClick={handleExport}
      >
        {t.exportLabel}
      </button>
      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        title={t.importTitle}
        onClick={handlePick}
      >
        {t.importLabel}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
