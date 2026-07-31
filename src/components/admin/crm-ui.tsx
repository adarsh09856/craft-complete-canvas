export function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none transition focus:border-gold" />
    </label>
  );
}

export function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none transition focus:border-gold">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

const tone: Record<string, string> = {
  New: "bg-muted text-muted-foreground",
  Lead: "bg-muted text-muted-foreground",
  Qualified: "bg-gold/15 text-gold",
  Engaged: "bg-gold/15 text-gold",
  Quoted: "bg-saffron/15 text-saffron",
  Confirmed: "bg-cypress/15 text-cypress",
  Customer: "bg-cypress/15 text-cypress",
  Travelled: "bg-primary/15 text-primary",
  Repeat: "bg-primary/15 text-primary",
  Lost: "bg-crimson/15 text-crimson",
};

export const badge = (value: string) =>
  `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone[value] ?? "bg-muted text-muted-foreground"}`;
