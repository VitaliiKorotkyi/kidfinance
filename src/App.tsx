import { useEffect, useMemo, useState } from "react";
import guideUk from './guides/USER_GUIDE.uk.md?raw';
import guideEn from './guides/USER_GUIDE.en.md?raw';
import guideCs from './guides/USER_GUIDE.cs.md?raw';
import BackupPanel from "./components/BackupPanel";
import { marked } from 'marked';

/* ================= i18n (uk / en / cs) ================= */
type Lang = "uk" | "en" | "cs";
const I18N: Record<Lang, Record<string, string>> = {
  uk: {
    app: "KidFinance",
    lang: "Мова",
    help: "Допомога",
    today: "сьогодні",

    child: "Профіль дитини",
    name: "Ім’я",
    age: "Вік",
    gender: "Стать",
    boy: "Хлопчик",
    girl: "Дівчинка",
    other: "Інше",
    temperament: "Темперамент",
    active: "Активний",
    calm: "Спокійний",
    focused: "Усидливий",
    mixed: "Змішаний",
    goal: "Мета",
    balanced: "Збалансовано",
    discipline: "Дисципліна",
    health: "Здоров’я",
    study: "Навчання",
    creativity: "Творчість",

    currencySymbol: "Символ валюти",
    ratePer100: "Курс (за 100 балів)",
    bonusPerLevel: "Надбавка за рівень (за 100 балів)",
    per100: "за 100 б.",

    explainTitle: "Пояснення дитині:",
    explainBody:
      "За справи — бали; ввечері вони стають грошима та діляться на кишенькові, заощадження й інвестиції.",

    plan: "План на сьогодні",
    morning: "Ранок",
    day: "День",
    evening: "Вечір",
    newTask: "Нове завдання",
    points: "Бали",
    pointsShort: "б.",
    time: "Час",
    add: "Додати",
    none: "Немає завдань",
    placeholderNewTask: "Напр., Прибрати іграшки",

    summary: "Підсумок дня",
    progressDay: "Прогрес дня",
    monthProgress: "Прогрес за місяць",
    yearProgress: "Прогрес за рік",
    level: "Рівень розвитку",
    monthTarget: "Місячна ціль (б.)",
    yearTarget: "Річна ціль (б.)",
    closeDay: "Завершити день",

    pocket: "Кишенькові",
    saving: "Заощадження",
    invest: "Інвестиції",

    why: "Чому це важливо:",
    r1: "Дисципліна формує корисні звички.",
    r2: "Розподіл на витрати, заощадження та інвестиції вчить плануванню.",
    r3: "До 18 років формується стартовий капітал.",

    reminders: "Нагадування (демо)",
    reminder: "нагадування",
    delete: "видалити",

    workout: "Зарядка (конструктор)",
    complex: "Зарядка (комплекс)",
    totalVol: "Загальний обсяг",
    exercise: "Вправа",
    sets: "Підходи",
    reps: "Повторів за підхід",
    repsShort: "повт.",
    addExercise: "Додати вправу",
    autoInc: "Автозбільшення щотижня",
    lastUpdate: "ост. оновлення",
    perWeek: "+повт./тиждень",
    applyNow: "Застосувати зараз",
    complexTod: "Час доби для комплексу",
    addComplexToPlan: "Додати комплекс у план",
    ageRecs: "Рекомендації за віком",

    foodPenalties: "Харчування та звички (штрафи)",
    addCustomBad: "Власний штраф",
    minus: "−",
    plus: "+",
    placeholderCustomPenalty: "Напр., Газована 0.5л",
    "bad.soda": "Газована",
    "bad.chips": "Чіпси",
    "bad.candy": "Солодощі",
    "bad.fastfood": "Фастфуд",
    "bad.energy": "Енергетик",

    "ex.pushups": "Віджимання",
    "ex.squats": "Присідання",
    "ex.plank": "Планка",
    "ex.crunch": "Скручування пресу",
    "ex.lunge": "Випади",
    "ex.burpee": "Берпі",
    "ex.situp": "Підйом тулуба",
    "ex.jumpPlace": "Стрибки на місці",
    "ex.jumpingJacks": "Стрибки «зірочка»",
    "ex.bandPullup": "Підтягування гумою",
    "ex.bandRow": "Тяга гумою",
    "ex.gluteBridge": "Ягідний місток",
    "ex.superman": "Супермен",
    "ex.scissors": "Ножиці",
    "ex.bicycle": "Велосипед прес",
    "ex.highKnees": "Біг з високими колінами",
    "ex.sidePlank": "Бічна планка",
    "ex.widePushups": "Широкі віджимання",
    "ex.jumpSquat": "Присід зі стрибком",
    "ex.reverseDip": "Зворотні віджимання від стільця",

    rules: "Правила",
    allowNegative: "Дозволяти мінус",
    strictEnabled: "Суворий режим",
    strictMinTasks: "Мінімум завдань за день",
    strictPenalty: "Штраф (бали)",
    penalties: "Штрафи",
    penaltyBadFood: "за харчування/звички",
    penaltyStrict: "за невиконання мінімуму",

    warnTooHigh:
      "⚠ {name}: обсяг {vol} > рекомендовано {max} для {age} років.",
    warnLow:
      "ℹ {name}: можна збільшити (зараз {vol} < {min}) для {age} років.",
  },
  en: {
    app: "KidFinance",
    lang: "Language",
    help: "Help",
    today: "today",

    child: "Child profile",
    name: "Name",
    age: "Age",
    gender: "Gender",
    boy: "Boy",
    girl: "Girl",
    other: "Other",
    temperament: "Temperament",
    active: "Active",
    calm: "Calm",
    focused: "Focused",
    mixed: "Mixed",
    goal: "Goal",
    balanced: "Balanced",
    discipline: "Discipline",
    health: "Health",
    study: "Study",
    creativity: "Creativity",

    currencySymbol: "Currency symbol",
    ratePer100: "Rate (per 100 pts)",
    bonusPerLevel: "Bonus per level (per 100 pts)",
    per100: "per 100 pts",

    explainTitle: "Explain to child:",
    explainBody:
      "You earn points for tasks; at night they turn into money split into pocket, savings and investments.",

    plan: "Today's plan",
    morning: "Morning",
    day: "Day",
    evening: "Evening",
    newTask: "New task",
    points: "Points",
    pointsShort: "pts",
    time: "Time",
    add: "Add",
    none: "No tasks",
    placeholderNewTask: "E.g., Tidy toys",

    summary: "Daily summary",
    progressDay: "Day progress",
    monthProgress: "Monthly progress",
    yearProgress: "Yearly progress",
    level: "Development level",
    monthTarget: "Monthly target (pts)",
    yearTarget: "Yearly target (pts)",
    closeDay: "Close day",

    pocket: "Pocket",
    saving: "Saving",
    invest: "Investments",

    why: "Why it matters:",
    r1: "Discipline builds good habits.",
    r2: "Splitting into Spend/Save/Invest teaches planning.",
    r3: "By 18 — starting capital.",

    reminders: "Reminders (demo)",
    reminder: "reminder",
    delete: "delete",

    workout: "Workout builder",
    complex: "Workout (complex)",
    totalVol: "Total volume",
    exercise: "Exercise",
    sets: "Sets",
    reps: "Reps per set",
    repsShort: "reps",
    addExercise: "Add exercise",
    autoInc: "Auto-increase weekly",
    lastUpdate: "last update",
    perWeek: "+reps per week",
    applyNow: "Apply now",
    complexTod: "Time of day for complex",
    addComplexToPlan: "Add complex to plan",
    ageRecs: "Age recommendations",

    foodPenalties: "Food & habits (penalties)",
    addCustomBad: "Custom penalty",
    minus: "−",
    plus: "+",
    placeholderCustomPenalty: "E.g., Soda 0.5L",
    "bad.soda": "Soda",
    "bad.chips": "Chips",
    "bad.candy": "Candy",
    "bad.fastfood": "Fast food",
    "bad.energy": "Energy drink",

    "ex.pushups": "Push-ups",
    "ex.squats": "Squats",
    "ex.plank": "Plank",
    "ex.crunch": "Crunches",
    "ex.lunge": "Lunges",
    "ex.burpee": "Burpees",
    "ex.situp": "Sit-ups",
    "ex.jumpPlace": "Jumps in place",
    "ex.jumpingJacks": "Jumping jacks",
    "ex.bandPullup": "Band pull-ups",
    "ex.bandRow": "Band rows",
    "ex.gluteBridge": "Glute bridge",
    "ex.superman": "Superman",
    "ex.scissors": "Scissors",
    "ex.bicycle": "Bicycle crunch",
    "ex.highKnees": "High knees",
    "ex.sidePlank": "Side plank",
    "ex.widePushups": "Wide push-ups",
    "ex.jumpSquat": "Jump squat",
    "ex.reverseDip": "Bench dips",

    rules: "Rules",
    allowNegative: "Allow negative points",
    strictEnabled: "Strict mode",
    strictMinTasks: "Minimum tasks/day",
    strictPenalty: "Penalty (points)",
    penalties: "Penalties",
    penaltyBadFood: "food/habits",
    penaltyStrict: "minimum not met",

    warnTooHigh:
      "⚠ {name}: volume {vol} > recommended {max} for age {age}.",
    warnLow: "ℹ {name}: you may increase (now {vol} < {min}) for age {age}.",
  },
  cs: {
    app: "KidFinance",
    lang: "Jazyk",
    help: "Nápověda",
    today: "dnes",

    child: "Profil dítěte",
    name: "Jméno",
    age: "Věk",
    gender: "Pohlaví",
    boy: "Chlapec",
    girl: "Dívka",
    other: "Jiné",
    temperament: "Povaha",
    active: "Aktivní",
    calm: "Klidný",
    focused: "Soustředěný",
    mixed: "Smíšený",
    goal: "Cíl",
    balanced: "Vyvážené",
    discipline: "Disciplína",
    health: "Zdraví",
    study: "Studium",
    creativity: "Kreativita",

    currencySymbol: "Symbol měny",
    ratePer100: "Sazba (za 100 bodů)",
    bonusPerLevel: "Bonus za úroveň (za 100 bodů)",
    per100: "za 100 b.",

    explainTitle: "Vysvětlení dítěti:",
    explainBody:
      "Za úkoly získáváš body; večer se mění na peníze a dělí se na kapesné, spoření a investice.",

    plan: "Plán na dnes",
    morning: "Ráno",
    day: "Den",
    evening: "Večer",
    newTask: "Nový úkol",
    points: "Body",
    pointsShort: "b.",
    time: "Čas",
    add: "Přidat",
    none: "Žádné úkoly",
    placeholderNewTask: "Např.: Uklidit hračky",

    summary: "Denní souhrn",
    progressDay: "Denní postup",
    monthProgress: "Postup za měsíc",
    yearProgress: "Postup za rok",
    level: "Úroveň rozvoje",
    monthTarget: "Měsíční cíl (b.)",
    yearTarget: "Roční cíl (b.)",
    closeDay: "Uzavřít den",

    pocket: "Kapesné",
    saving: "Spoření",
    invest: "Investice",

    why: "Proč je to důležité:",
    r1: "Disciplína vytváří dobré návyky.",
    r2: "Dělení na výdaje/spoření/investice učí plánování.",
    r3: "Do 18 let vzniká startovní kapitál.",

    reminders: "Připomínky (demo)",
    reminder: "připomínka",
    delete: "smazat",

    workout: "Sestava cvičení",
    complex: "Sestava (komplex)",
    totalVol: "Celkový objem",
    exercise: "Cvik",
    sets: "Série",
    reps: "Opakování na sérii",
    repsShort: "opak.",
    addExercise: "Přidat cvik",
    autoInc: "Automatické navýšení týdně",
    lastUpdate: "posl. aktualizace",
    perWeek: "+opak./týden",
    applyNow: "Použít nyní",
    complexTod: "Čas dne pro komplex",
    addComplexToPlan: "Přidat komplex do plánu",
    ageRecs: "Doporučení podle věku",

    foodPenalties: "Jídlo a návyky (malusy)",
    addCustomBad: "Vlastní malus",
    minus: "−",
    plus: "+",
    placeholderCustomPenalty: "Např.: Cola 0.5l",
    "bad.soda": "Slazený nápoj",
    "bad.chips": "Brambůrky",
    "bad.candy": "Sladkosti",
    "bad.fastfood": "Fast food",
    "bad.energy": "Energetický nápoj",

    "ex.pushups": "Kliky",
    "ex.squats": "Dřepy",
    "ex.plank": "Plank",
    "ex.crunch": "Skracovačky",
    "ex.lunge": "Výpady",
    "ex.burpee": "Burpees",
    "ex.situp": "Sed-leh",
    "ex.jumpPlace": "Skoky na místě",
    "ex.jumpingJacks": "Panáky",
    "ex.bandPullup": "Přitahy s gumou",
    "ex.bandRow": "Veslování s gumou",
    "ex.gluteBridge": "Zádový most",
    "ex.superman": "Superman",
    "ex.scissors": "Nůžky",
    "ex.bicycle": "Bicycle",
    "ex.highKnees": "Běh s vysokými koleny",
    "ex.sidePlank": "Boční plank",
    "ex.widePushups": "Široké kliky",
    "ex.jumpSquat": "Výskok z podřepu",
    "ex.reverseDip": "Tricepsové kliky o lavici",

    rules: "Pravidla",
    allowNegative: "Povolit minus",
    strictEnabled: "Přísný režim",
    strictMinTasks: "Min. úkolů/den",
    strictPenalty: "Penalizace (body)",
    penalties: "Malusy",
    penaltyBadFood: "jídlo/návyky",
    penaltyStrict: "nesplněno minimum",

    warnTooHigh:
      "⚠ {name}: objem {vol} > doporučeno {max} pro věk {age}.",
    warnLow:
      "ℹ {name}: lze navýšit (nyní {vol} < {min}) pro věk {age}.",
  },
};
const t = (l: Lang, k: string) => I18N[l][k] ?? I18N.en[k] ?? k;
const tf = (l: Lang, k: string, vals: Record<string, string | number>) =>
  Object.entries(vals).reduce(
    (s, [kk, v]) => s.replaceAll(`{${kk}}`, String(v)),
    t(l, k)
  );

