// src/components/AuthBar.tsx
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export default function AuthBar({ onSession }: { onSession: (s: Session | null) => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [mode, setMode]   = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Инициализация сессии и подписка на изменения
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      onSession(data.session ?? null);
      setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      onSession(s ?? null);
      setUserEmail(s?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [onSession]);

  async function doSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setEmail(""); setPass("");
    }
  }

  async function doSignUp() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
    // Если включено подтверждение email — сессии не будет до клика по письму
    if (!data.session) {
      alert("Check your email to confirm registration.");
    } else {
      setEmail(""); setPass("");
    }
  }

  async function doSignOut() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) { console.error(error); alert(error.message); }
  }

  if (userEmail) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">{userEmail}</span>
        <button className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50" onClick={doSignOut} disabled={loading}>
          {loading ? "…" : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="rounded-xl border px-2 py-1 text-sm"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="rounded-xl border px-2 py-1 text-sm"
        type="password"
        placeholder="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button
        className={`rounded-xl border px-3 py-1 text-sm hover:bg-slate-50 ${mode==="signin" ? "bg-slate-900 text-white" : ""}`}
        onClick={() => setMode("signin")}
      >
        Sign in
      </button>
      <button
        className={`rounded-xl border px-3 py-1 text-sm hover:bg-slate-50 ${mode==="signup" ? "bg-slate-900 text-white" : ""}`}
        onClick={() => setMode("signup")}
      >
        Sign up
      </button>
      <button
        className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
        onClick={mode === "signin" ? doSignIn : doSignUp}
        disabled={loading || !email || !pass}
        title={mode === "signin" ? "Sign in" : "Create account"}
      >
        {loading ? "…" : (mode === "signin" ? "Go" : "Create")}
      </button>
    </div>
  );
}
