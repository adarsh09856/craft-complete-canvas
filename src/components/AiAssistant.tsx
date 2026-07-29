import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, X, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Best time to visit Bhutan?",
  "Which package suits a family with kids?",
  "Do Indian travellers need a visa?",
  "Plan a 6-day cultural trip",
];

const GREETING =
  "Kuzuzangpo la! I'm the Golden Takin Holidays assistant. Ask me about our 15 Bhutan packages, visas and permits, the best season to travel, or what to expect on the ground.";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const scroller = useRef<HTMLDivElement>(null);
  const sendRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const text = (event as CustomEvent<string>).detail;
      setOpen(true);
      if (typeof text === "string" && text.trim()) void sendRef.current?.(text);
    };
    window.addEventListener("gth:ask-assistant", handler);
    return () => window.removeEventListener("gth:ask-assistant", handler);
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-16) }),
      });
      if (!res.ok || !res.body) {
        const detail = res.status === 429 ? "Too many requests — please try again in a moment." : res.status === 402 ? "The assistant is temporarily out of credits. Please use WhatsApp or the contact form." : "Sorry, I couldn't reach the assistant. Please try the contact page or WhatsApp.";
        setMessages([...next, { role: "assistant", content: detail }]);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Network hiccup — please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  sendRef.current = send;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close travel assistant" : "Open travel assistant"}
        className="fixed bottom-24 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-card transition hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed inset-x-3 bottom-40 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:inset-x-auto sm:right-5 sm:w-[400px]">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border bg-muted/60 px-4 py-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-gold text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Bhutan Travel Assistant</div>
              <div className="truncate text-[11px] text-muted-foreground">Trained on our official package documents</div>
            </div>
          </div>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto whitespace-pre-wrap bg-gradient-gold text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "user" ? (
                  m.content || "…"
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>,
                      strong: ({ children }) => <span className="font-semibold text-foreground">{children}</span>,
                      a: ({ href, children }) => (
                        <a href={href} className="font-semibold text-saffron underline underline-offset-2">{children}</a>
                      ),
                    }}
                  >
                    {m.content || "…"}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-[11px] transition hover:border-gold hover:text-gold"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about packages, visas, seasons…"
              className="min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-gold text-primary-foreground disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
