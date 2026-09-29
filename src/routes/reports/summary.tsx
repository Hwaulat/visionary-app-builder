import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Calendar, LineChart as LineChartIcon } from "lucide-react";
import { ComposedChart, Bar, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Panel, Segmented } from "@/components/ui-kit";
import { SelectInput } from "@/components/ui/custom-select";

export const Route = createFileRoute("/reports/summary")({
  head: () => ({
    meta: [
      { title: "Reports Summary — EnergyIQ" },
    ],
  }),
  component: Summary,
});

// Generate some dummy data that falls between 0 and 4
const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  wbp: Math.random() * 1.5 + 0.5,
  lwbp: Math.random() * 1.5 + 0.5,
  max: 4,
  std: 3,
}));

function Summary() {
  const [metric, setMetric] = useState<"Cost" | "kWh" | "kVArh">("Cost");

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-[#0f284a] dark:text-foreground">
          <BarChart3 className="size-6" />
          <span>Summary</span>
        </div>
        <Segmented value={metric} options={["Cost", "kWh", "kVArh"]} onChange={setMetric} />
      </div>

      {/* Filter Panel */}
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
        <SelectInput
          containerClassName="w-36"
          defValue="Monthly"
          onChange={() => {}}
          datalist={[{ label: "Monthly", value: "Monthly" }]}
        />
        <button className="flex items-center gap-2 rounded-md border bg-background px-4 h-10 text-sm shadow-sm transition hover:bg-muted/50 text-muted-foreground">
          <Calendar className="size-4" />
          <span>31/08/2026</span>
        </button>
      </div>

      {/* Energy Usage Chart */}
      <Panel
        className="!p-4"
        title={
          <div className="flex items-start gap-2">
            <LineChartIcon className="size-5 text-[#3b82f6] mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-[#0f284a] dark:text-foreground">Energy Usage</span>
              <span className="text-xs font-normal text-muted-foreground">Cost breakdown (WBP, LWBP) with Max and Std limits</span>
            </div>
          </div>
        }
        action={
          <div className="rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Cost</div>
        }
      >
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickCount={5} domain={[0, 4]} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend verticalAlign="bottom" height={36} iconType="square" wrapperStyle={{ fontSize: 12 }} />
              
              <Bar dataKey="wbp" name="WBP" fill="#10b981" barSize={12} stackId="a" />
              <Bar dataKey="lwbp" name="LWBP" fill="#a7f3d0" barSize={12} stackId="a" />
              <Line type="monotone" dataKey="max" name="Max" stroke="#ef4444" strokeWidth={1} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="std" name="Std" stroke="#f59e0b" strokeWidth={1} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* LVMDP 01 Chart */}
      <Panel
        className="!p-4"
        title={
          <div className="flex items-start gap-2">
            <LineChartIcon className="size-5 text-[#3b82f6] mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-[#0f284a] dark:text-foreground">LVMDP 01</span>
              <span className="text-xs font-normal text-muted-foreground">Device-level cost and threshold trends</span>
            </div>
          </div>
        }
        action={
          <div className="rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Cost</div>
        }
      >
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickCount={5} domain={[0, 4]} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend verticalAlign="bottom" height={36} iconType="square" wrapperStyle={{ fontSize: 12 }} />
              
              <Bar dataKey="wbp" name="WBP" fill="#10b981" barSize={12} stackId="a" />
              <Bar dataKey="lwbp" name="LWBP" fill="#a7f3d0" barSize={12} stackId="a" />
              <Line type="monotone" dataKey="max" name="Max" stroke="#ef4444" strokeWidth={1} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="std" name="Std" stroke="#f59e0b" strokeWidth={1} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
