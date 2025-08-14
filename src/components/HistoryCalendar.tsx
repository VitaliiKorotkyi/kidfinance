import { useMemo, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type DayItem = { date: string; points: number };

export default function HistoryCalendar({ session }: { session: any }) {
  const [items, setItems] = useState<DayItem[]>([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // загрузка из облака для выбранного месяца
  useEffect(() => {
    if (!session) {
      setItems([]);
      return;
    }
    const from = new Date(month);
    from.setDate(1);
    const to = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const fromISO = from.toISOString().slice(0, 10);
    const toISO = to.toISOString().slice(0, 10);

    supabase
      .from("day_history")
      .select("date, points")
      .gte("date", fromISO)
      .lte("date", toISO)
      .order("date", { ascending: true })
      .then(({ data }) =>
        setItems((data ?? []).map((x: any) => ({ date: x.date, points: x.points })))
      );
  }, [session, month]);

  const weeks = useMemo(() => {
    const start = new Date(month);
    const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // понедельник = 0

    const cells: { date: Date; inMonth: boolean }[] = [];
    // 6 недель (42 ячейки), чтобы равномерно покрыть месяц
    for (let i = 0; i < 42; i++) {
      const d = new Date(firstDay);
      d.setDate(1 - startOffset + i);
      cells.push({ date: d, inMonth: d.getMonth() === month.getMonth() });
    }
    return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  }, [month]);

  const map = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((i) => m.set(i.date, i.points));
    return m;
  }, [items]);

  return (
    <section className="rounded-2xl border p-4 bg-white">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-medium">History</div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            ◀
          </button>
          <div className="text-sm text-slate-600">
            {month.toLocaleString(undefined, { month: "long", year: "numeric" })}
          </div>
          <button
            className="rounded border px-2 py-1"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[2px]">
        {weeks.flat().map((cell, idx) => {
          const iso = cell.date.toISOString().slice(0, 10);
          const pts = map.get(iso) ?? 0;
          const strong = pts > 0;
          const weak = pts < 0;
          return (
            <div
              key={idx}
              className={`h-16 rounded-md border flex flex-col items-center justify-center
                ${cell.inMonth ? "" : "opacity-40"}
                ${strong ? "bg-green-50 border-green-200" : weak ? "bg-rose-50 border-rose-200" : ""}`}
            >
              <div className="text-[10px] text-slate-500">{cell.date.getDate()}</div>
              <div className="text-sm font-semibold">{pts !== 0 ? pts : ""}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
