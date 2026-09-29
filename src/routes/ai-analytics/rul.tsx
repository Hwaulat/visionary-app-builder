import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Hourglass,
  ChevronLeft,
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  CalendarClock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";
import { PageHeader, Panel, FilterSelect, Pill, healthTone, StatCard } from "@/components/ui-kit";
import { machines } from "@/lib/mock";
import { rulProjection, healthHistory } from "@/lib/mock-ai";

export const Route = createFileRoute("/ai-analytics/rul")({
  head: () => ({
    meta: [
      { title: "RUL Estimation — AI Analytics — EnergyIQ" },
      { name: "description", content: "Remaining useful life estimation with confidence ranges and degradation projections." },
      { property: "og:title", content: "RUL Estimation — AI Analytics — EnergyIQ" },
      { property: "og:description", content: "Predict when machines need maintenance or replacement." },
    ],
  }),
  component: RULPage,
});

function RULPage() {
  const [machineId, setMachineId] = useState(machines[2]!.id);
  const machine = machines.find((m) => m.id === machineId)!;
  const projection = rulProjection(machine);
  const history = healthHistory(machineId);

  const sortedByRul = [...machines].sort((a, b) => a.rul - b.rul);
  const urgentCount = machines.filter((m) => m.rul < 60).length;

  return (
    <div className="space-y-5">
      <PageHeader icon={Hourglass} title="RUL Estimation">

        <FilterSelect
          value={machineId}
          onChange={setMachineId}
          options={machines.map((m) => m.id)}
        />
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Current Health"
          value={String(machine.health)}
          unit="/ 100"
          icon={HeartPulse}
          tone={healthTone(machine.health)}
        />
        <StatCard
          label="Estimated RUL"
          value={String(machine.rul)}
          unit="days"
          icon={Hourglass}
          tone={machine.rul < 60 ? "destructive" : machine.rul < 120 ? "warning" : "success"}
          hint={`Confidence range: ${machine.rulLow}–${machine.rulHigh} days`}
        />
        <StatCard
          label="Confidence Range"
          value={`${machine.rulLow}–${machine.rulHigh}`}
          unit="days"
          icon={ShieldCheck}
          tone="info"
        />
        <StatCard
          label="Urgent Machines"
          value={String(urgentCount)}
          icon={AlertTriangle}
          tone="destructive"
          hint="RUL < 60 days"
        />
      </div>

      {/* Selected machine details card */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-1">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">{machine.name}</h3>
              <p className="text-sm text-muted-foreground">{machine.id} · {machine.area} · {machine.line}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3">
                <span className="flex items-center gap-2 text-sm"><HeartPulse className="size-4 text-primary" />Health Score</span>
                <span className="text-lg font-bold">{machine.health}<span className="text-sm text-muted-foreground">/100</span></span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3">
                <span className="flex items-center gap-2 text-sm"><Hourglass className="size-4 text-warning" />RUL Estimate</span>
                <span className="text-lg font-bold">{machine.rul}<span className="text-sm text-muted-foreground"> days</span></span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3">
                <span className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4 text-info" />Confidence</span>
                <span className="text-lg font-bold">{machine.rulLow}–{machine.rulHigh}<span className="text-sm text-muted-foreground"> days</span></span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3">
                <span className="flex items-center gap-2 text-sm"><CalendarClock className="size-4 text-success" />Est. Service Date</span>
                <span className="text-sm font-semibold">
                  {new Date(Date.now() + machine.rul * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
            {machine.rul < 60 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="size-4" />Action Required</div>
                <p className="mt-1 text-xs">This machine's RUL is below 60 days. Schedule maintenance or inspection immediately.</p>
              </div>
            )}
            {machine.rul < 90 && machine.rul >= 60 && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
                <div className="flex items-center gap-2 font-semibold"><Wrench className="size-4" />Maintenance Advisory</div>
                <p className="mt-1 text-xs">Consider scheduling preventive maintenance within the next {machine.rul} days.</p>
              </div>
            )}
          </div>
        </Panel>

        {/* RUL projection chart */}
        <Panel title={`Health Degradation Projection — ${machine.name}`} className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer>
              <ComposedChart data={projection}>
                <defs>
                  <linearGradient id="rulBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--info)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--info)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "Days from today", position: "insideBottomRight", offset: -5, fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "Health Score", angle: -90, position: "insideLeft", fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <ReferenceLine y={30} stroke="var(--destructive)" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: "End of Life", position: "insideTopRight", fill: "var(--destructive)", fontSize: 10 }} />
                <ReferenceLine x={machine.rul} stroke="var(--warning)" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `RUL: ${machine.rul}d`, position: "insideTopRight", fill: "var(--warning)", fontSize: 10 }} />
                <Area dataKey="upper" name="Upper CI" stroke="none" fill="url(#rulBand)" connectNulls legendType="none" />
                <Area dataKey="lower" name="Lower CI" stroke="none" fill="var(--card)" connectNulls legendType="none" />
                <Line dataKey="health" name="Projected Health" stroke="var(--info)" strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* 30-day health trend */}
      <Panel title={`Health Trend (Past 30 days) — ${machine.name}`}>
        <div className="h-56">
          <ResponsiveContainer>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} interval={4} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area dataKey="score" name="Health" stroke="var(--primary)" strokeWidth={2} fill="url(#healthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Machine RUL ranking table */}
      <Panel title="Machine RUL Ranking">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b">
                {["#", "Machine", "Area", "Health", "RUL (days)", "Confidence Range", "Status", "Est. Service"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedByRul.map((m, i) => (
                <tr
                  key={m.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/50 cursor-pointer ${m.id === machineId ? "bg-primary/5" : ""}`}
                  onClick={() => setMachineId(m.id)}
                >
                  <td className="px-3 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.id}</div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{m.area}</td>
                  <td className="px-3 py-3">
                    <Pill tone={healthTone(m.health)}>{m.health}</Pill>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-lg font-bold tabular-nums ${m.rul < 60 ? "text-destructive" : m.rul < 120 ? "text-warning" : ""}`}>
                      {m.rul}
                    </span>
                  </td>
                  <td className="px-3 py-3 tabular-nums text-muted-foreground">{m.rulLow}–{m.rulHigh}</td>
                  <td className="px-3 py-3">
                    <Pill tone={m.rul < 60 ? "destructive" : m.rul < 120 ? "warning" : "success"}>
                      {m.rul < 60 ? "Urgent" : m.rul < 120 ? "Plan" : "OK"}
                    </Pill>
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground">
                    {new Date(Date.now() + m.rul * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