/* ================ Exercise keys ================ */
const EX_KEYS = [
  "ex.pushups","ex.squats","ex.plank","ex.crunch","ex.lunge","ex.burpee","ex.situp","ex.jumpPlace","ex.jumpingJacks",
  "ex.bandPullup","ex.bandRow","ex.gluteBridge","ex.superman","ex.scissors","ex.bicycle","ex.highKnees","ex.sidePlank",
  "ex.widePushups","ex.jumpSquat","ex.reverseDip",
] as const;

/* ================= types ================= */
type ChildProfile = {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  temperament: "active" | "calm" | "focused" | "mixed";
  goal: "discipline" | "health" | "study" | "creativity" | "balanced";
  currencySymbol: string;
  ratePer100: number;
  bonusPerLevel: number;
};
type TaskChild = { nameKey: (typeof EX_KEYS)[number]; sets: number; reps: number; points: number };
type Task = {
  id: string; title?: string; labelKey?: string;
  points: number; timeOfDay: "morning" | "day" | "evening";
  autoReminder: boolean; done: boolean; children?: TaskChild[];
};
type Exercise = { id: string; nameKey: (typeof EX_KEYS)[number]; sets: number; reps: number; points: number; tod: "morning" | "day" | "evening" };
type WorkoutPlan = { exercises: Exercise[]; autoIncrement: { enabled: boolean; perWeekReps: number }; autoSync?: boolean; lastIncrementISO?: string; };
type BadEvent = { id: string; title: string; penalty: number; active: boolean };
type DaySummary = { dateISO: string; points: number };
type Rules = { allowNegative: boolean; strictEnabled: boolean; strictMinTasks: number; strictPenalty: number };

