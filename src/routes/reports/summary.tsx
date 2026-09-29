import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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

function Summary() {
  const [metric, setMetric] = useState<"Cost" | "kWh" | "kVArh">("Cost");
  const [period, setPeriod] = useState<"Daily" | "Monthly" | "Yearly">("Monthly");

  const chartData = useMemo(() => {
    if (metric === "kWh") {
      return Array.from({ length: 30 }, (_, i) => {
        const day = `${String(i + 1).padStart(2, '0')} Sep`;
        if (i < 14 || i === 29) {
          return { day, wbp: 0, lwbp: 0 };
        }
        if (i === 28) { // 29 Sep
          return { day, wbp: 35000, lwbp: 25000 };
        }
        return {
          day,
          wbp: 34000 + Math.random() * 2000,
          lwbp: 135000 + Math.random() * 5000,
        };
      });
    }
    // Default dummy for Cost / kVArh
    return Array.from({ length: 30 }, (_, i) => ({
      day: `${String(i + 1).padStart(2, '0')} Sep`,
      wbp: Math.random() * 1.5 + 0.5,
      lwbp: Math.random() * 1.5 + 0.5,
      max: 4,
      std: 3,
    }));
  }, [metric]);

  const maxDomain = metric === "kWh" ? [0, 180000] : [0, 4];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-[#0f284a] dark:text-foreground">
          <BarChart3 className="size-6" />
          <span>Summary</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented value={metric} options={["Cost", "kWh", "kVArh"]} onChange={setMetric} />
          <Segmented value={period} options={["Daily", "Monthly", "Yearly"]} onChange={setPeriod} />
        </div>
      </div>

      {/* Filter Panel */}
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
        <button className="flex items-center gap-2 rounded-md border bg-background px-4 h-10 text-sm shadow-sm transition hover:bg-muted/50 text-muted-foreground">
          <Calendar className="size-4" />
          <span>31/08/2026</span>
        </button>
      </div>

      {metric === "kVArh" ? (
        <>
          {/* Overview Panel for kVArh */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#0f284a] dark:text-foreground">Overview</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <div className="grid size-6 place-items-center rounded bg-[#10b981] text-white"><LineChartIcon className="size-3.5" /></div>
                  Average (kVArh)
                </div>
                <div className="text-xl font-bold">0</div>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <div className="grid size-6 place-items-center rounded bg-[#10b981] text-white"><LineChartIcon className="size-3.5" /></div>
                  Total (kVArh)
                </div>
                <div className="text-xl font-bold">0</div>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <div className="grid size-6 place-items-center rounded bg-[#10b981] text-white"><span className="text-xs font-bold">$</span></div>
                  Average Cost (IDR)
                </div>
                <div className="text-xl font-bold">0</div>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <div className="grid size-6 place-items-center rounded bg-[#10b981] text-white"><span className="text-xs font-bold">$</span></div>
                  Cost Total (IDR)
                </div>
                <div className="text-xl font-bold">0</div>
              </div>
            </div>
          </div>

          {/* General Chart for kVArh */}
          <Panel
            className="!p-4"
            title={
              <div className="flex items-start gap-2">
                <LineChartIcon className="size-5 text-[#3b82f6] mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-[#0f284a] dark:text-foreground">General</span>
                  <span className="text-xs font-normal text-muted-foreground">Reactive energy trend by period</span>
                </div>
              </div>
            }
            action={<div className="rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">kVArh</div>}
          >
            <div className="mt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickCount={5} domain={[0, 4]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </>
      ) : (
        <>
          {/* Energy Usage Chart */}
          <Panel
            className="!p-4"
            title={
              <div className="flex items-start gap-2">
                <LineChartIcon className="size-5 text-[#3b82f6] mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-[#0f284a] dark:text-foreground">Energy Usage</span>
                  <span className="text-xs font-normal text-muted-foreground">{metric} breakdown (WBP, LWBP) with Max and Std limits</span>
                </div>
              </div>
            }
            action={
              <div className="rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{metric}</div>
            }
          >
            <div className="mt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickCount={5} 
                    domain={maxDomain}
                    tickFormatter={(v) => metric === "kWh" && v > 0 ? (v / 1000).toFixed(3) : v}
                  />
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
                  <span className="text-xs font-normal text-muted-foreground">Device-level {metric.toLowerCase()} and threshold trends</span>
                </div>
              </div>
            }
            action={
              <div className="rounded bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{metric}</div>
            }
          >
            <div className="mt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickCount={5} 
                    domain={maxDomain}
                    tickFormatter={(v) => metric === "kWh" && v > 0 ? (v / 1000).toFixed(3) : v}
                  />
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
        </>
      )}
    </div>
  );
}
