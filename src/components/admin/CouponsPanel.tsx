import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Tag, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Coupon } from "@/lib/coupons";

const empty = { code: "", label: "", discount_percent: 10, discount_flat: 0, min_travelers: 1, expires_on: "" };

export function CouponsPanel() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) { toast.error("Could not load coupons", { description: error.message }); return; }
    setRows((data ?? []) as Coupon[]);
  };

  useEffect(() => { void load(); }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!code) { toast.error("Enter a coupon code"); return; }
    setSaving(true);
    const { error } = await supabase.from("coupons").insert({
      code,
      label: form.label.trim(),
      discount_percent: Number(form.discount_percent) || 0,
      discount_flat: Number(form.discount_flat) || 0,
      min_travelers: Number(form.min_travelers) || 1,
      expires_on: form.expires_on || null,
    });
    setSaving(false);
    if (error) { toast.error("Coupon not saved", { description: error.message }); return; }
    toast.success(`Coupon ${code} created`);
    setForm(empty);
    void load();
  };

  const toggle = async (coupon: Coupon) => {
    const { error } = await supabase.from("coupons").update({ active: !coupon.active }).eq("id", coupon.id);
    if (error) { toast.error("Could not update coupon", { description: error.message }); return; }
    void load();
  };

  const remove = async (coupon: Coupon) => {
    const { error } = await supabase.from("coupons").delete().eq("id", coupon.id);
    if (error) { toast.error("Could not delete coupon", { description: error.message }); return; }
    toast.success("Coupon deleted");
    void load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border px-5 py-4">
          <Tag className="h-4 w-4 text-gold" />
          <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Active promo codes</h2>
        </div>
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">Loading coupons…</p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">No coupons yet — create your first one.</p>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((coupon) => (
              <div key={coupon.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-gradient-gold">{coupon.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${coupon.active ? "bg-cypress/15 text-cypress" : "bg-muted text-muted-foreground"}`}>{coupon.active ? "Active" : "Paused"}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{coupon.label || "—"}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {coupon.discount_percent > 0 && `${coupon.discount_percent}% off`}
                    {coupon.discount_percent > 0 && coupon.discount_flat > 0 && " + "}
                    {coupon.discount_flat > 0 && `$${coupon.discount_flat} off`}
                    {` · min ${coupon.min_travelers} traveller(s)`}
                    {coupon.expires_on ? ` · expires ${coupon.expires_on}` : " · no expiry"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => toggle(coupon)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:bg-muted">{coupon.active ? "Pause" : "Activate"}</button>
                  <button type="button" onClick={() => remove(coupon)} aria-label={`Delete ${coupon.code}`} className="grid h-9 w-9 place-items-center rounded-lg border border-border text-crimson transition hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={create} className="h-fit rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">New coupon</h2>
        <div className="mt-4 grid gap-3">
          <Input label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v.toUpperCase() })} placeholder="GTH10" />
          <Input label="Description" value={form.label} onChange={(v) => setForm({ ...form, label: v })} placeholder="Welcome offer — 10% off" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Percent off" type="number" value={String(form.discount_percent)} onChange={(v) => setForm({ ...form, discount_percent: Number(v) })} />
            <Input label="Flat off (USD)" type="number" value={String(form.discount_flat)} onChange={(v) => setForm({ ...form, discount_flat: Number(v) })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min travellers" type="number" value={String(form.min_travelers)} onChange={(v) => setForm({ ...form, min_travelers: Number(v) })} />
            <Input label="Expires on" type="date" value={form.expires_on} onChange={(v) => setForm({ ...form, expires_on: v })} />
          </div>
          <button type="submit" disabled={saving} className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-5 py-3 text-sm font-bold text-primary-foreground shadow-gold disabled:opacity-60">
            <Plus className="h-4 w-4" /> {saving ? "Saving…" : "Create coupon"}
          </button>
          <p className="text-[11px] text-muted-foreground">Guests enter the code on any tour booking panel; the discount is applied to their quote instantly.</p>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none transition focus:border-gold" />
    </label>
  );
}
