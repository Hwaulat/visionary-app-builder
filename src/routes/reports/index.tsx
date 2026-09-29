import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileBarChart, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, Segmented } from "@/components/ui-kit";
import { machines } from "@/lib/mock";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Reports Overview — EnergyIQ" },
      { name: "description", content: "Compare energy performance across machines, areas and periods." },
      { property: "og:title", content: "Reports Overview — EnergyIQ" },
      { property: "og:description", content: "Comparative energy reports with export." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const [by, setBy] = useState<"Machine" | "Area">("Machine");
  const [per, setPer] = useState<"Day" | "Week" | "Month">("Month");
  const f = per === "Day" ? 1 / 30 : per === "Week" ? 7 / 30 : 1;
  const data = by === "Machine"
    ? machines.map((m) => ({ name: m.id, current: Math.round(m.kwh * f), previous: Math.round(m.kwh * f * (0.85 + (m.health % 7) / 20)) }))
    : Object.entries(machines.reduce<Record<string, number>>((a, m) => ({ ...a, [m.area]: (a[m.area] ?? 0) + m.kwh }), {})).map(([name, k]) => ({ name, current: Math.round(k * f), previous: Math.round(k * f * 0.93) }));

  return (
    <div className="space-y-5">
      <PageHeader icon={FileBarChart} title="Reports - Overview">
        <Segmented value={by} options={["Machine", "Area"]} onChange={setBy} />
        <Segmented value={per} options={["Day", "Week", "Month"]} onChange={setPer} />
        <button className="flex h-10 items-center gap-2 rounded-lg border bg-card px-4 text-sm shadow-sm"><Download className="size-4" />PDF</button>
        <button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm text-primary-foreground shadow-sm"><Download className="size-4" />Excel</button>
      </PageHeader>
      <Panel title={`Consumption by ${by} (kWh) — this vs previous ${per.toLowerCase()}`}>
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="current" name="Current" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="previous" name="Previous" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Detail">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b"><th className="py-2">{by}</th><th>Current kWh</th><th>Previous kWh</th><th>Change</th></tr></thead>
          <tbody>
            {data.map((d) => {
              const ch = ((d.current - d.previous) / d.previous) * 100;
              return (
                <tr key={d.name} className="border-b last:border-0">
                  <td className="py-2.5 font-medium">{d.name}</td><td className="tabular-nums">{d.current.toLocaleString()}</td><td className="tabular-nums">{d.previous.toLocaleString()}</td>
                  <td className={ch > 0 ? "text-destructive" : "text-success"}>{ch > 0 ? "+" : ""}{ch.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
