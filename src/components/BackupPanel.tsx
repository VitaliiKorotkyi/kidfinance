import React, { useRef } from "react";
import { exportBackup, importBackup } from "../lib/backup";

type Lang = "uk" | "en" | "cs";

const L = {
  uk: {
    save: "Зберегти копію",
    restore: "Відновити з файлу",
    tipSave: "Скачає резервну копію ваших даних (.json)",
    tipRestore:
      "Завантажте .json-файл із резервною копією. Поточні дані буде замінено.",
    confirm: "Відновити дані з файлу? Поточні дані буде замінено.",
    ok: "Дані відновлено.",
  },
  en: {
    save: "Save backup",
    restore: "Restore from file",
    tipSave: "Download a backup of your data (.json)",
    tipRestore:
      "Upload a .json backup file. Your current data will be replaced.",
    confirm: "Restore data from file? Current data will be replaced.",
    ok: "Data restored.",
  },
  cs: {
    save: "Uložit zálohu",
    restore: "Obnovit ze souboru",
    tipSave: "Stáhne zálohu vašich dat (.json)",
    tipRestore:
      "Nahrajte .json soubor se zálohou. Aktuální data budou přepsána.",
    confirm: "Obnovit data ze souboru? Aktuální data budou přepsána.",
    ok: "Data obnovena.",
  },
} as const;

export default function BackupPanel({ lang }: { lang: Lang }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const t = L[lang];

  function onExport() {
    exportBackup(); // скачает файл
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (!confirm(t.confirm)) return;
      await importBackup(file);
      alert(t.ok);
      // перезагрузим страницу, чтобы всё применилось
      location.reload();
    } finally {
      // очистим value, чтобы можно было выбрать тот же файл повторно
      e.currentTarget.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        title={t.tipSave}
        onClick={onExport}
      >
        {t.save}
      </button>

      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        title={t.tipRestore}
        onClick={() => fileRef.current?.click()}
      >
        {t.restore}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        hidden
        onChange={onImport}
      />
    </div>
  );
}
