import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TriangleAlert, Calendar, Download, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-kit";
import { Search } from "@/components/ui/search";
import { SelectInput } from "@/components/ui/custom-select";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Log Alert — EnergyIQ" },
    ],
  }),
  component: Alerts,
});

const mockAlerts = [
  { id: 1, priority: "Medium", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Under", log: "under voltage sn detected! Realtime data 0, min standard 15" },
  { id: 2, priority: "High", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Overload", log: "Overload voltage avg detected! Realtime data 237.5992592652808, max standard 8" },
  { id: 3, priority: "Medium", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Under", log: "under voltage st detected! Realtime data 0, min standard 2" },
  { id: 4, priority: "Medium", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Under", log: "under voltage rn detected! Realtime data 0, min standard 24" },
  { id: 5, priority: "Medium", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Under", log: "under voltage tn detected! Realtime data 0, min standard 9" },
  { id: 6, priority: "Medium", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Under", log: "under voltage unbalanced detected! Realtime data 0, min standard 8" },
  { id: 7, priority: "High", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Overload", log: "Overload current avg detected! Realtime data 166.88967817643083, max standard 24" },
  { id: 8, priority: "Medium", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Under", log: "under voltage rs detected! Realtime data 0, min standard 14" },
  { id: 9, priority: "Medium", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Under", log: "under voltage tr detected! Realtime data 0, min standard 26" },
  { id: 10, priority: "High", time: "12 Mar 2026, 15:13", device: "LVMDP01", category: "Overload", log: "Overload real power detected! Realtime data 106.48282980336595, max standard 8" },
];

function Alerts() {
  const [q, setQ] = useState("");

  return (
    <div className="space-y-4 pb-10">
      <PageHeader icon={TriangleAlert} title="Log Alert" />

      <Panel className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full flex-1 min-w-[200px]">
            <Search 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search Log Alert..." 
            />
          </div>
          
          <div className="flex items-center gap-3">
            <SelectInput containerClassName="w-36" datalist={[{ label: "Filter Priority", value: "Filter Priority" }]} defValue="Filter Priority" />
            
            <button className="flex items-center gap-2 rounded-md border bg-background px-3 h-9 text-sm shadow-sm text-muted-foreground hover:bg-muted/50 transition">
              <Calendar className="size-4" />
              <span>Select date</span>
            </button>
            
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 h-9 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition">
              <Download className="size-4" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs font-semibold text-muted-foreground border-b">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 cursor-pointer hover:text-foreground transition">
                  <div className="flex items-center gap-1">Priority <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="whitespace-nowrap px-6 py-4 cursor-pointer hover:text-foreground transition">
                  <div className="flex items-center gap-1">Triggered Time <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="whitespace-nowrap px-6 py-4 cursor-pointer hover:text-foreground transition">
                  <div className="flex items-center gap-1">Device Name <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="whitespace-nowrap px-6 py-4 cursor-pointer hover:text-foreground transition">
                  <div className="flex items-center gap-1">Category <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="whitespace-nowrap px-6 py-4 cursor-pointer hover:text-foreground transition">
                  <div className="flex items-center gap-1">Alert Log <ChevronsUpDown className="size-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockAlerts.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span 
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm ${
                        a.priority === 'High' ? 'bg-[#e11d48]' : 'bg-[#f59e0b]'
                      }`}
                    >
                      <TriangleAlert className="size-3" /> {a.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{a.time}</td>
                  <td className="px-6 py-4 text-muted-foreground">{a.device}</td>
                  <td className="px-6 py-4 text-muted-foreground">{a.category}</td>
                  <td className="px-6 py-4 text-muted-foreground min-w-[300px]">{a.log}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground bg-card">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <SelectInput
                containerClassName="w-20"
                datalist={[{ label: "10", value: "10" }]}
                defValue="10"
              />
            </div>
            <span>1-10 of 36</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground" disabled>
              <ChevronsLeft className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground" disabled>
              <ChevronLeft className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-md bg-blue-600 text-white font-medium shadow-sm">1</button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-foreground">2</button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-foreground">3</button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-foreground">4</button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground">
              <ChevronRight className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-md border bg-background hover:bg-muted transition text-muted-foreground">
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
