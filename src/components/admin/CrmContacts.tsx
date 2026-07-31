import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Mail, MessageCircle, Phone, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import {
  ACTIVITY_KINDS, LIFECYCLES, PRIORITIES, SOURCES, createContact, createTask, deleteContact,
  listActivities, listContacts, listDeals, listTasks, logActivity, updateContact, updateTask,
  type Activity, type Contact, type Deal, type Task,
} from "@/lib/crm";
import { Field, Select, badge } from "./crm-ui";

const emptyContact = { full_name: "", email: "", phone: "", country: "", source: "Website", lifecycle: "Lead", tags: "", notes: "" };

export function CrmContacts() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [lifecycle, setLifecycle] = useState("All");
  const [form, setForm] = useState(emptyContact);
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [contacts, dealRows] = await Promise.all([listContacts(), listDeals()]);
      setRows(contacts);
      setDeals(dealRows);
    } catch (error) {
      toast.error("Could not load contacts", { description: (error as Error).message });
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => rows.filter((row) => {
    const matchesQuery = `${row.full_name} ${row.email ?? ""} ${row.phone ?? ""} ${row.country ?? ""} ${row.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (lifecycle === "All" || row.lifecycle === lifecycle);
  }), [rows, query, lifecycle]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.full_name.trim()) { toast.error("Enter the guest name"); return; }
    setSaving(true);
    try {
      const contact = await createContact({
        full_name: form.full_name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        country: form.country.trim() || null,
        source: form.source,
        lifecycle: form.lifecycle,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        notes: form.notes.trim(),
      });
      await logActivity({ contact_id: contact.id, kind: "Note", body: `Contact created (source: ${form.source}).` });
      toast.success(`${contact.full_name} added to CRM`);
      setForm(emptyContact);
      void load();
    } catch (error) {
      toast.error("Contact not saved", { description: (error as Error).message });
    }
    setSaving(false);
  };

  const open = rows.find((row) => row.id === openId) ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 rounded-xl border border-border bg-card shadow-card">
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-border bg-input px-3 py-2.5">
            <Search className="h-4 w-4 text-cypress" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone, country, tag" className="min-w-0 bg-transparent text-sm outline-none" />
          </label>
          <Select value={lifecycle} onChange={setLifecycle} options={["All", ...LIFECYCLES]} />
        </div>
        {loading ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Loading contacts…</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No contacts match. Add one from the form beside.</p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((row) => {
              const contactDeals = deals.filter((deal) => deal.contact_id === row.id);
              const value = contactDeals.reduce((sum, deal) => sum + deal.value_usd, 0);
              return (
                <div key={row.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <button type="button" onClick={() => setOpenId(row.id)} className="min-w-0 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg">{row.full_name}</span>
                      <span className={badge(row.lifecycle)}>{row.lifecycle}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{row.source}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {[row.email, row.phone, row.country].filter(Boolean).join(" · ") || "No contact details yet"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{contactDeals.length} deal(s) · ${value.toLocaleString()} pipeline value</p>
                  </button>
                  <div className="flex shrink-0 gap-2">
                    {row.phone && <a href={`https://wa.me/${row.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-cypress hover:bg-muted"><MessageCircle className="h-4 w-4" /></a>}
                    {row.phone && <a href={`tel:${row.phone}`} aria-label="Call" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted"><Phone className="h-4 w-4" /></a>}
                    {row.email && <a href={`mailto:${row.email}`} aria-label="Email" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted"><Mail className="h-4 w-4" /></a>}
                    <button type="button" onClick={async () => { if (!confirm(`Delete ${row.full_name}?`)) return; await deleteContact(row.id); toast.success("Contact deleted"); void load(); }} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-crimson hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <form onSubmit={submit} className="h-fit rounded-xl border border-border bg-card p-5 shadow-card xl:sticky xl:top-24">
        <h2 className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-sm font-bold uppercase tracking-[0.16em]"><UserPlus className="h-4 w-4 text-gold" /> New contact</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} placeholder="Tashi Dorji" />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="guest@email.com" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+975…" />
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} placeholder="India" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Source" value={form.source} onChange={(v) => setForm({ ...form, source: v })} options={[...SOURCES]} />
            <Select label="Lifecycle" value={form.lifecycle} onChange={(v) => setForm({ ...form, lifecycle: v })} options={[...LIFECYCLES]} />
          </div>
          <Field label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="Honeymoon, Spring 2026" />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Notes</span>
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-20 w-full resize-none rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </label>
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-5 py-3 text-sm font-bold text-primary-foreground shadow-gold disabled:opacity-60">
            <Plus className="h-4 w-4" /> {saving ? "Saving…" : "Add contact"}
          </button>
        </div>
      </form>

      {open && <ContactDrawer contact={open} deals={deals.filter((deal) => deal.contact_id === open.id)} onClose={() => setOpenId(null)} onSaved={load} />}
    </div>
  );
}

function ContactDrawer({ contact, deals, onClose, onSaved }: { contact: Contact; deals: Deal[]; onClose: () => void; onSaved: () => void }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [kind, setKind] = useState("Note");
  const [body, setBody] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState("Normal");
  const [lifecycle, setLifecycle] = useState(contact.lifecycle);

  const refresh = async () => {
    const [acts, allTasks] = await Promise.all([listActivities(contact.id), listTasks()]);
    setActivities(acts);
    setTasks(allTasks.filter((task) => task.contact_id === contact.id));
  };

  useEffect(() => { void refresh(); }, [contact.id]);

  const addActivity = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    await logActivity({ contact_id: contact.id, kind, body: body.trim() });
    setBody("");
    toast.success("Activity logged");
    void refresh();
  };

  const addTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    await createTask({ contact_id: contact.id, title: taskTitle.trim(), due_on: taskDue || null, priority: taskPriority });
    setTaskTitle(""); setTaskDue("");
    toast.success("Follow-up added");
    void refresh();
  };

  const saveLifecycle = async (value: string) => {
    setLifecycle(value);
    await updateContact(contact.id, { lifecycle: value });
    await logActivity({ contact_id: contact.id, kind: "Note", body: `Lifecycle moved to ${value}.` });
    toast.success(`Lifecycle → ${value}`);
    onSaved();
    void refresh();
  };

  return (
    <div className="fixed inset-0 z-50 grid bg-ink/70 p-0 backdrop-blur-sm sm:place-items-end">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-card p-5 shadow-deep sm:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-2xl">{contact.full_name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{[contact.email, contact.phone, contact.country].filter(Boolean).join(" · ") || "No contact details"}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {contact.tags.map((tag) => <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">{tag}</span>)}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg border border-border"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-4 max-w-[220px]"><Select label="Lifecycle stage" value={lifecycle} onChange={saveLifecycle} options={[...LIFECYCLES]} /></div>

        {contact.notes && <p className="mt-4 rounded-xl border border-border bg-muted/40 p-3 text-sm">{contact.notes}</p>}

        <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Deals ({deals.length})</h3>
        <div className="mt-2 grid gap-2">
          {deals.length === 0 ? <p className="text-sm text-muted-foreground">No deals yet — create one in the Pipeline tab.</p> : deals.map((deal) => (
            <div key={deal.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border p-3">
              <div className="min-w-0"><p className="truncate text-sm font-semibold">{deal.title}</p><p className="text-xs text-muted-foreground">{deal.tour_name} · {deal.travelers} pax · ${deal.value_usd.toLocaleString()}</p></div>
              <span className={badge(deal.stage)}>{deal.stage}</span>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Follow-ups</h3>
        <form onSubmit={addTask} className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Send Bumthang quote" className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold" />
          <div className="flex gap-2">
            <input type="date" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none" />
            <select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value)} className="rounded-lg border border-border bg-input px-2 py-2.5 text-sm outline-none">{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
            <button className="rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground">Add</button>
          </div>
        </form>
        <div className="mt-2 grid gap-2">
          {tasks.map((task) => (
            <label key={task.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3 text-sm">
              <input type="checkbox" checked={task.done} onChange={async () => { await updateTask(task.id, { done: !task.done }); void refresh(); }} />
              <span className={task.done ? "line-through text-muted-foreground" : ""}>{task.title}</span>
              <span className="text-xs text-muted-foreground">{task.due_on ?? "no date"} · {task.priority}</span>
            </label>
          ))}
        </div>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Activity timeline</h3>
        <form onSubmit={addActivity} className="mt-2 grid gap-2">
          <div className="flex gap-2">
            <select value={kind} onChange={(event) => setKind(event.target.value)} className="rounded-lg border border-border bg-input px-2 py-2.5 text-sm outline-none">{ACTIVITY_KINDS.map((k) => <option key={k}>{k}</option>)}</select>
            <input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Called guest — wants March dates" className="min-w-0 flex-1 rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold" />
            <button className="rounded-lg bg-gradient-gold px-3 py-2.5 text-xs font-bold text-primary-foreground">Log</button>
          </div>
        </form>
        <ol className="mt-3 grid gap-3 border-l border-border pl-4">
          {activities.map((activity) => (
            <li key={activity.id} className="relative text-sm">
              <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-gold" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{activity.kind} · {new Date(activity.created_at).toLocaleString()}</p>
              <p className="mt-0.5">{activity.body}</p>
            </li>
          ))}
          {activities.length === 0 && <li className="text-sm text-muted-foreground">Nothing logged yet.</li>}
        </ol>
      </div>
    </div>
  );
}
