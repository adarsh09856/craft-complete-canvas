import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import {
  STAGES, createDeal, deleteDeal, listContacts, listDeals, logActivity, stageProbability, updateDeal,
  type Contact, type Deal,
} from "@/lib/crm";
import { tours } from "@/lib/data";
import { Field, Select, badge } from "./crm-ui";

export function CrmPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contact_id: "", tour_name: tours[0]?.title ?? "", value_usd: "", travelers: "2", travel_date: "", stage: "New" as string, notes: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [dealRows, contactRows] = await Promise.all([listDeals(), listContacts()]);
      setDeals(dealRows);
      setContacts(contactRows);
    } catch (error) {
      toast.error("Could not load pipeline", { description: (error as Error).message });
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const contactName = (id: string | null) => contacts.find((contact) => contact.id === id)?.full_name ?? "Unassigned";

  const move = async (deal: Deal, direction: -1 | 1) => {
    const index = STAGES.indexOf(deal.stage as (typeof STAGES)[number]);
    const next = STAGES[Math.min(STAGES.length - 1, Math.max(0, index + direction))];
    if (!next || next === deal.stage) return;
    await updateDeal(deal.id, { stage: next, probability: stageProbability(next) });
    await logActivity({ contact_id: deal.contact_id, deal_id: deal.id, kind: "Stage", body: `Deal moved ${deal.stage} → ${next}.` });
    toast.success(`${deal.title} → ${next}`);
    void load();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.contact_id) { toast.error("Pick a contact first"); return; }
    try {
      const deal = await createDeal({
        contact_id: form.contact_id,
        title: `${contactName(form.contact_id)} · ${form.tour_name}`,
        tour_name: form.tour_name,
        stage: form.stage,
        value_usd: Number(form.value_usd) || 0,
        travelers: Number(form.travelers) || 1,
        travel_date: form.travel_date || null,
        probability: stageProbability(form.stage),
        notes: form.notes,
      });
      await logActivity({ contact_id: form.contact_id, deal_id: deal.id, kind: "Note", body: `Deal created for ${form.tour_name}.` });
      toast.success("Deal added to pipeline");
      setShowForm(false);
      setForm({ ...form, value_usd: "", travel_date: "", notes: "" });
      void load();
    } catch (error) {
      toast.error("Deal not saved", { description: (error as Error).message });
    }
  };

  const totals = useMemo(() => {
    const open = deals.filter((deal) => !["Lost", "Travelled"].includes(deal.stage));
    return {
      openValue: open.reduce((sum, deal) => sum + deal.value_usd, 0),
      weighted: open.reduce((sum, deal) => sum + (deal.value_usd * deal.probability) / 100, 0),
      won: deals.filter((deal) => ["Confirmed", "Travelled"].includes(deal.stage)).reduce((sum, deal) => sum + deal.value_usd, 0),
    };
  }, [deals]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Open pipeline" value={`$${totals.openValue.toLocaleString()}`} />
        <Stat label="Weighted forecast" value={`$${Math.round(totals.weighted).toLocaleString()}`} />
        <Stat label="Won value" value={`$${totals.won.toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="text-sm text-muted-foreground">{deals.length} deal(s) across {STAGES.length} stages</p>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-gold">
          <Plus className="h-4 w-4" /> New deal
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="grid gap-3 rounded-xl border border-border bg-card p-5 shadow-card sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Contact</span>
            <select value={form.contact_id} onChange={(event) => setForm({ ...form, contact_id: event.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold">
              <option value="">Select a guest…</option>
              {contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.full_name}</option>)}
            </select>
          </label>
          <Select label="Package" value={form.tour_name} onChange={(v) => setForm({ ...form, tour_name: v })} options={tours.map((tour) => tour.title)} />
          <Select label="Stage" value={form.stage} onChange={(v) => setForm({ ...form, stage: v })} options={[...STAGES]} />
          <Field label="Deal value (USD)" type="number" value={form.value_usd} onChange={(v) => setForm({ ...form, value_usd: v })} placeholder="4200" />
          <Field label="Travellers" type="number" value={form.travelers} onChange={(v) => setForm({ ...form, travelers: v })} />
          <Field label="Travel date" type="date" value={form.travel_date} onChange={(v) => setForm({ ...form, travel_date: v })} />
          <div className="sm:col-span-3">
            <Field label="Notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="Wants Amankora upgrade in Punakha" />
          </div>
          <button className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground sm:col-span-3">Save deal</button>
          {contacts.length === 0 && <p className="text-xs text-crimson sm:col-span-3">Add a contact first — deals must belong to a guest.</p>}
        </form>
      )}

      {loading ? (
        <p className="p-10 text-center text-sm text-muted-foreground">Loading pipeline…</p>
      ) : (
        <div className="grid gap-4 overflow-x-auto pb-2 lg:grid-flow-col lg:auto-cols-[minmax(240px,1fr)]">
          {STAGES.map((stage) => {
            const column = deals.filter((deal) => deal.stage === stage);
            return (
              <div key={stage} className="min-w-[240px] rounded-xl border border-border bg-muted/30 p-3">
                <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <span className={badge(stage)}>{stage}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{column.length} · ${column.reduce((sum, deal) => sum + deal.value_usd, 0).toLocaleString()}</span>
                </div>
                <div className="grid gap-2">
                  {column.map((deal) => (
                    <article key={deal.id} className="rounded-xl border border-border bg-card p-3 shadow-card">
                      <p className="truncate text-sm font-bold">{contactName(deal.contact_id)}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{deal.tour_name}</p>
                      <p className="mt-1 text-xs">${deal.value_usd.toLocaleString()} · {deal.travelers} pax {deal.travel_date ? `· ${deal.travel_date}` : ""}</p>
                      {deal.notes && <p className="mt-1 text-[11px] text-muted-foreground">{deal.notes}</p>}
                      <div className="mt-2 flex items-center gap-1.5">
                        <button type="button" onClick={() => move(deal, -1)} aria-label="Move back" className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-muted"><ChevronLeft className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => move(deal, 1)} aria-label="Move forward" className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-muted"><ChevronRight className="h-3.5 w-3.5" /></button>
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{deal.probability}%</span>
                        <button type="button" onClick={async () => { if (!confirm("Delete this deal?")) return; await deleteDeal(deal.id); toast.success("Deal deleted"); void load(); }} aria-label="Delete deal" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-crimson hover:bg-muted"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </article>
                  ))}
                  {column.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">Empty</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-bold text-primary">{value}</div>
    </div>
  );
}
