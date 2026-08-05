import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check, Plus, Trash2 } from "lucide-react";
import { PRIORITIES, createTask, deleteTask, listContacts, listTasks, updateTask, type Contact, type Task } from "@/lib/crm";
import { Field, Select } from "./crm-ui";

export function CrmTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", due_on: "", priority: "Normal", contact_id: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [taskRows, contactRows] = await Promise.all([listTasks(), listContacts()]);
      setTasks(taskRows);
      setContacts(contactRows);
    } catch (error) {
      toast.error("Could not load tasks", { description: (error as Error).message });
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) { toast.error("Task title required"); return; }
    try {
      await createTask({ title: form.title.trim(), due_on: form.due_on || null, priority: form.priority, contact_id: form.contact_id || null });
      toast.success("Follow-up added");
      setForm({ title: "", due_on: "", priority: "Normal", contact_id: "" });
      void load();
    } catch (error) {
      toast.error("Task not saved", { description: (error as Error).message });
    }
  };

  const groups = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      overdue: tasks.filter((task) => !task.done && task.due_on && task.due_on < today),
      today: tasks.filter((task) => !task.done && task.due_on === today),
      upcoming: tasks.filter((task) => !task.done && (!task.due_on || task.due_on > today)),
      done: tasks.filter((task) => task.done),
    };
  }, [tasks]);

  const contactName = (id: string | null) => contacts.find((contact) => contact.id === id)?.full_name ?? "—";

  const row = (task: Task) => (
    <article key={task.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
      <button
        type="button"
        onClick={async () => { await updateTask(task.id, { done: !task.done }); void load(); }}
        aria-label="Toggle complete"
        className={`grid h-8 w-8 place-items-center rounded-lg border transition ${task.done ? "border-cypress bg-cypress/15 text-cypress" : "border-border hover:bg-muted"}`}
      >
        <Check className="h-4 w-4" />
      </button>
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${task.done ? "text-muted-foreground line-through" : ""}`}>{task.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{contactName(task.contact_id)} · {task.due_on ?? "no date"} · {task.priority}</p>
      </div>
      <button type="button" onClick={async () => { await deleteTask(task.id); toast.success("Task deleted"); void load(); }} aria-label="Delete task" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-crimson hover:bg-muted">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </article>
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <form onSubmit={submit} className="h-fit rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-display text-xl font-bold">New follow-up</h2>
        <div className="grid gap-3">
          <Field label="Task" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Call about Punakha upgrade" />
          <Field label="Due date" type="date" value={form.due_on} onChange={(v) => setForm({ ...form, due_on: v })} />
          <Select label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={[...PRIORITIES]} />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Contact</span>
            <select value={form.contact_id} onChange={(e) => setForm({ ...form, contact_id: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold">
              <option value="">Unassigned</option>
              {contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.full_name}</option>)}
            </select>
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-3 text-sm font-bold text-primary-foreground shadow-gold"><Plus className="h-4 w-4" /> Add task</button>
        </div>
      </form>

      <div className="grid gap-5">
        {loading ? <p className="p-10 text-center text-sm text-muted-foreground">Loading tasks…</p> : (
          [["Overdue", groups.overdue], ["Due today", groups.today], ["Upcoming", groups.upcoming], ["Completed", groups.done]] as const
        ).map(([label, list]) => (
          <section key={label}>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label} · {list.length}</h3>
            <div className="grid gap-2">
              {list.map(row)}
              {list.length === 0 && <p className="rounded-xl border border-dashed border-border py-5 text-center text-xs text-muted-foreground">Nothing here</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
