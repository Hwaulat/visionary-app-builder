import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cpu, HeartPulse, TrendingUp, Hourglass } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { PageHeader, Panel, FilterSelect, Segmented, Pill, healthTone } from "@/components/ui-kit";
import { machines, trend } from "@/lib/mock";

export const Route = createFileRoute("/dashboard/details")({
  head: () => ({
    meta: [
      { title: "Machine Details — EnergyIQ" },
      { name: "description", content: "Per-machine trends, health score, metric forecast and remaining useful life." },
      { property: "og:title", content: "Machine Details — EnergyIQ" },
      { property: "og:description", content: "Drill into machine health, forecasts and RUL." },
    ],
  }),
  component: Details,
});

const metrics = ["kWh", "Current", "Voltage", "Temperature", "Vibration"] as const;

function Details() {
  const [mid, setMid] = useState(machines[0].id);
  const [metric, setMetric] = useState<(typeof metrics)[number]>("Temperature");
  const m = machines.find((x) => x.id === mid)!;
  const data = trend(m.id, metric);

  return (
    <div className="space-y-5">
      <PageHeader icon={Cpu} title="Dashboard - Details">
        <FilterSelect value="Plant Cikarang" onChange={() => {}} options={["Plant Cikarang"]} />
        <FilterSelect value={m.area} onChange={() => {}} options={[...new Set(machines.map((x) => x.area))]} />
        <select value={mid} onChange={(e) => setMid(e.target.value)} className="h-10 min-w-56 rounded-lg border bg-card px-3 text-sm shadow-sm">
          {machines.map((x) => <option key={x.id} value={x.id}>{x.id} · {x.name}</option>)}
        </select>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel>
          <div className="flex items-center gap-2 text-foreground/80"><HeartPulse className="size-4 text-destructive" />Health Score</div>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl font-bold">{m.health}</span><span className="mb-1 text-muted-foreground">/ 100</span>
            <Pill tone={healthTone(m.health)}>{m.health >= 80 ? "Good" : m.health >= 60 ? "Watch" : "Degrading"}</Pill>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${m.health}%` }} /></div>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2 text-foreground/80"><TrendingUp className="size-4 text-warning" />Metric Rise Forecast</div>
          <div className="mt-3 text-2xl font-bold">{(data[13].forecast ?? 0).toFixed(1)} <span className="text-sm text-muted-foreground">{metric === "Temperature" ? "°C" : ""}</span></div>
          <p className="mt-1 text-sm text-muted-foreground">Expected in the next 72–96 h · MAPE 11.8%</p>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2 text-foreground/80"><Hourglass className="size-4 text-info" />Estimated RUL</div>
          <div className="mt-3 text-2xl font-bold">{m.rul} <span className="text-sm text-muted-foreground">days</span></div>
          <p className="mt-1 text-sm text-muted-foreground">Confidence range {m.rulLow}–{m.rulHigh} days {m.rul < 60 && <Pill tone="warning">low confidence</Pill>}</p>
        </Panel>
      </div>

      <Panel title={`${metric} Trend — ${m.name}`} action={<Segmented value={metric} options={[...metrics]} onChange={setMetric} />}>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <Line dataKey="previous" name="Previous period" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false} />
              <Line dataKey="current" name="Current" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line dataKey="forecast" name="AI forecast" stroke="var(--chart-2)" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
