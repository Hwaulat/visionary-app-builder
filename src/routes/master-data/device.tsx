import { createFileRoute } from "@tanstack/react-router";
import { Layers, Search, Pencil, ChevronsUpDown } from "lucide-react";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/master-data/device")({
  component: DeviceMasterData,
});

function DeviceMasterData() {
  const data = [
    { id: "trialLVMDP02", name: "LVMDP02", max: 10, std: 9 },
    { id: "trialLVMDP05", name: "LVMDP05", max: 10, std: 10 },
    { id: "CED02CED0201", name: "LVMDP04", max: 10, std: 10 },
    { id: "trialLVMDP01", name: "LVMDP01", max: 10, std: 10 },
  ];

  return (
    <div className="space-y-4 pb-10">
      <PageHeader icon={Layers} title="Master Data - Device" />
      
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-4 border-b">
          <div className="flex h-10 w-full items-center rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring">
            <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <input 
              placeholder="Search Device" 
              className="flex w-full bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none"
            />
          </div>
        </div>
        
        <div className="w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8fafc] text-slate-500 text-xs font-semibold">
              <tr className="border-b">
                <th className="py-3 px-4 text-center w-20">Action</th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1 cursor-pointer">Status <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1 cursor-pointer">Mac Address <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1 cursor-pointer">Device Name <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1 cursor-pointer">Max Ampere <ChevronsUpDown className="size-3" /></div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1 cursor-pointer">Std Ampere <ChevronsUpDown className="size-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <Button variant="iconEdit" icon={<Pencil className="size-4" />} />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                      <span className="mr-1.5 size-1.5 rounded-full bg-green-500"></span>
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{d.id}</td>
                  <td className="py-3 px-4 text-slate-700">{d.name}</td>
                  <td className="py-3 px-4 text-slate-700">{d.max}</td>
                  <td className="py-3 px-4 text-slate-700">{d.std}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between border-t p-4 bg-white rounded-b-xl">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            Rows per page 
            <select className="rounded-lg border border-slate-200 px-2 py-1 outline-none bg-slate-50 cursor-pointer text-slate-600 hover:bg-slate-100">
              <option>10</option>
            </select>
            <span className="ml-2">1-4 of 4</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="flex size-8 items-center justify-center rounded-lg border bg-white text-slate-300 pointer-events-none" disabled>
              <span className="text-xs">&laquo;</span>
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg border bg-white text-slate-300 pointer-events-none" disabled>
              <span className="text-xs">&lsaquo;</span>
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg bg-[#144781] text-white">
              1
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg border bg-white text-slate-300 pointer-events-none" disabled>
              <span className="text-xs">&rsaquo;</span>
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg border bg-white text-slate-300 pointer-events-none" disabled>
              <span className="text-xs">&raquo;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
