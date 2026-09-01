import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { BadgeCheck, Languages, Phone, Plus, Trash2 } from "lucide-react";
import { createGuide, deleteGuide, listGuides, updateGuide, type Guide } from "@/lib/tourism";
import { Field } from "./crm-ui";

const empty = { full_name: "", phone: "", email: "", languages: "English", specialities: "", licence_no: "", day_rate_usd: "" };

export function GuidesPanel() {
  const [rows, setRows] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try { setRows(await listGuides()); }
    catch (error) { toast.error("Could not load guides", { description: (error as Error).message }); }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const split = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.full_name.trim()) { toast.error("Guide name required"); return; }
    try {
      await createGuide({
        full_name: form.full_name.trim(),
        phone: form.phone || null,
        email: form.email || null,
        languages: split(form.languages),
        specialities: split(form.specialities),
        licence_no: form.licence_no || null,
        day_rate_usd: Number(form.day_rate_usd || 0),
      });
      toast.success("Guide added to the roster");
      setForm(empty);
      void load();
    } catch (error) {
      toast.error("Guide not saved", { description: (error as Error).message });
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={submit} className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-display text-xl font-bold">Add a guide</h2>
        <div className="grid gap-3">
          <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} placeholder="Sonam Wangchuk" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+975…" />
            <Field label="Licence no." value={form.licence_no} onChange={(v) => setForm({ ...form, licence_no: v })} placeholder="TCB-0000" />
          </div>
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Languages (comma separated)" value={form.languages} onChange={(v) => setForm({ ...form, languages: v })} placeholder="English, Hindi, Dzongkha" />
          <Field label="Specialities (comma separated)" value={form.specialities} onChange={(v) => setForm({ ...form, specialities: v })} placeholder="Trekking, Birding, Culture" />
          <Field label="Day rate (USD)" type="number" value={form.day_rate_usd} onChange={(v) => setForm({ ...form, day_rate_usd: v })} placeholder="45" />
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-3 text-sm font-bold text-primary-foreground shadow-gold"><Plus className="h-4 w-4" /> Add guide</button>
        </div>
      </form>

      <div className="grid gap-3">
        {loading ? <p className="p-10 text-center text-sm text-muted-foreground">Loading roster…</p> : rows.map((guide) => (
          <article key={guide.id} className="hover-lift grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold">{guide.full_name}</p>
                {guide.licence_no && <span className="inline-flex items-center gap-1 rounded-full bg-cypress/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cypress"><BadgeCheck className="h-3 w-3" /> {guide.licence_no}</span>}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Languages className="h-3 w-3" /> {guide.languages.join(", ") || "—"}</span>
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {guide.phone ?? "—"}</span>
                <span>${guide.day_rate_usd}/day</span>
              </p>
              {guide.specialities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {guide.specialities.map((tag) => <span key={tag} className="rounded-full bg-gold/12 px-2 py-0.5 text-[10px] font-semibold text-clay">{tag}</span>)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={async () => { await updateGuide(guide.id, { active: !guide.active }); void load(); }} className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${guide.active ? "border-cypress/40 bg-cypress/12 text-cypress" : "border-border text-muted-foreground hover:bg-muted"}`}>
                {guide.active ? "Available" : "Off duty"}
              </button>
              <button type="button" aria-label="Delete guide" onClick={async () => { await deleteGuide(guide.id); toast.success("Guide removed"); void load(); }} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-crimson hover:bg-muted">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
        {!loading && rows.length === 0 && <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">No guides yet — build your roster on the left.</p>}
      </div>
    </div>
  );
}
