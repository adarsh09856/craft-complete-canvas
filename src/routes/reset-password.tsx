import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Set a new password — Golden Takin Holidays" },
      { name: "description", content: "Choose a new password for your Golden Takin Holidays account." },
      { property: "og:title", content: "Set a new password — Golden Takin Holidays" },
      { property: "og:description", content: "Securely reset the password for your Golden Takin Holidays account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setReady(Boolean(session)));
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) { toast.error("Use at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error("Could not update password", { description: error.message }); return; }
    toast.success("Password updated");
    await navigate({ to: "/account", replace: true });
  };

  return (
    <section className="grid min-h-screen place-items-center bg-ink px-4 py-28 text-hero-foreground">
      <form onSubmit={submit} className="w-full max-w-md rounded-[26px] border border-hero-foreground/12 bg-hero-foreground/[0.07] p-7 shadow-deep backdrop-blur-2xl sm:p-9">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold text-primary-foreground"><Lock className="h-5 w-5" /></div>
        <h1 className="mt-5 font-display text-2xl font-bold">Set a new password</h1>
        <p className="mt-1.5 text-sm text-hero-foreground/62">
          {ready ? "Choose a strong password you don't use elsewhere." : "Open this page from the reset link in your email."}
        </p>
        <div className="mt-6 grid gap-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="rounded-xl border border-hero-foreground/14 bg-hero-foreground/[0.07] px-4 py-3 text-sm outline-none focus:border-gold" />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="rounded-xl border border-hero-foreground/14 bg-hero-foreground/[0.07] px-4 py-3 text-sm outline-none focus:border-gold" />
        </div>
        <button disabled={busy || !ready} className="mt-6 w-full rounded-xl bg-gradient-gold px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-gold disabled:opacity-60">
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </section>
  );
}
