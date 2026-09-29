import { machines, type Machine } from "./mock";

/* ── Health history (30 days per machine) ── */
export function healthHistory(machineId: string): { day: string; score: number }[] {
  const seed = machineId.charCodeAt(2) + machineId.charCodeAt(4);
  const m = machines.find((x) => x.id === machineId)!;
  return Array.from({ length: 30 }, (_, d) => {
    const drift = (30 - d) * ((100 - m.health) / 90);
    const noise = Math.sin(d * seed * 0.3) * 3;
    return { day: `D-${30 - d}`, score: Math.min(100, Math.max(0, Math.round(m.health + drift + noise))) };
  });
}

/* ── Metric forecast (actual + forecast bands) ── */
export type ForecastPoint = {
  time: string;
  actual: number | null;
  forecast: number | null;
  upper: number | null;
  lower: number | null;
  threshold?: number;
};

export function metricForecast(
  machineId: string,
  metric: string,
  horizonH: number = 72,
): ForecastPoint[] {
  const seed = machineId.charCodeAt(0) + metric.length;
  const base =
    metric === "Temperature" ? 68 : metric === "Vibration" ? 3.2 : metric === "Current" ? 35 : 420;
  const scale =
    metric === "Temperature" ? 1 : metric === "Vibration" ? 0.08 : metric === "Current" ? 0.6 : 12;
  const thresholdVal =
    metric === "Temperature" ? 85 : metric === "Vibration" ? 7.1 : metric === "Current" ? 50 : 750;

  const points: ForecastPoint[] = [];
  const totalH = 72 + horizonH;
  for (let h = 0; h < totalH; h += 4) {
    const isHistorical = h < 72;
    const t = h - 72;
    const trend = base + (h / totalH) * 12 * scale;
    const noise = Math.sin((h + seed) * 0.15) * 4 * scale;
    const val = +(trend + noise).toFixed(2);
    const band = +(2 + (Math.max(0, t) / horizonH) * 6) * scale;
    points.push({
      time: isHistorical ? `${-72 + h}h` : `+${t}h`,
      actual: isHistorical ? val : null,
      forecast: !isHistorical ? val : null,
      upper: !isHistorical ? +(val + band).toFixed(2) : null,
      lower: !isHistorical ? +(val - band).toFixed(2) : null,
      threshold: thresholdVal,
    });
  }
  return points;
}

/* ── RUL projection curves ── */
export type RulProjection = {
  day: number;
  health: number;
  lower: number;
  upper: number;
};

export function rulProjection(machine: Machine): RulProjection[] {
  const pts: RulProjection[] = [];
  const totalDays = Math.round(machine.rulHigh * 1.3);
  const rate = machine.health / (machine.rul * 1.1);
  for (let d = 0; d <= totalDays; d += Math.max(1, Math.round(totalDays / 40))) {
    const h = Math.max(0, machine.health - rate * d + Math.sin(d * 0.1) * 3);
    const spread = 4 + d * 0.15;
    pts.push({
      day: d,
      health: +h.toFixed(1),
      lower: +Math.max(0, h - spread).toFixed(1),
      upper: +Math.min(100, h + spread).toFixed(1),
    });
  }
  return pts;
}

/* ── Anomaly events ── */
export type AnomalyEvent = {
  id: string;
  timestamp: string;
  machineId: string;
  machineName: string;
  metric: string;
  expected: number;
  actual: number;
  deviation: number;
  severity: "low" | "medium" | "high";
  operatingState: string;
  description: string;
};

const opStates = ["Production", "Idle", "Startup", "Shutdown", "Maintenance"];

