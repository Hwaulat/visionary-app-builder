import { createFileRoute } from "@tanstack/react-router";
import { ListOrdered, Zap, X } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-kit";

export const Route = createFileRoute("/dashboard/details")({
  head: () => ({
    meta: [
      { title: "Dashboard Details — EnergyIQ" },
      { name: "description", content: "Detailed electrical parameter readings." },
    ],
  }),
  component: Details,
});

const currentItems = [
  { label: "Current R", value: "171,20", unit: "A", status: "OK" },
  { label: "Current S", value: "174,50", unit: "A", status: "OK" },
  { label: "Current T", value: "171,32", unit: "A", status: "OK" },
  { label: "Current Avg", value: "172,34", unit: "A", status: "NG" },
];

const voltageItems = [
  { label: "Voltage R-S", value: "238,31", unit: "V", status: "OK" },
  { label: "Voltage S-T", value: "237,80", unit: "V", status: "OK" },
  { label: "Voltage T-R", value: "239,10", unit: "V", status: "OK" },
  { label: "Voltage R-N", value: "220,15", unit: "V", status: "OK" },
  { label: "Voltage S-N", value: "219,80", unit: "V", status: "OK" },
  { label: "Voltage T-N", value: "221,05", unit: "V", status: "OK" },
  { label: "Voltage Avg", value: "238,31", unit: "V", status: "OK" },
];

const rightMetrics = [
  { title: "Energy", value: "4,044.5", unit: "kwh", subtext: "Apparent Energy Del" },
  { title: "Power", value: "150.5", unit: "kVA", subtext: "Apparent Power" },
  { title: "Voltage Unbalance", value: "1.2", unit: "%", subtext: "Percentage" },
  { title: "THD V 1", value: "2.4", unit: "%", subtext: "Percentage" },
  { title: "THD I 1", value: "8.5", unit: "", subtext: "Value" },
  { title: "Frequency", value: "49.43", unit: "Hz", subtext: "Value" },
  { title: "Power Factor", value: "0.94", unit: "%", subtext: "Percentage" },
  { title: "THD V 2", value: "2.1", unit: "%", subtext: "Percentage" },
  { title: "THD I 2", value: "9.2", unit: "%", subtext: "Percentage" },
  { title: "Current Unbalance", value: "2.5", unit: "%", subtext: "Percentage" },
  { title: "THD V 3", value: "2.5", unit: "%", subtext: "Percentage" },
  { title: "THD I 3", value: "8.8", unit: "", subtext: "Value" },
];

function Details() {
  return (
    <div className="space-y-4 pb-10">
      <PageHeader icon={ListOrdered} title="Details">
        <div className="flex items-center rounded-lg border bg-card px-3 py-1.5 text-sm font-medium shadow-sm">
          <span className="mr-6">LVMDP01</span>
          <X className="size-3.5 text-muted-foreground mr-2 cursor-pointer" />
          <svg className="size-3.5 text-muted-foreground cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </PageHeader>

      <div className="flex flex-col gap-4 lg:flex-row items-start">
        {/* Left Sidebar (Current & Voltage) */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
          {/* Current Panel */}
          <Panel className="!p-0">
            <div className="p-4 text-center font-bold border-b border-border/50">Current</div>
            <div className="p-4 space-y-4">
              {currentItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground w-28">{item.label}</span>
                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <div
                      className={`grid size-5 place-items-center rounded ${
                        item.status === "OK" ? "bg-[#14b8a6] text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      <Zap className="size-3 fill-current" />
                    </div>
                    <span className={`w-16 text-right tabular-nums ${item.status === "NG" ? "text-red-500" : ""}`}>
                      {item.value}
                    </span>
                    <span className="w-4 text-right">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Voltage Panel */}
          <Panel className="!p-0">
            <div className="p-4 text-center font-bold border-b border-border/50">Voltage</div>
            <div className="p-4 space-y-4">
              {voltageItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground w-28">{item.label}</span>
                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <div
                      className={`grid size-5 place-items-center rounded ${
                        item.status === "OK" ? "bg-[#14b8a6] text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      <Zap className="size-3 fill-current" />
                    </div>
                    <span className={`w-16 text-right tabular-nums ${item.status === "NG" ? "text-red-500" : ""}`}>
                      {item.value}
                    </span>
                    <span className="w-4 text-right">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Main Grid */}
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {rightMetrics.map((item, idx) => (
            <Panel key={idx} className="flex flex-col items-center justify-center relative min-h-[160px] !p-4">
              <span className="absolute top-4 left-4 font-bold text-foreground text-sm">{item.title}</span>
              <div className="mt-6 text-center">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">{item.value}</span>
                {item.unit && <span className="ml-1 text-sm font-medium text-muted-foreground">{item.unit}</span>}
                <div className="mt-1 text-xs text-muted-foreground font-medium">{item.subtext}</div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
