import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Sparkles, Minimize2 } from "lucide-react";
import { machines } from "@/lib/mock";

type Msg = { role: "user" | "ai"; text: string; source?: string; link?: "/dashboard/details" | "/" };

function answer(q: string): Msg {
  const t = q.toLowerCase();
  if (t.includes("most energy") || t.includes("paling")) {
    const m = [...machines].sort((a, b) => b.kwh - a.kwh)[0]!;
    return { role: "ai", text: `${m.name} (${m.id}) used the most energy: ${m.kwh.toLocaleString()} kWh.`, source: `${m.id} · kWh · last 30 days`, link: "/" };
  }
  if (t.includes("temperature") || t.includes("48")) {
    return { role: "ai", text: "Chiller 02 (CHL-02) is likely to exceed the 85 °C limit within 48 hours (forecast 86.9 °C).", source: "CHL-02 · Temperature · forecast next 48 h", link: "/dashboard/details" };
  }
  if (t.includes("rul") || t.includes("life")) {
    const low = machines.filter((m) => m.rul < 90).map((m) => `${m.id} (${m.rul} d)`).join(", ");
    return { role: "ai", text: `Machines with RUL under 90 days: ${low}.`, source: "All machines · RUL estimate · today", link: "/dashboard/details" };
  }
  if (t.includes("health") || t.includes("degrading") || t.includes("kesehatan")) {
    const degrading = machines.filter((m) => m.health < 60).map((m) => `${m.name} (${m.health})`).join(", ");
    return { role: "ai", text: `Machines with health below 60: ${degrading}.`, source: "All machines · Health score · today", link: "/dashboard/details" };
  }
  if (t.includes("alert") || t.includes("peringatan")) {
    return { role: "ai", text: "There are 3 active alerts: CHL-02 temperature critical, CMP-01 vibration predictive warning, and PMP-04 current forecast warning.", source: "Alert Logs · today", link: "/" };
  }
  return { role: "ai", text: "I don't have data to answer that yet. Try asking about energy use, temperature forecasts, machine health, or remaining life." };
}

const suggestions = [
  "Which machine used the most energy?",
  "Temperature forecast for 48h?",
  "Which machines have low RUL?",
  "Show degrading machines",
];

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! 👋 I'm your EnergyIQ assistant. Ask me about energy consumption, machine health, forecasts or alerts. I'm read-only and always cite my data source." },
  ]);
  const [q, setQ] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setQ("");
    setIsTyping(true);
    // Simulate a brief delay for AI response
    setTimeout(() => {
      setMsgs((m) => [...m, answer(text)]);
      setIsTyping(false);
    }, 600);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isTyping]);

  return (
    <>
      {/* Floating FAB button */}
      <button
        id="ai-assistant-fab"
        onClick={() => setIsOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-muted text-muted-foreground rotate-0"
            : "bg-primary text-primary-foreground"
        }`}
        style={{
          boxShadow: isOpen
            ? "0 4px 24px rgba(0,0,0,0.12)"
            : "0 4px 24px rgba(59,130,246,0.35), 0 0 0 4px rgba(59,130,246,0.1)",
        }}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? <X className="size-5" /> : <Bot className="size-6" />}
      </button>

      {/* Pulsing ring when closed */}
      {!isOpen && (
        <span className="pointer-events-none fixed bottom-6 right-6 z-40 size-14 animate-ping rounded-full bg-primary/20" />
      )}

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex w-96 flex-col overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
        style={{ height: "min(580px, calc(100vh - 8rem))" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-primary px-4 py-3 text-primary-foreground">
          <div className="grid size-9 place-items-center rounded-full bg-primary-foreground/20">
            <Bot className="size-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold">EnergyIQ Assistant</div>
            <div className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
              <span className="size-1.5 rounded-full bg-green-400" />
              Online · Read-only
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-primary-foreground/70 transition hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Minimize assistant"
          >
            <Minimize2 className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "gap-2"}`}>
              {m.role === "ai" && (
                <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-3.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted"
                }`}
              >
                <p>{m.text}</p>
                {m.source && (
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    📊 {m.source}
                    {m.link && (
                      <>
                        {" · "}
                        <Link
                          to={m.link}
                          onClick={() => setIsOpen(false)}
                          className="font-medium text-primary hover:underline"
                        >
                          open dashboard ↗
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-1.5 border-t px-3 pt-2.5 pb-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(q);
          }}
          className="flex gap-2 border-t px-3 py-3"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask in English or Bahasa Indonesia…"
            className="h-10 flex-1 rounded-xl border bg-background px-3.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 active:scale-95"
            aria-label="Send message"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </>
  );
}
