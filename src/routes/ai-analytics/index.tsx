import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BrainCircuit,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
  Hourglass,
  Activity,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { SelectInput } from "@/components/ui/custom-select";
import { PageHeader, Panel, StatCard, Pill, healthTone } from "@/components/ui-kit";
import { machines } from "@/lib/mock";
import {
  healthHistory,
  machineHealthDistribution,
  forecastAlerts,
} from "@/lib/mock-ai";

export const Route = createFileRoute("/ai-analytics/")({
  head: () => ({
    meta: [
      { title: "AI Analytics — EnergyIQ" },
      { name: "description", content: "Machine health overview, predictive insights and AI-driven analytics." },
      { property: "og:title", content: "AI Analytics — EnergyIQ" },
      { property: "og:description", content: "AI-powered machine health overview and predictive insights." },
    ],
  }),
  component: AIAnalyticsIndex,
});

const HEALTH_COLORS: Record<string, string> = {
  success: "var(--success)",
  primary: "var(--primary)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
};

function GaugeCard({ machine }: { machine: (typeof machines)[0] }) {
  const tone = healthTone(machine.health);
  const color = HEALTH_COLORS[tone] ?? "var(--primary)";
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (machine.health / 100) * circumference;
  return (
    <Link
      to="/ai-analytics/rul"
      className="group rounded-xl bg-card p-5 shadow-sm ring-1 ring-transparent transition-all hover:shadow-md hover:ring-primary/30"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{machine.id}</div>
          <div className="font-semibold">{machine.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">{machine.area} · {machine.line}</div>
        </div>
        <Pill tone={tone}>{machine.health >= 80 ? "Good" : machine.health >= 60 ? "Watch" : "Critical"}</Pill>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {machine.health}
          </div>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Hourglass className="size-3.5" />
            RUL: <span className="font-semibold text-foreground">{machine.rul}d</span>
            <span className="text-xs">({machine.rulLow}–{machine.rulHigh})</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Activity className="size-3.5" />
            Energy: <span className="font-semibold text-foreground">{machine.kwh.toLocaleString()} kWh</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AIAnalyticsIndex() {
  const [selected, setSelected] = useState(machines[2]!.id); // CHL-02
  const selectedMachine = machines.find((m) => m.id === selected)!;
  const history = healthHistory(selected);
  const dist = machineHealthDistribution();

  const avgHealth = Math.round(machines.reduce((s, m) => s + m.health, 0) / machines.length);
  const criticalCount = machines.filter((m) => m.health < 50).length;
  const watchCount = machines.filter((m) => m.health >= 50 && m.health < 80).length;

  return (
    <div className="space-y-5">
      <PageHeader icon={BrainCircuit} title="AI Analytics" />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Machine Health" value={String(avgHealth)} unit="/ 100" icon={HeartPulse} tone="primary" hint="Average health across all monitored machines" />
        <StatCard label="Critical Machines" value={String(criticalCount)} icon={AlertTriangle} tone="destructive" hint="Health below 50" />
        <StatCard label="Watch List" value={String(watchCount)} icon={TrendingUp} tone="warning" hint="Health 50–79" />
        <StatCard label="Forecast Alerts" value={String(forecastAlerts.length)} icon={ShieldCheck} tone="info" hint="Metrics predicted to breach thresholds" />
      </div>

      {/* Machine Health Grid */}
      <Panel title="Machine Health Matrix">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {machines.map((m) => (
            <GaugeCard key={m.id} machine={m} />
          ))}
        </div>
      </Panel>

      {/* Bottom row: health trend + upcoming alerts */}
      <div className="grid gap-5 lg:grid-cols-5">
        <Panel title="Health Trend (30 days)" className="lg:col-span-3" action={
          <SelectInput
            containerClassName="w-48"
            defValue={selected}
            onChange={(val) => setSelected(val as string)}
            datalist={machines.map((m) => ({ label: `${m.id} · ${m.name}`, value: m.id }))}
          />
        }>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} interval={4} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line dataKey="score" name="Health Score" stroke={HEALTH_COLORS[healthTone(selectedMachine.health)]} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Upcoming Forecast Alerts" className="lg:col-span-2">
          <div className="space-y-3">
            {forecastAlerts.map((fa) => (
              <Link
                key={`${fa.machineId}-${fa.metric}`}
                to="/ai-analytics/forecasting"
                className="block rounded-lg bg-muted/60 p-3 transition hover:bg-muted"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{fa.machineName}</div>
                    <div className="text-xs text-muted-foreground">{fa.metric} · breach in ~{fa.timeToBreachH}h</div>
                  </div>
                  <Pill tone={fa.timeToBreachH <= 48 ? "destructive" : fa.timeToBreachH <= 96 ? "warning" : "muted"}>
                    {fa.timeToBreachH}h
                  </Pill>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span>Current: <span className="font-semibold">{fa.currentValue}</span></span>
                  <ArrowUpRight className="size-3 text-destructive" />
                  <span>Forecast: <span className="font-semibold text-destructive">{fa.forecastValue}</span></span>
                  <span className="text-muted-foreground">Threshold: {fa.threshold}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${Math.round(fa.confidence * 100)}%` }}
                  />
                </div>
                <div className="mt-0.5 text-right text-[10px] text-muted-foreground">
                  Confidence: {Math.round(fa.confidence * 100)}%
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      {/* Health Distribution bar */}
      <Panel title="Health Score Distribution">
        <div className="h-48">
          <ResponsiveContainer>
            <BarChart data={dist} layout="vertical" barSize={28}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="range" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="count" name="Machines" radius={[0, 6, 6, 0]}>
                {dist.map((d, i) => (
                  <Cell key={i} fill={HEALTH_COLORS[d.tone] ?? "var(--primary)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
