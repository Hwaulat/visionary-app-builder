import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Calendar, Download, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { PageHeader, Panel } from "@/components/ui-kit";
import { SelectInput } from "@/components/ui/custom-select";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Reports Overview — EnergyIQ" },
    ],
  }),
  component: Reports,
});

const chartData = [
  { day: "15 Sep", p: 72000, avg: 71000 },
  { day: "16 Sep", p: 85000, avg: 79000 },
  { day: "17 Sep", p: 85500, avg: 82000 },
  { day: "18 Sep", p: 85600, avg: 83000 },
  { day: "19 Sep", p: 85700, avg: 83500 },
  { day: "20 Sep", p: 85600, avg: 83500 },
  { day: "21 Sep", p: 85700, avg: 84000 },
  { day: "22 Sep", p: 90000, avg: 85000 },
  { day: "23 Sep", p: 86000, avg: 85000 },
  { day: "24 Sep", p: 85800, avg: 85200 },
];

const tableData = [
  { ts: "29/09/2026 07:00:00", p: "29.108", cost: "IDR 1.045.928.000", co2: "163.004.800", vrst: "230,3", irst: "165,33", cos: "0,92", s: "0", thdi: "0", thdv: "0", q: "0", qc: "0" },
  { ts: "28/09/2026 07:00:00", p: "89.874", cost: "IDR 6.440.684.000", co2: "503.294.400", vrst: "227,35", irst: "164,88", cos: "0,95", s: "0", thdi: "0", thdv: "0", q: "0", qc: "0" },
  { ts: "27/09/2026 07:00:00", p: "88.262", cost: "IDR 6.329.660.000", co2: "494.267.200", vrst: "231,56", irst: "176,64", cos: "0,85", s: "0", thdi: "0", thdv: "0", q: "0", qc: "0" },
  { ts: "26/09/2026 07:00:00", p: "88.077", cost: "IDR 6.311.602.000", co2: "493.231.200", vrst: "220,64", irst: "158,08", cos: "0,84", s: "0", thdi: "0", thdv: "0", q: "0", qc: "0" },
  { ts: "25/09/2026 07:00:00", p: "88.058", cost: "IDR 6.310.684.000", co2: "493.124.800", vrst: "226,59", irst: "156,35", cos: "0,94", s: "0", thdi: "0", thdv: "0", q: "0", qc: "0" },
];

function Reports() {
  const [deviceChart, setDeviceChart] = useState("LVMDP01");
  const [metricChart, setMetricChart] = useState("P (KWh)");
  const [deviceTable, setDeviceTable] = useState("LVMDP01");

  return (
    <div className="space-y-6 pb-10">
      <PageHeader icon={Eye} title="Overview" />

      {/* Top Panel - Chart */}
      <Panel
        title={
          <div>
            <h3 className="font-bold text-lg text-[#0f284a] dark:text-foreground">Monthly Power Trend</h3>
            <p className="text-sm text-muted-foreground font-normal">Daily trend by selected metric in selected month.</p>
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <SelectInput
              containerClassName="w-32"
              defValue={deviceChart}
              onChange={(val) => setDeviceChart(val as string)}
              datalist={[{ label: "LVMDP01", value: "LVMDP01" }]}
            />
            <SelectInput
              containerClassName="w-32"
              defValue={metricChart}
              onChange={(val) => setMetricChart(val as string)}
              datalist={[{ label: "P (KWh)", value: "P (KWh)" }]}
            />
            <button className="flex items-center gap-2 rounded-md border bg-background px-3 h-9 text-sm text-muted-foreground shadow-sm hover:bg-muted/50 transition">
              <Calendar className="size-4" />
              <span>31/08/2026</span>
            </button>
          </div>
        }
      >
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => v === 0 ? "0" : (v / 1000).toFixed(3)} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
              <Line type="monotone" dataKey="p" name="P (KWh)" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="avg" name="Average" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Bottom Panel - Table */}
      <Panel className="!p-0 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-end gap-3 border-b p-4">
          <SelectInput
            containerClassName="w-32"
            defValue={deviceTable}
            onChange={(val) => setDeviceTable(val as string)}
            datalist={[{ label: "LVMDP01", value: "LVMDP01" }]}
          />
          <button className="flex items-center gap-2 rounded-md border bg-background px-3 h-9 text-sm text-muted-foreground shadow-sm hover:bg-muted/50 transition">
            <Calendar className="size-4" />
            <span>Select date range</span>
          </button>
          <button className="flex items-center gap-2 rounded-md bg-[#1a4b8c] px-4 h-9 text-sm font-medium text-white shadow-sm hover:bg-[#153a6d] transition">
            <Download className="size-4" />
            <span>Download Excel</span>
          </button>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs font-semibold text-muted-foreground border-b">
              <tr>
                {["Timestamp", "P (KWh)", "Cost (IDR)", "CO2e (kg)", "V.RST", "I.RST", "Cos ɸ", "S (VA)", "THD I", "THD V", "Q (kVAr)", "Qc (kVAr)"].map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3 cursor-pointer hover:text-foreground transition">
                    <div className="flex items-center gap-1">{col} <ChevronsUpDown className="size-3" /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {tableData.map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{row.ts}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.p}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.cost}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.co2}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.vrst}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.irst}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.cos}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.s}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.thdi}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.thdv}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.q}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.qc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground bg-card">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <SelectInput
                containerClassName="w-20"
                datalist={[{ label: "5", value: "5" }]}
                defValue="5"
              />
            </div>
            <span>1-5 of 5</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground" disabled>
              <ChevronsLeft className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground" disabled>
              <ChevronLeft className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-md bg-[#1a4b8c] text-white font-medium shadow-sm">1</button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground" disabled>
              <ChevronRight className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground" disabled>
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
