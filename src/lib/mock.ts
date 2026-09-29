export type Machine = {
  id: string;
  name: string;
  area: string;
  line: string;
  kwh: number;
  health: number;
  rul: number;
  rulLow: number;
  rulHigh: number;
  status: "online" | "stale" | "offline";
};

export const machines: Machine[] = [
  { id: "CMP-01", name: "Air Compressor 01", area: "Utility", line: "UT-1", kwh: 4820, health: 62, rul: 48, rulLow: 35, rulHigh: 60, status: "online" },
  { id: "INJ-03", name: "Injection Molding 03", area: "Molding", line: "MD-2", kwh: 3910, health: 81, rul: 210, rulLow: 170, rulHigh: 250, status: "online" },
  { id: "CHL-02", name: "Chiller 02", area: "Utility", line: "UT-1", kwh: 3450, health: 44, rul: 21, rulLow: 12, rulHigh: 34, status: "online" },
  { id: "PRS-05", name: "Hydraulic Press 05", area: "Stamping", line: "ST-1", kwh: 2780, health: 88, rul: 320, rulLow: 260, rulHigh: 380, status: "stale" },
  { id: "CNV-11", name: "Conveyor 11", area: "Assembly", line: "AS-3", kwh: 1540, health: 93, rul: 410, rulLow: 350, rulHigh: 470, status: "online" },
  { id: "OVN-01", name: "Curing Oven 01", area: "Paint", line: "PT-1", kwh: 1320, health: 71, rul: 130, rulLow: 90, rulHigh: 170, status: "offline" },
  { id: "WLD-07", name: "Welding Robot 07", area: "Assembly", line: "AS-1", kwh: 1180, health: 77, rul: 180, rulLow: 140, rulHigh: 220, status: "online" },
  { id: "PMP-04", name: "Cooling Pump 04", area: "Utility", line: "UT-2", kwh: 980, health: 58, rul: 64, rulLow: 40, rulHigh: 90, status: "online" },
];

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const monthlyEnergy = months.map((m, i) => ({
  month: m,
  kwh: i < 9 ? Math.round(52000 + Math.sin(i) * 6000 + i * 800) : null,
  target: 58000,
  cost: i < 9 ? Math.round((52000 + Math.sin(i) * 6000 + i * 800) * 1.44) : null,
}));

export const hourly = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  kw: Math.round(420 + Math.sin((h - 6) / 3.8) * 180 + (h > 7 && h < 18 ? 120 : 0)),
}));

export function trend(machineId: string, metric: string) {
  const seed = machineId.charCodeAt(0) + metric.length;
  return Array.from({ length: 14 }, (_, d) => {
    const base = 60 + Math.sin((d + seed) / 2) * 8 + d * 1.2;
    return {
      day: `D${d + 1}`,
      current: d < 10 ? +base.toFixed(1) : null,
      previous: +(base - 5 + Math.cos(d) * 3).toFixed(1),
      forecast: d >= 9 ? +(base + (d - 9) * 2.4).toFixed(1) : null,
    };
  });
}

export type Alert = {
  id: string;
  time: string;
  machine: string;
  metric: string;
  value: string;
  type: "threshold" | "connection" | "predictive";
  severity: "info" | "warning" | "critical";
  status: "open" | "acknowledged" | "resolved";
  ackBy?: string;
};

export const alerts: Alert[] = [
  { id: "AL-1042", time: "2026-09-29 09:12", machine: "CHL-02", metric: "Temperature", value: "86.4 °C", type: "threshold", severity: "critical", status: "open" },
  { id: "AL-1041", time: "2026-09-29 08:55", machine: "CMP-01", metric: "Vibration", value: "RUL < 60 d", type: "predictive", severity: "warning", status: "open" },
  { id: "AL-1040", time: "2026-09-29 08:31", machine: "OVN-01", metric: "Connection", value: "No data 12 min", type: "connection", severity: "critical", status: "acknowledged", ackBy: "rudi.h" },
  { id: "AL-1039", time: "2026-09-29 07:48", machine: "PMP-04", metric: "Current", value: "Forecast 48.2 A in 36 h", type: "predictive", severity: "warning", status: "open" },
  { id: "AL-1038", time: "2026-09-28 22:10", machine: "INJ-03", metric: "Power factor", value: "0.78", type: "threshold", severity: "info", status: "resolved", ackBy: "sari.w" },
  { id: "AL-1037", time: "2026-09-28 17:02", machine: "PRS-05", metric: "Connection", value: "Stale 45 s", type: "connection", severity: "warning", status: "resolved", ackBy: "admin" },
  { id: "AL-1036", time: "2026-09-28 14:40", machine: "CMP-01", metric: "kWh", value: "+18% vs baseline", type: "threshold", severity: "warning", status: "acknowledged", ackBy: "rudi.h" },
];

export const users = [
  { name: "Admin", email: "admin@plant.co.id", role: "Admin", active: true, last: "Today 09:31" },
  { name: "Rudi Hartono", email: "rudi.h@plant.co.id", role: "Engineer", active: true, last: "Today 08:40" },
  { name: "Sari Wulandari", email: "sari.w@plant.co.id", role: "Manager", active: true, last: "Yesterday" },
  { name: "Budi Santoso", email: "budi.s@plant.co.id", role: "Viewer", active: true, last: "3 days ago" },
  { name: "Dewi Lestari", email: "dewi.l@plant.co.id", role: "Engineer", active: false, last: "2 months ago" },
];