/* ================ defaults ================= */
const defaultTasks: Task[] = [];
const defaultChild: ChildProfile = { name: "Дитина", age: 10, gender: "male", temperament: "active", goal: "balanced", currencySymbol: "¤", ratePer100: 100, bonusPerLevel: 0 };
const defaultWorkout: WorkoutPlan = {
  exercises: [
    { id: "e1", nameKey: "ex.pushups", sets: 1, reps: 1, points: 1, tod: "morning" },
    { id: "e2", nameKey: "ex.squats", sets: 1, reps: 1, points: 1, tod: "morning" },
  ],
  autoIncrement: { enabled: true, perWeekReps: 1 }, autoSync: false, lastIncrementISO: new Date().toISOString().slice(0, 10),
};
const defaultBad: BadEvent[] = [
  { id: "b1", title: "bad.soda", penalty: 5, active: false },
  { id: "b2", title: "bad.chips", penalty: 5, active: false },
  { id: "b3", title: "bad.candy", penalty: 5, active: false },
  { id: "b4", title: "bad.fastfood", penalty: 5, active: false },
  { id: "b5", title: "bad.energy", penalty: 10, active: false },
];
const defaultRules: Rules = { allowNegative: true, strictEnabled: false, strictMinTasks: 3, strictPenalty: 10 };
const LS = {
  child: "kf_child", tasks: "kf_tasks", budget: "kf_budget", history: "kf_history",
  workout: "kf_workout", targets: "kf_targets", bad: "kf_bad", lang: "kf_lang",
  lastActive: "kf_last_active", tempPoints: "kf_temp_points", rules: "kf_rules",
};

