import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signin" | "signup" | "reset";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — Golden Takin Holidays" },
      { name: "description", content: "Sign in to your Golden Takin Holidays account to manage your Bhutan trip requests, or access the staff CRM." },
      { property: "og:title", content: "Sign in — Golden Takin Holidays" },
      { property: "og:description", content: "Guest and staff access to Golden Takin Holidays trip management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search }) as { redirect?: string };
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const target = typeof search?.redirect === "string" && search.redirect.startsWith("/") ? search.redirect : "/account";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: target, replace: true });
    });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success("Welcome back");
        await navigate({ to: target, replace: true });
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/auth", data: { full_name: fullName.trim() } },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created");
          await navigate({ to: target, replace: true });
        } else {
          setSent(true);
          toast.success("Check your email to confirm your account");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setSent(true);
        toast.success("Password reset link sent");
      }
    } catch (error) {
      toast.error("Could not continue", { description: (error as Error).message });
    }
    setBusy(false);
  };

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-28 text-hero-foreground">
      <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-gold/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-cypress/20 blur-[130px]" />

      <div className="relative w-full max-w-[980px] overflow-hidden rounded-[28px] border border-hero-foreground/12 bg-hero-foreground/[0.06] shadow-deep backdrop-blur-2xl lg:grid lg:grid-cols-[1.05fr_1fr]">
        <div className="hidden flex-col justify-between gap-8 border-r border-hero-foreground/10 p-10 lg:flex">
          <div>
            <div className="text-[11px] uppercase tracking-[0.32em] text-gold">Golden Takin Holidays</div>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight">
              Your Bhutan journey,<br /> beautifully organised.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-hero-foreground/70">
              Track every trip request, revise traveller counts and dates, and talk to your specialist — all from one private dashboard.
            </p>
          </div>
          <ul className="grid gap-3 text-sm text-hero-foreground/78">
            {["Live status on each trip request", "Edit dates, guests and packages anytime", "Staff CRM for the operations team"].map((line) => (
              <li key={line} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-gold" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="p-7 sm:p-10">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-hero-foreground/12 bg-hero-foreground/[0.06] p-1">
            {(["signin", "signup"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => { setMode(value); setSent(false); }}
                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === value ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-hero-foreground/70 hover:text-hero-foreground"}`}
              >
                {value === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold">
            {mode === "reset" ? "Reset your password" : mode === "signup" ? "Create your account" : "Sign in to continue"}
          </h2>
          <p className="mt-1.5 text-sm text-hero-foreground/62">
            {mode === "reset" ? "We'll email you a secure link to set a new password." : "Guests manage trip requests. Staff get the CRM."}
          </p>

          <div className="mt-6 grid gap-3">
            {mode === "signup" && (
              <GlassInput icon={<User className="h-4 w-4" />} label="Full name" value={fullName} onChange={setFullName} placeholder="Karma Dorji" required />
            )}
            <GlassInput icon={<Mail className="h-4 w-4" />} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" required />
            {mode !== "reset" && (
              <GlassInput icon={<Lock className="h-4 w-4" />} label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" required />
            )}
          </div>

          {sent && (
            <div className="mt-4 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-hero-foreground/85">
              Check <b>{email}</b> and open the link we just sent to finish.
            </div>
          )}

          <button disabled={busy} className="mt-6 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl bg-gradient-gold px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-gold transition hover:brightness-105 disabled:opacity-60">
            <span>{busy ? "Please wait…" : mode === "reset" ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}</span>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </button>

          <div className="mt-4 grid gap-2 text-center text-xs text-hero-foreground/60">
            {mode !== "reset" ? (
              <button type="button" onClick={() => { setMode("reset"); setSent(false); }} className="text-gold hover:underline">Forgot your password?</button>
            ) : (
              <button type="button" onClick={() => { setMode("signin"); setSent(false); }} className="text-gold hover:underline">Back to sign in</button>
            )}
            <Link to="/" className="hover:text-hero-foreground">← Back to the website</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

function GlassInput({ icon, label, value, onChange, type = "text", placeholder, required }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-hero-foreground/58">{label}</span>
      <span className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-hero-foreground/14 bg-hero-foreground/[0.07] px-3.5 py-3 transition focus-within:border-gold">
        <span className="text-gold">{icon}</span>
        <input
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 bg-transparent text-sm text-hero-foreground outline-none placeholder:text-hero-foreground/35"
        />
      </span>
    </label>
  );
}
