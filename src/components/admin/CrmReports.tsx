import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { STAGES, convertInquiry, listActivities, listDeals, listInquiries, type Activity, type Deal, type Inquiry } from "@/lib/crm";
import { badge } from "./crm-ui";

export function CrmReports() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [dealRows, activityRows, inquiryRows] = await Promise.all([listDeals(), listActivities(), listInquiries()]);
      setDeals(dealRows);
      setActivities(activityRows);
      setInquiries(inquiryRows);
    } catch (error) {
      toast.error("Could not load reports", { description: (error as Error).message });
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const byStage = useMemo(() => STAGES.map((stage) => {
    const list = deals.filter((deal) => deal.stage === stage);
    return { stage, count: list.length, value: list.reduce((sum, deal) => sum + deal.value_usd, 0) };
  }), [deals]);

  const max = Math.max(1, ...byStage.map((row) => row.value));
  const unconverted = inquiries.filter((inquiry) => !inquiry.deal_id);
  const won = deals.filter((deal) => ["Confirmed", "Travelled"].includes(deal.stage));
  const winRate = deals.length ? Math.round((won.length / deals.length) * 100) : 0;

  if (loading) return <p className="p-10 text-center text-sm text-muted-foreground">Building reports…</p>;

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Deals", value: deals.length },
          { label: "Win rate", value: `${winRate}%` },
          { label: "Won value", value: `$${won.reduce((sum, deal) => sum + deal.value_usd, 0).toLocaleString()}` },
          { label: "Website inquiries", value: inquiries.length },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{card.label}</div>
            <div className="mt-2 text-2xl font-bold text-primary">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display text-lg font-bold">Pipeline value by stage</h3>
          <div className="grid gap-3">
            {byStage.map((row) => (
              <div key={row.stage}>
                <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto] text-xs">
                  <span className="font-semibold">{row.stage} · {row.count}</span>
                  <span className="text-muted-foreground">${row.value.toLocaleString()}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-gold" style={{ width: `${(row.value / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display text-lg font-bold">Unconverted website inquiries</h3>
          <div className="grid gap-2">
            {unconverted.map((inquiry) => (
              <article key={inquiry.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{inquiry.guest_name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{inquiry.tour_name} · {inquiry.travelers} pax · {inquiry.travel_date ?? "flexible"}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try { await convertInquiry(inquiry); toast.success("Converted into a deal"); void load(); }
                    catch (error) { toast.error("Conversion failed", { description: (error as Error).message }); }
                  }}
                  className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
                >
                  Convert
                </button>
              </article>
            ))}
            {unconverted.length === 0 && <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">All inquiries converted</p>}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-4 font-display text-lg font-bold">Activity timeline</h3>
        <div className="grid gap-2">
          {activities.slice(0, 25).map((activity) => (
            <div key={activity.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-2 last:border-0">
              <span className={badge(activity.kind)}>{activity.kind}</span>
              <p className="min-w-0 truncate text-sm">{activity.body}</p>
              <span className="text-[11px] text-muted-foreground">{new Date(activity.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {activities.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No activity logged yet</p>}
        </div>
      </section>
    </div>
  );
}
