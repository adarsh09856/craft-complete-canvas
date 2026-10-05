import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Sparkles, Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import trekking from "@/assets/trekking.jpg";
import { toast } from "sonner";

export const Route = createFileRoute("/plan")({
  component: PlanPage,
  head: () => ({
    meta: [
      { title: "Plan a Bhutan Trip with AI | Golden Takin Holidays" },
      { name: "description", content: "Draft a Bhutan itinerary in minutes with our AI travel assistant trained on Golden Takin Holidays' official packages, then have a local specialist price it." },
      { name: "keywords", content: "how to plan a trip to Bhutan, Bhutan itinerary 7 days, Bhutan itinerary 5 days, Bhutan travel guide" },
      { property: "og:title", content: "Plan a Bhutan Trip with AI | Golden Takin Holidays" },
      { property: "og:description", content: "Draft a Bhutan itinerary in minutes with our AI travel assistant trained on Golden Takin Holidays' official packages, then have a local specialist price it." },
    ],
  }),
});

const presets = [
  "I have 7 days and love Buddhist culture",
  "Best honeymoon itinerary in Bhutan",
  "10-day trek across the Himalayas",
  "Family trip with kids under 12",
  "Photography-focused journey",
  "Wellness & meditation retreat",
];

function PlanPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Kuzu zangpo! I'm your Bhutan travel assistant, trained on Golden Takin Holidays' own package documents. Tell me about your dream trip — duration, interests, group size — and I'll draft an itinerary." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const history = [...messages, { role: "user" as const, text: question }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-16).map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
        }),
      });
      if (!res.ok || !res.body) {
        setMessages([...history, { role: "ai", text: res.status === 429 ? "I'm getting a lot of questions right now — please try again in a moment." : "I couldn't reach the planner right now. Please message our 24/7 WhatsApp on +91-8514889385 or call +975-1797-0050 and our team will craft your itinerary directly." }]);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages([...history, { role: "ai", text: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "ai", text: acc }]);
      }
    } catch {
      setMessages([...history, { role: "ai", text: "Network hiccup — please try again." }]);
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const itinerary = messages.map((message) => `${message.role.toUpperCase()}: ${message.text}`).join("\n\n");
    const blob = new Blob([itinerary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "golden-takin-itinerary.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Itinerary downloaded");
  };


  return (
    <>
      <PageHero eyebrow="Powered by AI · refined by humans" title="Plan with AI" subtitle="Draft a tailored Bhutan itinerary in minutes, then hand it to a local specialist for pricing, permits and operational polish." image={trekking} />

      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <div className="rounded-lg border border-border bg-card p-4 shadow-card sm:p-6 md:p-8">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border pb-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground animate-pulse-gold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-3xl leading-none">Your travel assistant</div>
                <div className="mt-1 text-xs text-muted-foreground">Online · routes instantly, reviewed by a specialist</div>
              </div>
            </div>

            <div className="max-h-[440px] space-y-4 overflow-y-auto py-6 pr-1">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[86%] rounded-lg px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"}`}>{m.text}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pb-4">
              {presets.map(p => (
                <button key={p} onClick={() => send(p)} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs transition hover:border-gold hover:text-cypress">
                  {p} <ArrowRight className="h-3 w-3 text-gold" />
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-input p-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Describe your dream Bhutan trip..." className="min-w-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" />
              <button type="submit" className="grid h-10 w-10 place-items-center rounded-md bg-gradient-gold text-primary-foreground transition hover:shadow-gold">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </Reveal>

        <aside className="grid h-fit gap-3 lg:sticky lg:top-24">
          {[
            ["Routing", "Paro, Thimphu, Punakha and Phobjikha pacing"],
            ["Permits", "Visa, entry fees and regional access planning"],
            ["Review", "A Bhutanese specialist checks every draft"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5 shadow-card">
              <div className="text-[10px] uppercase tracking-[0.26em] text-cypress">{title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
          <button onClick={download} className="rounded-lg bg-gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold">Download itinerary</button>
          <button onClick={() => toast.success("Specialist connected", { description: "We saved your AI brief for follow-up." })} className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-muted">Connect with Specialist</button>
        </aside>
      </div>
    </>
  );
}
