import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  Search,
  Activity,
  BarChart3,
  Clock,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { PageHeader, Panel, FilterSelect, Pill, StatCard } from "@/components/ui-kit";
import { anomalies, anomalyTimeline, type AnomalyEvent } from "@/lib/mock-ai";

export const Route = createFileRoute("/ai-analytics/anomalies")({
  head: () => ({
    meta: [
      { title: "Anomaly Detection — AI Analytics — EnergyIQ" },
      {
        name: "description",
        content: "AI-powered anomaly detection: abnormal energy and machine behavior flagged by statistical baselines.",
      },
      { property: "og:title", content: "Anomaly Detection — AI Analytics — EnergyIQ" },
      { property: "og:description", content: "Spot abnormal machine behavior before it becomes a problem." },
    ],
  }),
  component: Anomalies,
});

const sevColors: Record<string, string> = {
  high: "var(--destructive)",
  medium: "var(--warning)",
  low: "var(--info)",
};

const sevTone = { high: "destructive", medium: "warning", low: "info" } as const;

function Anomalies() {
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("All Severity");
  const [metric, setMetric] = useState("All Metrics");
  const [machine, setMachine] = useState("All Machines");

  const timeline = anomalyTimeline();

  const filtered = useMemo(
    () =>
      anomalies.filter(
        (a) =>
          (!q || `${a.machineName} ${a.metric} ${a.id} ${a.description}`.toLowerCase().includes(q.toLowerCase())) &&
          (severity === "All Severity" || a.severity === severity) &&
          (metric === "All Metrics" || a.metric === metric) &&
          (machine === "All Machines" || a.machineId === machine),
      ),
    [q, severity, metric, machine],
  );

  const highCount = anomalies.filter((a) => a.severity === "high").length;
  const medCount = anomalies.filter((a) => a.severity === "medium").length;

  const uniqueMachines = ["All Machines", ...new Set(anomalies.map((a) => a.machineId))];
  const uniqueMetrics = ["All Metrics", ...new Set(anomalies.map((a) => a.metric))];

  return (
    <div className="space-y-5">
      <PageHeader icon={AlertTriangle} title="Anomaly Detection">
        <Link
          to="/ai-analytics"
          className="flex h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm shadow-sm transition hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search anomalies…"
            className="h-10 rounded-lg border bg-card pl-9 pr-3 text-sm shadow-sm"
          />
        </div>
        <FilterSelect value={severity} onChange={setSeverity} options={["All Severity", "high", "medium", "low"]} />
        <FilterSelect value={metric} onChange={setMetric} options={uniqueMetrics} />
        <FilterSelect value={machine} onChange={setMachine} options={uniqueMachines} />
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Anomalies" value={String(anomalies.length)} icon={Activity} tone="primary" hint="Last 7 days" />
        <StatCard label="High Severity" value={String(highCount)} icon={AlertTriangle} tone="destructive" />
        <StatCard label="Medium Severity" value={String(medCount)} icon={Zap} tone="warning" />
        <StatCard label="Detection Rate" value="96.2%" icon={BarChart3} tone="success" hint="True positive rate on backtests" />
      </div>

      {/* Anomaly timeline chart */}
      <Panel title="Anomaly Timeline (Past 7 Days)">
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="high" name="High" stackId="a" fill="var(--destructive)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" name="Medium" stackId="a" fill="var(--warning)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="low" name="Low" stackId="a" fill="var(--info)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Anomaly cards */}
      <Panel title={`Detected Anomalies (${filtered.length})`}>
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md ${
                a.severity === "high" ? "border-destructive/30" : a.severity === "medium" ? "border-warning/30" : "border-transparent"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="grid size-10 shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: `color-mix(in oklch, ${sevColors[a.severity]} 15%, transparent)`, color: sevColors[a.severity] }}
                  >
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{a.machineName}</span>
                      <Pill tone={sevTone[a.severity]}>{a.severity}</Pill>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="size-3" />{a.timestamp}</span>
                      <span>{a.id}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">{a.operatingState}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{a.metric}</div>
                  <div className="text-xs text-muted-foreground">
                    Expected: {a.expected} · Actual: <span className={a.deviation > 0 ? "text-destructive" : "text-info"}>{a.actual}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Deviation:</span>
                <div className="h-2 w-32 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.abs(a.deviation))}%`,
                      backgroundColor: sevColors[a.severity],
                    }}
                  />
                </div>
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: sevColors[a.severity] }}
                >
                  {a.deviation > 0 ? "+" : ""}{a.deviation.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">No anomalies match these filters.</div>
          )}
        </div>
      </Panel>
    </div>
  );
}
