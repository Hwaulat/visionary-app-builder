import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, Zap, Wallet, Gauge, Activity, BellRing } from "lucide-react";
import { Bar, ComposedChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { PageHeader, Panel, StatCard, Segmented, FilterSelect } from "@/components/ui-kit";
import { machines, monthlyEnergy, hourly } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard General — EnergyIQ" },
      { name: "description", content: "Facility-wide energy overview: kWh, cost, peak demand, power factor and top consumers." },
      { property: "og:title", content: "Dashboard General — EnergyIQ" },
      { property: "og:description", content: "Facility-wide energy overview at a glance." },
    ],
  }),
  component: General,
});

const periods = ["Today", "7 Days", "30 Days", "Custom"] as const;

function General() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30 Days");
  const [area, setArea] = useState("All Area");
  const mult = period === "Today" ? 1 / 30 : period === "7 Days" ? 7 / 30 : 1;
  const top = [...machines].sort((a, b) => b.kwh - a.kwh).slice(0, 5);
  const maxK = top[0].kwh;
  const total = 58420 * mult;

  return (
    <div className="space-y-5">
      <PageHeader icon={LayoutGrid} title="Dashboard - General">
        <FilterSelect value={area} onChange={setArea} options={["All Area", "Utility", "Molding", "Stamping", "Assembly", "Paint"]} />
        <Segmented value={period} options={[...periods]} onChange={setPeriod} />
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Energy" value={Math.round(total).toLocaleString()} unit="kWh" icon={Zap} tone="primary" hint="Sum of all meters" />
        <StatCard label="Est. Cost" value={`Rp ${(total * 1444.7 / 1e6).toFixed(1)}`} unit="jt" icon={Wallet} tone="warning" hint="Based on active tariff" />
        <StatCard label="Peak Demand" value="742" unit="kW" icon={Gauge} tone="info" />
        <StatCard label="Power Factor" value="0.91" icon={Activity} tone="success" />
        <StatCard label="Active Alerts" value="3" icon={BellRing} tone="destructive" />
      </div>

      <Panel title="Energy Consumption vs Target" action={<span className="text-sm font-semibold italic text-primary">Settings Target</span>}>
        <div className="h-80">
          <ResponsiveContainer>
            <ComposedChart data={monthlyEnergy}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="kwh" name="kWh" fill="var(--chart-1)" radius={[3, 3, 0, 0]} barSize={22} />
              <Line dataKey="target" name="Target" stroke="var(--chart-2)" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel title="Top 5 Consuming Machines" className="lg:col-span-2">
          <ul className="space-y-4">
            {top.map((m, i) => (
              <li key={m.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span><span className="mr-2 text-muted-foreground">{i + 1}.</span>{m.name}</span>
                  <span className="font-semibold tabular-nums">{Math.round(m.kwh * mult).toLocaleString()} kWh</span>
                </div>
                <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-chart-2" style={{ width: `${(m.kwh / maxK) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Load Profile (kW, today)" className="lg:col-span-3">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={hourly}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} interval={3} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area dataKey="kw" stroke="var(--chart-1)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
