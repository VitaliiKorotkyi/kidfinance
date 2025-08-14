import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthBar({ onSession }: { onSession: (s: any)=>void }) {
  const [email, setEmail] = useState("");

  // Подхватываем сессию и слушаем изменения
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => onSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => onSession(s));
    return () => sub?.subscription.unsubscribe();
  }, [onSession]);

  async function signIn() {
    if (!supabase) { alert("Cloud auth is disabled (env missing)"); return; }
    const redirectTo = window.location.origin; // прод/превью/локал — всегда правильный хост
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo }
    });
    if (error) alert(error.message);
    else alert("Check your inbox for the magic link ✉️");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  // Примитивная панель
  return (
    <div className="flex items-center gap-2">
      <input
        placeholder="you@email.com"
        className="rounded-xl border px-3 py-1 text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <button className="rounded-xl border px-3 py-1 text-sm" onClick={signIn}>
        Sign in
      </button>
      <button className="rounded-xl border px-3 py-1 text-sm" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}
