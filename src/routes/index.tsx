import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Zap, Wind, TrendingUp } from "lucide-react";
import { Bar, ComposedChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Panel, StatCard } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard General — EnergyIQ" },
      { name: "description", content: "Facility-wide energy overview" },
    ],
  }),
  component: General,
});

const monthlyData = [
  { month: "Jan", value: 0, average: 0 },
  { month: "Feb", value: 0, average: 0 },
  { month: "Mar", value: 3500000, average: 1000000 },
  { month: "Apr", value: 5000000, average: 2100000 },
  { month: "May", value: 5700000, average: 2800000 },
  { month: "Jun", value: 3500000, average: 2900000 },
  { month: "Jul", value: 600000, average: 2600000 },
  { month: "Aug", value: 1600000, average: 2500000 },
  { month: "Sep", value: 2466133, average: 2500000 },
  { month: "Oct", value: 0, average: 2200000 },
  { month: "Nov", value: 0, average: 2000000 },
  { month: "Dec", value: 0, average: 1800000 },
];

const costData = [
  { month: "Jan", value: 0, average: 0 },
  { month: "Feb", value: 0, average: 0 },
  { month: "Mar", value: 240000000000, average: 80000000000 },
  { month: "Apr", value: 360000000000, average: 150000000000 },
  { month: "May", value: 390000000000, average: 200000000000 },
  { month: "Jun", value: 250000000000, average: 210000000000 },
  { month: "Jul", value: 40000000000, average: 190000000000 },
  { month: "Aug", value: 100000000000, average: 180000000000 },
  { month: "Sep", value: 175374362000, average: 175000000000 },
  { month: "Oct", value: 0, average: 160000000000 },
  { month: "Nov", value: 0, average: 140000000000 },
  { month: "Dec", value: 0, average: 130000000000 },
];

function General() {
  return (
    <div className="space-y-5 pb-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Electricity Cost"
          value="IDR 175.374.362.000"
          icon={DollarSign}
          tone="success"
          hint="Total accumulated electricity cost"
        />
        <StatCard
          label="kWh"
          value="2.466.133"
          icon={Zap}
          tone="info"
          hint="Total accumulated energy consumption"
        />
        <StatCard
          label="Carbon Emission"
          value="0,138 MtCO2e"
          icon={Wind}
          tone="warning"
          hint="Estimated carbon footprint"
          subtext="0,138 MegaTon CO2-e"
        />
      </div>

      <Panel
        className="pt-6"
        title={
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold">Power Consumption - kWh</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">2.466.133 kWh</span>
              <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                50% <TrendingUp className="size-3" />
              </span>
            </div>
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <select className="h-9 min-w-32 rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>All Device</option>
            </select>
            <select className="h-9 w-24 rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>2026</option>
            </select>
          </div>
        }
      >
        <div className="mt-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000000}M`)}
                domain={[0, 6000000]}
                ticks={[0, 1500000, 3000000, 4500000, 6000000]}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(value: number, name: string) => [value.toLocaleString(), name]}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span className="text-sm font-medium text-muted-foreground">{value}</span>}
              />
              <Bar dataKey="value" name="Value" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={32} />
              <Line dataKey="average" name="Average" type="monotone" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#fff", stroke: "#f59e0b", strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel
        className="pt-6"
        title={
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold">Power Consumption - Electricity Cost</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">IDR 175.374.362.000</span>
              <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                74% <TrendingUp className="size-3" />
              </span>
            </div>
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <select className="h-9 min-w-32 rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>All Device</option>
            </select>
            <select className="h-9 w-24 rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>2026</option>
            </select>
          </div>
        }
      >
        <div className="mt-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={costData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000000000}B`)}
                domain={[0, 400000000000]}
                ticks={[0, 100000000000, 200000000000, 300000000000, 400000000000]}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(value: number, name: string) => [value.toLocaleString(), name]}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span className="text-sm font-medium text-muted-foreground">{value}</span>}
              />
              <Bar dataKey="value" name="Value" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={32} />
              <Line dataKey="average" name="Average" type="monotone" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#fff", stroke: "#f59e0b", strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
