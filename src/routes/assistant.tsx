import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-kit";
import { machines } from "@/lib/mock";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — EnergyIQ" },
      { name: "description", content: "Ask questions about energy use and machine health in plain language." },
      { property: "og:title", content: "AI Assistant — EnergyIQ" },
      { property: "og:description", content: "Natural-language answers with cited data sources." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "ai"; text: string; source?: string; link?: "/dashboard/details" | "/" };

function answer(q: string): Msg {
  const t = q.toLowerCase();
  if (t.includes("most energy") || t.includes("paling")) {
    const m = [...machines].sort((a, b) => b.kwh - a.kwh)[0];
    return { role: "ai", text: `${m.name} (${m.id}) used the most energy: ${m.kwh.toLocaleString()} kWh.`, source: `${m.id} · kWh · last 30 days`, link: "/" };
  }
  if (t.includes("temperature") || t.includes("48")) {
    return { role: "ai", text: "Chiller 02 (CHL-02) is likely to exceed the 85 °C limit within 48 hours (forecast 86.9 °C).", source: "CHL-02 · Temperature · forecast next 48 h", link: "/dashboard/details" };
  }
  if (t.includes("rul") || t.includes("life")) {
    const low = machines.filter((m) => m.rul < 90).map((m) => `${m.id} (${m.rul} d)`).join(", ");
    return { role: "ai", text: `Machines with RUL under 90 days: ${low}.`, source: "All machines · RUL estimate · today", link: "/dashboard/details" };
  }
  return { role: "ai", text: "I don't have data to answer that yet. Try asking about energy use, temperature forecasts or remaining life." };
}

const suggestions = ["Which machine used the most energy last week?", "Which machines are likely to exceed temperature limits in 48 hours?", "Which machines have low RUL?"];

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: "Hi! Ask me about energy consumption or machine health. I'm read-only and always cite my data source." }]);
  const [q, setQ] = useState("");
  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }, answer(text)]);
    setQ("");
  };
  return (
    <div>
      <PageHeader icon={Bot} title="AI Assistant" />
      <Panel className="flex h-[calc(100vh-12rem)] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
              <div className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p>{m.text}</p>
                {m.source && <p className="mt-2 text-xs text-muted-foreground">Source: {m.source}{m.link && <> · <Link to={m.link} className="text-primary hover:underline">open dashboard</Link></>}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">{s}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="mt-3 flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask in English or Bahasa Indonesia…" className="h-11 flex-1 rounded-lg border bg-background px-4 text-sm" />
          <button className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground" aria-label="Send"><Send className="size-4" /></button>
        </form>
      </Panel>
    </div>
  );
}
