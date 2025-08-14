import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthBar({ onSession }: { onSession: (s: any) => void }) {
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<any>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      onSession(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      onSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [onSession]);

  async function signInOtp() {
    if (!email) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setSending(false);
    if (error) alert(error.message);
    else alert("Check your inbox for the magic link ✉️");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex items-center gap-2">
      {session ? (
        <>
          <span className="text-sm text-slate-600">
            {session.user.email}
          </span>
          <button className="rounded-xl border px-3 py-1 text-sm"
                  onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <input className="rounded-xl border px-2 py-1 text-sm"
                 placeholder="you@email.com"
                 value={email}
                 onChange={e => setEmail(e.target.value)} />
          <button className="rounded-xl border px-3 py-1 text-sm"
                  disabled={sending}
                  onClick={signInOtp}>
            {sending ? "Sending…" : "Sign in"}
          </button>
        </>
      )}
    </div>
  );
}
