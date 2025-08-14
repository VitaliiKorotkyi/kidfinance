// src/components/AuthBar.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthBar({ onSession }: { onSession: (s: any)=>void }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => onSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => onSession(session));
    return () => sub?.subscription.unsubscribe();
  }, [onSession]);

  if (!supabase) {
    return (
      <div className="text-xs text-slate-500">
        Cloud sync off (missing env). App works locally without auth.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="rounded border px-2 py-1 text-sm"
        placeholder="email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />
      <button
        className="rounded border px-3 py-1 text-sm"
        onClick={async () => {
          if (!email.trim()) return;
          const { error } = await supabase.auth.signInWithOtp({ email });
          if (error) alert(error.message);
          else alert("Magic link sent. Check your email.");
        }}
      >
        Sign in
      </button>
      <button
        className="rounded border px-3 py-1 text-sm"
        onClick={async () => { await supabase!.auth.signOut(); }}
      >
        Sign out
      </button>
    </div>
  );
}