/* ================ utils ================= */
const labelPart = (p: Task["timeOfDay"], l: Lang) => p === "morning" ? t(l, "morning") : p === "day" ? t(l, "day") : t(l, "evening");
const todayISO = () => new Date().toISOString().slice(0, 10);
function weeksBetween(fromISO?: string, to = new Date()) { if (!fromISO) return 999; const d = new Date(fromISO); return Math.floor((to.getTime() - d.getTime()) / (7 * 24 * 60 * 60 * 1000)); }
function msUntilMidnight() { const now = new Date(); const next = new Date(now); next.setHours(24, 0, 0, 0); return next.getTime() - now.getTime(); }
function goldBar(w: number) { return <div className="h-3 w-full rounded-full bg-yellow-100 overflow-hidden"><div className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" style={{ width: `${Math.min(100, Math.max(0, w))}%` }} /></div>; }
function recommendedVolume(age: number, exKey: (typeof EX_KEYS)[number]) {
  const band = age <= 8 ? 0 : age <= 11 ? 1 : age <= 14 ? 2 : 3;
  const table: Record<string, [number, number][]> = {
    "ex.pushups": [[6, 20], [10, 30], [16, 40], [20, 60]],
    "ex.squats": [[15, 40], [20, 60], [30, 80], [40, 120]],
    "ex.plank": [[20, 60], [30, 90], [40, 120], [60, 180]],
  };
  const arr = table[exKey] ?? [[10, 30], [15, 45], [20, 60], [25, 75]];
  return arr[band] as [number, number];
}

/* ================ component ================= */
export default function App() {
  const [lang, setLang] = useState<Lang>((localStorage.getItem(LS.lang) as Lang) || "uk");
  const [helpOpen, setHelpOpen] = useState(false);

  const [child, setChild] = useState<ChildProfile>(defaultChild);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [newTask, setNewTask] = useState({ title: "", points: 10, timeOfDay: "day" as Task["timeOfDay"] });
  const [spend, setSpend] = useState(20); const [save, setSave] = useState(50); const [invest, setInvest] = useState(30);
  const [history, setHistory] = useState<DaySummary[]>([]);
  const [targets, setTargets] = useState({ monthly: 2000, yearly: 24000 });

  const [workout, setWorkout] = useState<WorkoutPlan>(defaultWorkout);
  const [newEx, setNewEx] = useState<Exercise>({ id: "new", nameKey: EX_KEYS[0], sets: 1, reps: 1, points: 1, tod: "morning" });

  const [bad, setBad] = useState<BadEvent[]>(defaultBad);
  const [customBad, setCustomBad] = useState({ title: "", penalty: 5 });
  const [rules, setRules] = useState<Rules>(defaultRules);
  const [activeTab, setActiveTab] = useState<Task["timeOfDay"]>("morning");
  const [openComplex, setOpenComplex] = useState<Record<string, boolean>>({});

  /* load/save */
  useEffect(() => {
    try {
      const g = (k: string) => localStorage.getItem(k);
      const c = g(LS.child), tsk = g(LS.tasks), b = g(LS.budget), h = g(LS.history), w = g(LS.workout), tg = g(LS.targets), bd = g(LS.bad), rl = g(LS.rules);
      if (c) setChild(JSON.parse(c)); if (tsk) setTasks(JSON.parse(tsk));
      if (b) { const v = JSON.parse(b); setSpend(v.spend ?? 20); setSave(v.save ?? 50); setInvest(v.invest ?? 30); }
      if (h) setHistory(JSON.parse(h)); if (w) setWorkout(JSON.parse(w)); if (tg) setTargets(JSON.parse(tg));
      if (bd) setBad(JSON.parse(bd)); if (rl) setRules(JSON.parse(rl));
    } catch {}
  }, []);
  useEffect(() => localStorage.setItem(LS.lang, lang), [lang]);
  useEffect(() => localStorage.setItem(LS.child, JSON.stringify(child)), [child]);
  useEffect(() => localStorage.setItem(LS.tasks, JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem(LS.budget, JSON.stringify({ spend, save, invest })), [spend, save, invest]);
  useEffect(() => localStorage.setItem(LS.history, JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem(LS.workout, JSON.stringify(workout)), [workout]);
  useEffect(() => localStorage.setItem(LS.bad, JSON.stringify(bad)), [bad]);
  useEffect(() => localStorage.setItem(LS.rules, JSON.stringify(rules)), [rules]);

  // auto-increment workout reps weekly
  useEffect(() => {
    if (!workout.autoIncrement.enabled || workout.autoIncrement.perWeekReps <= 0) return;
    const weeks = weeksBetween(workout.lastIncrementISO, new Date());
    if (weeks <= 0) return;
    setWorkout((p) => ({
      ...p,
      exercises: p.exercises.map((e) => ({ ...e, reps: e.reps + weeks * p.autoIncrement.perWeekReps })),
      lastIncrementISO: todayISO(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // totals / penalties / strict
  const taskPoints = useMemo(() => tasks.filter((t) => t.done).reduce((s, t) => s + t.points, 0), [tasks]);
  const badPenalty = useMemo(() => bad.filter((b) => b.active).reduce((s, b) => s + b.penalty, 0), [bad]);
  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const strictPenalty = rules.strictEnabled && doneCount < rules.strictMinTasks ? rules.strictPenalty : 0;
  const netBase = taskPoints - badPenalty - strictPenalty;
  const netPoints = rules.allowNegative ? netBase : Math.max(0, netBase);
  useEffect(() => localStorage.setItem(LS.tempPoints, String(netPoints)), [netPoints]);

  // level from yearly points
  const now = new Date(); const yearKey = `${now.getFullYear()}`;
  const yearPoints = useMemo(() => {
    const sum = history.filter((d) => d.dateISO.startsWith(yearKey)).reduce((s, d) => s + d.points, 0);
    const inHist = history.some((d) => d.dateISO === todayISO());
    return sum + (inHist ? 0 : netPoints);
  }, [history, yearKey, netPoints]);
  const level = Math.floor(yearPoints / 500) + 1;

  // effective rate (base + bonus per level)
  const effectiveRatePer100 = child.ratePer100 + (level - 1) * child.bonusPerLevel;
  const earningsToday = useMemo(() => (effectiveRatePer100 / 100) * netPoints, [effectiveRatePer100, netPoints]);

  const currency = child.currencySymbol || "¤";
  const allocation = useMemo(() => ({
    spend: Math.round(earningsToday * spend / 100),
    save: Math.round(earningsToday * save / 100),
    invest: Math.round(earningsToday * invest / 100),
  }), [earningsToday, spend, save, invest]);

  const byPart = useMemo(() => ({
    morning: tasks.filter((t) => t.timeOfDay === "morning"),
    day: tasks.filter((t) => t.timeOfDay === "day"),
    evening: tasks.filter((t) => t.timeOfDay === "evening"),
  }), [tasks]);

  // midnight auto-close
  useEffect(() => {
    const last = localStorage.getItem(LS.lastActive); const today = todayISO();
    if (last && last < today) { const temp = Number(localStorage.getItem(LS.tempPoints) || "0"); saveDay(last, temp); }
    localStorage.setItem(LS.lastActive, today);
    const timer = setTimeout(() => handleMidnight(), msUntilMidnight());
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function handleMidnight() {
    saveDay(todayISO(), netPoints);
    setTasks((p) => p.map((t) => ({ ...t, done: false })));
    setBad((p) => p.map((b) => ({ ...b, active: false })));
    localStorage.setItem(LS.tempPoints, "0");
    setTimeout(() => handleMidnight(), msUntilMidnight());
  }
  function saveDay(dateISO: string, points: number) {
    setHistory((prev) => {
      const ex = prev.find((d) => d.dateISO === dateISO);
      if (ex) return prev.map((d) => (d.dateISO === dateISO ? { ...d, points } : d));
      return [...prev, { dateISO, points }];
    });
  }
  

  // tasks
  function toggleDone(id: string) { setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
  function toggleReminder(id: string) { setTasks((p) => p.map((t) => (t.id === id ? { ...t, autoReminder: !t.autoReminder } : t))); }
  function removeTask(id: string) { setTasks((p) => p.filter((t) => t.id !== id)); }
  function addTask() {
    if (!newTask.title.trim()) return;
    const id = crypto.randomUUID();
    setTasks((p) => [...p, { id, title: newTask.title.trim(), points: newTask.points, timeOfDay: newTask.timeOfDay, autoReminder: false, done: false }]);
    setNewTask({ title: "", points: 10, timeOfDay: "day" });
  }

  // budget
  function rebalance(kind: "spend" | "save" | "invest", value: number) {
    const v = Math.max(0, Math.min(100, Math.round(value)));
    let a: any = { spend, save, invest, [kind]: v };
    const rest = ["spend", "save", "invest"].filter((k) => k !== kind);
    const restTotal = a[rest[0]] + a[rest[1]];
    const remain = 100 - v;
    const k1 = restTotal === 0 ? 0.5 : a[rest[0]] / restTotal;
    const k2 = restTotal === 0 ? 0.5 : a[rest[1]] / restTotal;
    a[rest[0]] = Math.round(remain * k1); a[rest[1]] = Math.round(remain * k2);
    const sum = a.spend + a.save + a.invest; if (sum !== 100) a[rest[1]] += 100 - sum;
    setSpend(a.spend); setSave(a.save); setInvest(a.invest);
  }

  // month/year
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthPoints = useMemo(() => {
    const sum = history.filter((d) => d.dateISO.startsWith(monthKey)).reduce((s, d) => s + d.points, 0);
    const inHist = history.some((d) => d.dateISO === todayISO());
    return sum + (inHist ? 0 : netPoints);
  }, [history, monthKey, netPoints]);
  const monthPct = (monthPoints / Math.max(1, targets.monthly)) * 100;
  const yearPct = (yearPoints / Math.max(1, targets.yearly)) * 100;

  // age recommendations
  const workoutWarnings = useMemo(() => {
    const msgs: string[] = [];
    for (const ex of workout.exercises) {
      const volume = ex.sets * ex.reps;
      const [min, max] = recommendedVolume(child.age, ex.nameKey);
      if (volume > max) msgs.push(tf(lang, "warnTooHigh", { name: t(lang, ex.nameKey), vol: volume, max, age: child.age }));
      else if (volume < min) msgs.push(tf(lang, "warnLow", { name: t(lang, ex.nameKey), vol: volume, min, age: child.age }));
    }
    return msgs;
  }, [workout.exercises, child.age, lang]);

  // complex -> plan (points auto sum)
  const complexAutoPoints = useMemo(() => workout.exercises.reduce((s, e) => s + e.points, 0), [workout.exercises]);
  const [complexTod, setComplexTod] = useState<Task["timeOfDay"]>("morning");
  function addComplexToPlan() {
    const id = `W-${Date.now()}`;
    const children: TaskChild[] = workout.exercises.map((ex) => ({ nameKey: ex.nameKey, sets: ex.sets, reps: ex.reps, points: ex.points }));
    const task: Task = { id, labelKey: "complex", points: complexAutoPoints, timeOfDay: complexTod, autoReminder: true, done: false, children };
    setTasks((p) => [...p, task]); setActiveTab(complexTod); setOpenComplex((o) => ({ ...o, [id]: true }));
  }

  const todayStr = new Intl.DateTimeFormat(lang === "uk" ? "uk-UA" : lang === "cs" ? "cs-CZ" : "en-US", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
  <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
    <div className="flex items-center gap-3">
      <div className="font-semibold tracking-tight text-xl">KidFinance</div>
      <select className="rounded-xl border px-2 py-1 text-sm" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
        <option value="uk">UK</option><option value="en">EN</option><option value="cs">CS</option>
      </select>
      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        onClick={() => setHelpOpen(true)}
      >
        {t(lang,'help')}
      </button>
    </div>

    {/* вот сюда добавляем панель бэкапа */}
    <div className="flex items-center gap-3">
      <BackupPanel />
      <div className="text-sm text-slate-600">{todayStr}</div>
    </div>
  </div>
</header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card>
          <CardTitle>{t(lang, "child")}</CardTitle>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label={t(lang, "name")} className="col-span-2">
              <input className="w-full rounded-xl border px-3 py-2" value={child.name} onChange={(e) => setChild({ ...child, name: e.target.value })}/>
            </Field>
            <Field label={t(lang, "age")}><input type="number" min={3} max={18} className="w-full rounded-xl border px-3 py-2" value={child.age} onChange={(e) => setChild({ ...child, age: parseInt(e.target.value || "0", 10) })}/></Field>
            <Field label={t(lang, "gender")}><select className="w-full rounded-xl border px-3 py-2" value={child.gender} onChange={(e) => setChild({ ...child, gender: e.target.value as any })}>
              <option value="male">{t(lang, "boy")}</option><option value="female">{t(lang, "girl")}</option><option value="other">{t(lang, "other")}</option></select></Field>
            <Field label={t(lang, "temperament")}><select className="w-full rounded-xl border px-3 py-2" value={child.temperament} onChange={(e) => setChild({ ...child, temperament: e.target.value as any })}>
              <option value="active">{t(lang, "active")}</option><option value="calm">{t(lang, "calm")}</option><option value="focused">{t(lang, "focused")}</option><option value="mixed">{t(lang, "mixed")}</option></select></Field>
            <Field label={t(lang, "goal")} className="col-span-2"><select className="w-full rounded-xl border px-3 py-2" value={child.goal} onChange={(e) => setChild({ ...child, goal: e.target.value as any })}>
              <option value="balanced">{t(lang, "balanced")}</option><option value="discipline">{t(lang, "discipline")}</option><option value="health">{t(lang, "health")}</option>
              <option value="study">{t(lang, "study")}</option><option value="creativity">{t(lang, "creativity")}</option></select></Field>

            <Field label={t(lang, "currencySymbol")}><input className="w-full rounded-xl border px-3 py-2" value={child.currencySymbol} onChange={(e) => setChild({ ...child, currencySymbol: e.target.value })}/></Field>
            <Field label={t(lang, "ratePer100")}><div className="flex items-center gap-2">
              <input type="number" min={0} className="w-full rounded-xl border px-3 py-2" value={child.ratePer100} onChange={(e) => setChild({ ...child, ratePer100: parseInt(e.target.value || "0", 10) })}/>
              <span className="text-xs text-slate-500">{t(lang, "per100")}</span></div></Field>
            <Field label={t(lang, "bonusPerLevel")}><div className="flex items-center gap-2">
              <input type="number" min={0} className="w-full rounded-xl border px-3 py-2" value={child.bonusPerLevel} onChange={(e) => setChild({ ...child, bonusPerLevel: parseInt(e.target.value || "0", 10) })}/>
              <span className="text-xs text-slate-500">{t(lang, "per100")}</span></div></Field>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 border p-4 text-sm leading-relaxed">
            <p className="font-medium">{t(lang, "explainTitle")}</p>
            <p className="text-slate-600">{t(lang, "explainBody")}</p>
          </div>
        </Card>

        {/* Plan */}
        <Card className="lg:col-span-2">
          <CardTitle>{t(lang, "plan")}</CardTitle>
          <div className="mb-4 flex gap-2">
            {(["morning", "day", "evening"] as const).map((p) => (
              <button key={p} onClick={() => setActiveTab(p)} className={`px-4 py-2 rounded-full text-sm ${activeTab === p ? "bg-slate-900 text-white" : "bg-white border hover:bg-slate-50"}`}>
                {labelPart(p, lang)}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {byPart[activeTab].length === 0 && <div className="text-sm text-slate-500">{t(lang, "none")}</div>}
            {byPart[activeTab].map((tk) => {
              const isComplex = tk.children && tk.children.length > 0;
              const open = openComplex[tk.id] ?? false;
              return (
                <div key={tk.id} className={`group rounded-2xl border bg-white p-3 ${tk.done ? "opacity-60" : ""}`}>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="size-4 accent-slate-900" checked={tk.done} onChange={() => toggleDone(tk.id)} />
                      <div>
                        <div className={`text-sm ${tk.done ? "line-through text-slate-400" : "text-slate-900"}`}>{tk.labelKey ? t(lang, tk.labelKey) : tk.title}</div>
                        <div className="text-xs text-slate-500">+{tk.points} {t(lang, "pointsShort")}</div>
                      </div>
                    </label>
                    <div className="flex items-center gap-3">
                      {isComplex && (
                        <button className="text-xs text-slate-600 hover:underline" onClick={() => setOpenComplex((o) => ({ ...o, [tk.id]: !open }))} title="details">
                          {open ? "▲" : "▼"}
                        </button>
                      )}
                      <label className="text-xs text-slate-600 flex items-center gap-2">
                        <input type="checkbox" className="accent-slate-900" checked={tk.autoReminder} onChange={() => toggleReminder(tk.id)} />
                        {t(lang, "reminder")}
                      </label>
                      <button className="text-xs text-slate-500 hover:text-red-600" onClick={() => removeTask(tk.id)}>{t(lang, "delete")}</button>
                    </div>
                  </div>
                  {isComplex && open && (
                    <div className="mt-2 rounded-xl border bg-slate-50 p-2 text-xs text-slate-700 space-y-1">
                      {tk.children!.map((c, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>{t(lang, c.nameKey)} — {c.sets}×{c.reps} {t(lang, "repsShort")}</div>
                          <div>+{c.points} {t(lang, "pointsShort")}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add manual task */}
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <div className="grid md:grid-cols-4 gap-3 items-end">
              <Field className="md:col-span-2" label={t(lang, "newTask")}><input className="w-full rounded-xl border px-3 py-2" placeholder={t(lang, "placeholderNewTask")} value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}/></Field>
              <Field label={t(lang, "points")}><input type="number" min={1} max={100} className="w-full rounded-xl border px-3 py-2" value={newTask.points} onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value || "0", 10) })}/></Field>
              <Field label={t(lang, "time")}><select className="w-full rounded-xl border px-3 py-2" value={newTask.timeOfDay} onChange={(e) => setNewTask({ ...newTask, timeOfDay: e.target.value as any })}>
                <option value="morning">{t(lang, "morning")}</option><option value="day">{t(lang, "day")}</option><option value="evening">{t(lang, "evening")}</option></select></Field>
              <div className="md:col-span-4 text-right"><button className="btn-primary" onClick={addTask}>{t(lang, "add")}</button></div>
            </div>
          </div>
        </Card>

        {/* Summary / Budget / Rules */}
        <Card className="lg:col-span-2">
          <CardTitle>{t(lang, "summary")}</CardTitle>
          <div className="grid md:grid-cols-4 gap-3">
            <StatTile label={`${t(lang, "points")} (net)`} value={`${netPoints}`} />
            <StatTile label="≈" value={`${Math.round(earningsToday)} ${currency}`} />
            <StatTile label={t(lang, "monthProgress")} value={`${monthPoints}/${targets.monthly}`} />
            <StatTile label={t(lang, "yearProgress")} value={`${yearPoints}/${targets.yearly}`} />
          </div>
          <div className="rounded-xl border p-3 bg-white mt-3">
            <div className="text-xs text-slate-500">{t(lang, "progressDay")}</div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-600" style={{ width: `${Math.min(100, (Math.abs(netPoints) / 100) * 100)}%` }} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div className="rounded-2xl border p-4 bg-white">
              <div className="flex items-center justify-between text-sm mb-2"><div className="font-medium">{t(lang, "monthProgress")}</div>
                <div className="text-slate-600">{monthPoints} / {targets.monthly}</div></div>{goldBar(monthPct)}
            </div>
            <div className="rounded-2xl border p-4 bg-white">
              <div className="flex items-center justify-between text-sm mb-2"><div className="font-medium">{t(lang, "yearProgress")}</div>
                <div className="text-slate-600">{yearPoints} / {targets.yearly}</div></div>{goldBar(yearPct)}
              <div className="text-xs text-slate-600 mt-2">{t(lang, "level")}: <span className="font-semibold">Lv {level}</span></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <AllocationCard title={t(lang, "pocket")} percent={spend} onChange={(v) => rebalance("spend", v)} amount={allocation.spend} currency={currency} />
            <AllocationCard title={t(lang, "saving")} percent={save} onChange={(v) => rebalance("save", v)} amount={allocation.save} currency={currency} />
            <AllocationCard title={t(lang, "invest")} percent={invest} onChange={(v) => rebalance("invest", v)} amount={allocation.invest} currency={currency} />
          </div>
          <div className="mt-4 rounded-2xl border p-4 bg-white grid md:grid-cols-4 gap-3 items-end text-sm">
            <div className="font-medium md:col-span-4">{t(lang, "rules")}</div>
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-slate-900" checked={rules.allowNegative} onChange={(e) => setRules((p) => ({ ...p, allowNegative: e.target.checked }))}/> {t(lang, "allowNegative")}</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-slate-900" checked={rules.strictEnabled} onChange={(e) => setRules((p) => ({ ...p, strictEnabled: e.target.checked }))}/> {t(lang, "strictEnabled")}</label>
            <label>{t(lang, "strictMinTasks")}<input type="number" min={0} className="w-full rounded-xl border px-3 py-2 mt-1" value={rules.strictMinTasks} onChange={(e) => setRules((p) => ({ ...p, strictMinTasks: Math.max(0, parseInt(e.target.value || "0", 10)) }))}/></label>
            <label>{t(lang, "strictPenalty")}<input type="number" min={0} className="w-full rounded-xl border px-3 py-2 mt-1" value={rules.strictPenalty} onChange={(e) => setRules((p) => ({ ...p, strictPenalty: Math.max(0, parseInt(e.target.value || "0", 10)) }))}/></label>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 border p-4 text-sm text-slate-700">
            <p className="font-medium">{t(lang, "why")}</p>
            <ul className="list-disc pl-5 space-y-1"><li>{t(lang, "r1")}</li><li>{t(lang, "r2")}</li><li>{t(lang, "r3")}</li></ul>
          </div>
        </Card>

        {/* Workout */}
        <Card>
          <CardTitle>{t(lang, "workout")}</CardTitle>
          <div className="text-sm text-slate-600 mb-3">{t(lang, "totalVol")}: <span className="font-medium">{workout.exercises.reduce((s, e) => s + e.sets * e.reps, 0)} {t(lang, "repsShort")} сумарно</span></div>
          <div className="space-y-2">
            {workout.exercises.map((ex) => (
              <div key={ex.id} className="rounded-xl border p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t(lang, ex.nameKey)}</div>
                    <div className="text-xs text-slate-500">{ex.sets} {t(lang, "sets").toLowerCase()} × {ex.reps} {t(lang, "repsShort")} · +{ex.points} {t(lang, "pointsShort")} · {labelPart(ex.tod, lang)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded border hover:bg-slate-50" onClick={() => setWorkout((p) => ({ ...p, exercises: p.exercises.map((e) => (e.id === ex.id ? { ...e, reps: Math.max(1, e.reps - 1) } : e)) }))}>{t(lang, "minus")}</button>
                    <button className="px-2 py-1 rounded border hover:bg-slate-50" onClick={() => setWorkout((p) => ({ ...p, exercises: p.exercises.map((e) => (e.id === ex.id ? { ...e, reps: e.reps + 1 } : e)) }))}>{t(lang, "plus")}</button>
                    <button className="text-xs text-red-600 hover:underline" onClick={() => setWorkout((p) => ({ ...p, exercises: p.exercises.filter((e) => e.id !== ex.id) }))}>{t(lang, "delete")}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add exercise */}
          <div className="mt-4 rounded-2xl border p-3 bg-white">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Field label={t(lang, "exercise")}><select className="w-full rounded-xl border px-3 py-2" value={newEx.nameKey} onChange={(e) => setNewEx((s) => ({ ...s, nameKey: e.target.value as (typeof EX_KEYS)[number] }))}>
                {EX_KEYS.map((k) => <option key={k} value={k}>{t(lang, k)}</option>)}
              </select></Field>
              <Field label={t(lang, "sets")}><input type="number" min={1} className="w-full rounded-xl border px-3 py-2" value={newEx.sets} onChange={(e) => setNewEx((s) => ({ ...s, sets: Math.max(1, parseInt(e.target.value || "1", 10)) }))}/></Field>
              <Field label={t(lang, "reps")}><input type="number" min={1} className="w-full rounded-xl border px-3 py-2" value={newEx.reps} onChange={(e) => setNewEx((s) => ({ ...s, reps: Math.max(1, parseInt(e.target.value || "1", 10)) }))}/></Field>
              <Field label={`${t(lang, "points")} (${t(lang, "pointsShort")})`}><input type="number" min={0} className="w-full rounded-xl border px-3 py-2" value={newEx.points} onChange={(e) => setNewEx((s) => ({ ...s, points: Math.max(0, parseInt(e.target.value || "0", 10)) }))}/></Field>
              <Field label={t(lang, "time")}><select className="w-full rounded-xl border px-3 py-2" value={newEx.tod} onChange={(e) => setNewEx((s) => ({ ...s, tod: e.target.value as any }))}>
                <option value="morning">{t(lang, "morning")}</option><option value="day">{t(lang, "day")}</option><option value="evening">{t(lang, "evening")}</option>
              </select></Field>
              <div className="col-span-2 text-right">
                <button className="btn-primary" onClick={() => { setWorkout((p) => ({ ...p, exercises: [...p.exercises, { ...newEx, id: crypto.randomUUID() }] })); setNewEx({ id: "new", nameKey: EX_KEYS[0], sets: 1, reps: 1, points: 1, tod: "morning" }); }}>
                  {t(lang, "addExercise")}
                </button>
              </div>
            </div>
          </div>

          {/* Complex to plan */}
          <div className="mt-4 rounded-2xl border p-3 bg-white">
            <div className="grid grid-cols-2 gap-2 items-end">
              <Field label={t(lang, "complexTod")}><select className="w-full rounded-xl border px-3 py-2" value={complexTod} onChange={(e) => setComplexTod(e.target.value as any)}>
                <option value="morning">{t(lang, "morning")}</option><option value="day">{t(lang, "day")}</option><option value="evening">{t(lang, "evening")}</option>
              </select></Field>
              <div className="text-right text-sm text-slate-600">Auto: <span className="font-semibold">+{complexAutoPoints}</span> {t(lang, "pointsShort")}</div>
            </div>
            <div className="text-right mt-3"><button className="btn-primary" onClick={addComplexToPlan}>{t(lang, "addComplexToPlan")}</button></div>
          </div>

          {/* Age recs */}
          <div className="mt-3 rounded-2xl bg-slate-50 border p-3 text-sm">
            <div className="font-medium mb-1">{t(lang, "ageRecs")} ({child.age})</div>
            <ul className="list-disc pl-5 space-y-1">
              {workout.exercises.map((ex) => { const [min, max] = recommendedVolume(child.age, ex.nameKey); return <li key={ex.id}>{t(lang, ex.nameKey)}: {min}–{max} {t(lang, "repsShort")}/трен.</li>; })}
            </ul>
            {workoutWarnings.length > 0 && <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-2 text-amber-800">{workoutWarnings.map((m, i) => <div key={i}>{m}</div>)}</div>}
          </div>
        </Card>

        {/* Penalties */}
        <Card>
          <CardTitle>{t(lang, "foodPenalties")}</CardTitle>
          <div className="space-y-2">
            {bad.map((bi) => (
              <label key={bi.id} className="flex items-center justify-between rounded-xl border p-2 bg-white">
                <div className="text-sm">{t(lang, bi.title)} (−{bi.penalty})</div>
                <input type="checkbox" className="accent-slate-900" checked={bi.active} onChange={(e) => setBad((p) => p.map((x) => (x.id === bi.id ? { ...x, active: e.target.checked } : x)))}/>
              </label>
            ))}
          </div>
          <div className="mt-3 rounded-xl border p-3 bg-white grid grid-cols-3 gap-2 items-end text-sm">
            <Field label={t(lang, "addCustomBad")} className="col-span-2"><input className="w-full rounded-xl border px-3 py-2" placeholder={t(lang, "placeholderCustomPenalty")} value={customBad.title} onChange={(e) => setCustomBad({ ...customBad, title: e.target.value })}/></Field>
            <Field label="−pts"><input type="number" min={1} className="w-full rounded-xl border px-3 py-2" value={customBad.penalty} onChange={(e) => setCustomBad({ ...customBad, penalty: Math.max(1, parseInt(e.target.value || "1", 10)) })}/></Field>
            <div className="col-span-3 text-right"><button className="btn-primary" onClick={() => { if (!customBad.title.trim()) return; setBad((p) => [...p, { id: crypto.randomUUID(), title: customBad.title.trim(), penalty: customBad.penalty, active: true }]); setCustomBad({ title: "", penalty: 5 }); }}>{t(lang, "add")}</button></div>
          </div>
        </Card>

        {/* Reminders */}
        <Card>
          <CardTitle>{t(lang, "reminders")}</CardTitle>
          <div className="rounded-2xl border bg-white divide-y">
            {tasks.filter((tk) => tk.autoReminder).map((tk) => (
              <div key={tk.id} className="p-3 text-sm hover:bg-slate-50">
                <span className="mr-2 text-slate-500">{labelPart(tk.timeOfDay, lang)}:</span>
                {tk.labelKey ? t(lang, tk.labelKey) : tk.title}
              </div>
            ))}
            {tasks.filter((tk) => tk.autoReminder).length === 0 && <div className="p-3 text-sm text-slate-500">{t(lang, "none")}</div>}
          </div>
        </Card>
      </div>

      {/* HELP MODAL */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} lang={lang} />
    </main>
  );
}

/* ================= helpers UI ================= */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition ${className}`}>{children}</section>; }
function CardTitle({ children }: { children: React.ReactNode }) { return <h2 className="mb-4 text-xl font-semibold tracking-tight">{children}</h2>; }
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return (<label className={`block ${className}`}><div className="mb-1 text-xs font-medium text-slate-600">{label}</div>{children}</label>); }
function StatTile({ label, value }: { label: string; value: string }) { return (<div className="rounded-xl border p-3 bg-white"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 flex items-baseline gap-1"><div className="text-2xl font-semibold">{value}</div></div></div>); }
function AllocationCard({ title, percent, onChange, amount, currency }: { title: string; percent: number; onChange: (v: number) => void; amount: number; currency: string; }) {
  return (<div className="rounded-2xl border p-4 bg-white"><div className="mb-2 flex items-center justify-between"><div className="font-medium">{title}</div><div className="text-sm text-slate-600">{percent}%</div></div>
    <input type="range" min={0} max={100} value={percent} onChange={(e) => onChange(parseInt(e.target.value, 10))} className="w-full h-2 rounded bg-slate-200 accent-slate-900"/>
    <div className="mt-2 text-sm text-slate-600">≈ {amount} {currency}</div></div>);
}

/* ============== Help Modal ============== */
function HelpModal({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: Lang; }) {
  if (!open) return null;
  const md = lang === 'uk' ? guideUk : lang === 'cs' ? guideCs : guideEn;
  const html = marked.parse(md) as string;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold">KidFinance — {t(lang, 'help')}</div>
            <button className="text-sm text-slate-600 hover:text-slate-900" onClick={onClose}>✕</button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[70vh] prose prose-slate prose-sm">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  );
}