export const anomalies: AnomalyEvent[] = [
  {
    id: "AN-001",
    timestamp: "2026-09-29 08:42",
    machineId: "CHL-02",
    machineName: "Chiller 02",
    metric: "Temperature",
    expected: 72.0,
    actual: 86.4,
    deviation: 20.0,
    severity: "high",
    operatingState: "Production",
    description: "Temperature spike 20% above baseline during steady-state production. Possible refrigerant issue.",
  },
  {
    id: "AN-002",
    timestamp: "2026-09-29 07:15",
    machineId: "CMP-01",
    machineName: "Air Compressor 01",
    metric: "Vibration",
    expected: 3.8,
    actual: 5.9,
    deviation: 55.3,
    severity: "high",
    operatingState: "Production",
    description: "Vibration 55% above normal — bearing degradation pattern detected.",
  },
  {
    id: "AN-003",
    timestamp: "2026-09-29 06:30",
    machineId: "PMP-04",
    machineName: "Cooling Pump 04",
    metric: "Current",
    expected: 32.0,
    actual: 41.8,
    deviation: 30.6,
    severity: "medium",
    operatingState: "Startup",
    description: "Higher-than-expected current draw during startup. May indicate increased mechanical load.",
  },
  {
    id: "AN-004",
    timestamp: "2026-09-28 22:05",
    machineId: "CMP-01",
    machineName: "Air Compressor 01",
    metric: "kWh",
    expected: 15.2,
    actual: 19.8,
    deviation: 30.3,
    severity: "medium",
    operatingState: "Idle",
    description: "Energy draw 30% above idle baseline — possible leak or idle running.",
  },
  {
    id: "AN-005",
    timestamp: "2026-09-28 18:20",
    machineId: "OVN-01",
    machineName: "Curing Oven 01",
    metric: "Temperature",
    expected: 185.0,
    actual: 172.3,
    deviation: -6.9,
    severity: "low",
    operatingState: "Production",
    description: "Slight temperature under-run, may affect curing quality. Heating element check recommended.",
  },
  {
    id: "AN-006",
    timestamp: "2026-09-28 14:50",
    machineId: "WLD-07",
    machineName: "Welding Robot 07",
    metric: "Current",
    expected: 28.0,
    actual: 34.5,
    deviation: 23.2,
    severity: "low",
    operatingState: "Production",
    description: "Mild current increase during production cycles. Within soft limit but trending upward.",
  },
  {
    id: "AN-007",
    timestamp: "2026-09-28 10:12",
    machineId: "INJ-03",
    machineName: "Injection Molding 03",
    metric: "Vibration",
    expected: 2.5,
    actual: 3.1,
    deviation: 24.0,
    severity: "low",
    operatingState: "Production",
    description: "Minor vibration increase during high-speed cycle. Monitor for progression.",
  },
  {
    id: "AN-008",
    timestamp: "2026-09-28 03:45",
    machineId: "PMP-04",
    machineName: "Cooling Pump 04",
    metric: "Temperature",
    expected: 42.0,
    actual: 51.3,
    deviation: 22.1,
    severity: "medium",
    operatingState: "Production",
    description: "Pump motor temperature elevated 22% above baseline. Coolant flow check advised.",
  },
  {
    id: "AN-009",
    timestamp: "2026-09-27 19:30",
    machineId: "CHL-02",
    machineName: "Chiller 02",
    metric: "Current",
    expected: 38.0,
    actual: 46.2,
    deviation: 21.6,
    severity: "medium",
    operatingState: "Production",
    description: "Current draw increasing as compressor works harder — correlates with temperature anomaly.",
  },
  {
    id: "AN-010",
    timestamp: "2026-09-27 11:00",
    machineId: "PRS-05",
    machineName: "Hydraulic Press 05",
    metric: "kWh",
    expected: 12.0,
    actual: 10.1,
    deviation: -15.8,
    severity: "low",
    operatingState: "Shutdown",
    description: "Lower-than-expected energy during shutdown phase. Likely normal variance.",
  },
];

/* ── Anomaly timeline (hourly counts for past 7 days) ── */
export function anomalyTimeline(): { day: string; high: number; medium: number; low: number }[] {
  return Array.from({ length: 7 }, (_, i) => ({
    day: `Sep ${23 + i}`,
    high: Math.round(1 + Math.random() * 2),
    medium: Math.round(2 + Math.random() * 4),
    low: Math.round(3 + Math.random() * 5),
  }));
}

/* ── Fleet summary helpers ── */
export function fleetHealthDistribution(): { range: string; count: number; tone: string }[] {
  const ranges = [
    { range: "90–100", min: 90, tone: "success" },
    { range: "70–89", min: 70, tone: "primary" },
    { range: "50–69", min: 50, tone: "warning" },
    { range: "0–49", min: 0, tone: "destructive" },
  ];
  return ranges.map((r) => ({
    ...r,
    count: machines.filter(
      (m) => m.health >= r.min && (r.min === 90 ? m.health <= 100 : m.health < r.min + 20),
    ).length,
  }));
}

export type ForecastAlert = {
  machineId: string;
  machineName: string;
  metric: string;
  currentValue: number;
  forecastValue: number;
  threshold: number;
  timeToBreachH: number;
  confidence: number;
};

export const forecastAlerts: ForecastAlert[] = [
  { machineId: "CHL-02", machineName: "Chiller 02", metric: "Temperature", currentValue: 78.2, forecastValue: 86.9, threshold: 85, timeToBreachH: 36, confidence: 0.89 },
  { machineId: "PMP-04", machineName: "Cooling Pump 04", metric: "Current", currentValue: 41.5, forecastValue: 48.2, threshold: 50, timeToBreachH: 48, confidence: 0.76 },
  { machineId: "CMP-01", machineName: "Air Compressor 01", metric: "Vibration", currentValue: 5.1, forecastValue: 7.4, threshold: 7.1, timeToBreachH: 96, confidence: 0.68 },
  { machineId: "WLD-07", machineName: "Welding Robot 07", metric: "Current", currentValue: 34.5, forecastValue: 47.8, threshold: 50, timeToBreachH: 120, confidence: 0.54 },
];
