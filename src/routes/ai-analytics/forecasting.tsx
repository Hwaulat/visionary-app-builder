import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  ChevronLeft,
  Clock,
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
import { PageHeader, Panel, FilterSelect, Segmented, Pill, StatCard } from "@/components/ui-kit";
import { machines } from "@/lib/mock";
import { metricForecast, forecastAlerts } from "@/lib/mock-ai";

export const Route = createFileRoute("/ai-analytics/forecasting")({
  head: () => ({
    meta: [
      { title: "Metric Forecasting — AI Analytics — EnergyIQ" },
      {
        name: "description",
        content: "AI-powered metric forecasting with confidence bands and threshold breach predictions.",
      },
      { property: "og:title", content: "Metric Forecasting — AI Analytics — EnergyIQ" },
      { property: "og:description", content: "Predict when machine metrics will rise above limits." },
    ],
  }),
  component: Forecasting,
});

const metricOptions = ["Temperature", "Vibration", "Current", "kWh"] as const;
const horizons = ["24h", "48h", "72h", "96h"] as const;
const horizonMap: Record<string, number> = { "24h": 24, "48h": 48, "72h": 72, "96h": 96 };

function Forecasting() {
  const [machineId, setMachineId] = useState(machines[2]!.id);
  const [metric, setMetric] = useState<(typeof metricOptions)[number]>("Temperature");
  const [horizon, setHorizon] = useState<(typeof horizons)[number]>("72h");
  const machine = machines.find((m) => m.id === machineId)!;
  const data = metricForecast(machineId, metric, horizonMap[horizon]);

  const thresholdVal = data[0]?.threshold ?? 0;
  const lastActual = data.filter((d) => d.actual !== null).at(-1)?.actual ?? 0;
  const peakForecast = Math.max(...data.filter((d) => d.forecast !== null).map((d) => d.forecast!));
  const willBreach = peakForecast > thresholdVal;

  const relevantAlerts = forecastAlerts.filter((a) => a.machineId === machineId);

  return (
    <div className="space-y-5">
      <PageHeader icon={TrendingUp} title="Metric Forecasting">
        <Link
          to="/ai-analytics"
          className="flex h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm shadow-sm transition hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
        <FilterSelect
          value={machineId}
          onChange={setMachineId}
          options={machines.map((m) => m.id)}
        />
        <Segmented value={metric} options={[...metricOptions]} onChange={setMetric} />
        <Segmented value={horizon} options={[...horizons]} onChange={setHorizon} />
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={`Current ${metric}`}
          value={lastActual.toFixed(1)}
          unit={metric === "Temperature" ? "°C" : metric === "Vibration" ? "mm/s" : metric === "Current" ? "A" : "kWh"}
          icon={TrendingUp}
          tone="primary"
        />
        <StatCard
          label="Peak Forecast"
          value={peakForecast.toFixed(1)}
          unit={metric === "Temperature" ? "°C" : metric === "Vibration" ? "mm/s" : metric === "Current" ? "A" : "kWh"}
          icon={ArrowUpRight}
          tone={willBreach ? "destructive" : "success"}
        />
        <StatCard label="Threshold" value={thresholdVal.toFixed(0)} icon={AlertTriangle} tone="warning" />
        <StatCard
          label="Breach Risk"
          value={willBreach ? "HIGH" : "LOW"}
          icon={AlertTriangle}
          tone={willBreach ? "destructive" : "success"}
          hint={willBreach ? "Forecast exceeds threshold within horizon" : "Within safe range"}
        />
      </div>

      {/* Main chart */}
      <Panel
        title={`${metric} Forecast — ${machine.name}`}
        action={
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            Horizon: {horizon}
          </span>
        }
      >
        <div className="h-96">
          <ResponsiveContainer>
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                interval={3}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <ReferenceLine y={thresholdVal} stroke="var(--destructive)" strokeDasharray="6 4" strokeWidth={2} label={{ value: "Threshold", position: "insideTopRight", fill: "var(--destructive)", fontSize: 11 }} />
              <Area dataKey="upper" name="Upper bound" stroke="none" fill="url(#bandFill)" connectNulls={false} legendType="none" />
              <Area dataKey="lower" name="Lower bound" stroke="none" fill="var(--card)" connectNulls={false} legendType="none" />
              <Line dataKey="actual" name="Actual" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} connectNulls={false} />
              <Line
                dataKey="forecast"
                name="AI Forecast"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 2.5 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Forecast alerts for this machine */}
      <Panel title="Predicted Threshold Breaches">
        {relevantAlerts.length > 0 ? (
          <div className="space-y-3">
            {relevantAlerts.map((fa) => (
              <div
                key={`${fa.machineId}-${fa.metric}`}
                className="flex items-center gap-4 rounded-lg bg-muted/60 p-4"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{fa.metric} breach predicted</div>
                  <div className="text-sm text-muted-foreground">
                    Current {fa.currentValue} → Forecast {fa.forecastValue} (threshold {fa.threshold}) in ~{fa.timeToBreachH}h
                  </div>
                </div>
                <div className="text-right">
                  <Pill tone={fa.confidence >= 0.8 ? "destructive" : fa.confidence >= 0.6 ? "warning" : "muted"}>
                    {Math.round(fa.confidence * 100)}% confidence
                  </Pill>
                  <div className="mt-1 text-xs text-muted-foreground">MAPE: ~{(12 + (1 - fa.confidence) * 20).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            No threshold breaches predicted for {machine.name} within the selected horizon.
          </div>
        )}
      </Panel>

      {/* All forecast alerts across fleet */}
      <Panel title="Fleet-wide Forecast Alerts">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b">
                {["Machine", "Metric", "Current", "Forecast", "Threshold", "Time to Breach", "Confidence"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forecastAlerts.map((fa) => (
                <tr
                  key={`${fa.machineId}-${fa.metric}`}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/50 ${fa.machineId === machineId ? "bg-primary/5" : ""}`}
                >
                  <td className="px-3 py-3 font-medium">{fa.machineName}</td>
                  <td className="px-3 py-3">{fa.metric}</td>
                  <td className="px-3 py-3 tabular-nums">{fa.currentValue}</td>
                  <td className="px-3 py-3 tabular-nums font-semibold text-destructive">{fa.forecastValue}</td>
                  <td className="px-3 py-3 tabular-nums">{fa.threshold}</td>
                  <td className="px-3 py-3">
                    <Pill tone={fa.timeToBreachH <= 48 ? "destructive" : fa.timeToBreachH <= 96 ? "warning" : "muted"}>
                      ~{fa.timeToBreachH}h
                    </Pill>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${Math.round(fa.confidence * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums">{Math.round(fa.confidence * 100)}%</span>
                    </div>
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
