import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Expand, Minimize2, LineChart as LineChartIcon, ArrowLeft } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-kit";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { SelectInput } from "@/components/ui/custom-select";
import { machines } from "@/lib/mock";

export const Route = createFileRoute("/dashboard/realtime-chart")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      machineId: (search.machineId as string) || "LVMDP01",
    };
  },
  head: () => ({
    meta: [
      { title: "Realtime Machine Chart — EnergyIQ" },
      { name: "description", content: "Live electrical parameter chart." },
    ],
  }),
  component: RealtimeChart,
});

const generateData = (base: number, variance: number, ceiling: number, floor: number, count: number = 60) => {
  const data = [];
  let time = new Date();
  time.setHours(time.getHours() - 1);
  for (let i = 0; i < count; i++) {
    data.push({
      time: time.toLocaleTimeString('en-US', { hour12: false }),
      Value: base === 0 ? 0 : +(base + (Math.random() * variance - variance / 2)).toFixed(3),
      Ceiling: ceiling,
      Floor: floor
    });
    time.setMinutes(time.getMinutes() + 1);
  }
  return data;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 border border-border rounded-lg shadow-md text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium" style={{ color: p.color }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function ChartCard({ title, data }: { title: React.ReactNode, data: any[] }) {
  return (
    <Panel className="flex flex-col h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-primary flex items-center gap-2 text-lg">
            <LineChartIcon className="size-5" />
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Live trend by interval</p>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 rounded-md border hover:bg-muted transition-colors"><Minimize2 className="size-4 text-muted-foreground"/></button>
          <button className="p-1.5 rounded-md border hover:bg-muted transition-colors"><Expand className="size-4 text-muted-foreground"/></button>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="hsl(var(--muted-foreground)/0.2)" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickMargin={10} minTickGap={30} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickMargin={10} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} iconType="diamond" />
            <Line type="monotone" dataKey="Value" stroke="#2dd4bf" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="step" dataKey="Ceiling" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} strokeDasharray="4 4" />
            <Line type="step" dataKey="Floor" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function RealtimeChart() {
  const { machineId } = Route.useSearch();
  const machine = machines.find((m) => m.id === machineId);
  const machineName = machine ? machine.name : "";
  const titleDisplay = machineName ? `Details: ${machineName} (${machineId})` : `Details (${machineId})`;

  const [voltageData, setVoltageData] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [kwData, setKwData] = useState<any[]>([]);
  const [kvarData, setKvarData] = useState<any[]>([]);

  useEffect(() => {
    setVoltageData(generateData(224.32, 10, 240, 0, 100));
    setCurrentData(generateData(165.543, 30, 200, 0, 100));
    setKwData(generateData(105.101, 20, 120, 0, 100));
    setKvarData(generateData(0, 0, 8, 0, 100));
  }, [machineId]);

  return (
    <div className="space-y-4 pb-10">
      <div className="mb-2">
        <Link to="/dashboard/realtime" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" />
          Back to Realtime Dashboard
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <PageHeader icon={Activity} title={titleDisplay} />
        <div className="flex items-center gap-2 bg-card p-1.5 rounded-lg shadow-sm border border-border">
          <input 
            type="number" 
            defaultValue={1} 
            className="w-16 flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors text-center font-medium" 
          />
          <div className="w-32">
            <SelectInput 
              defValue="Hour(s)" 
              datalist={[{label: "Hour(s)", value: "Hour(s)"}, {label: "Minute(s)", value: "Minute(s)"}]} 
              onChange={() => {}} 
              hideClear 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ChartCard 
          title={<span className="text-foreground">Voltage: <span className="font-normal">{voltageData[voltageData.length - 1]?.Value || "224.32"} v</span></span>} 
          data={voltageData}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ChartCard 
            title={<span className="text-foreground">Current: <span className="font-normal">{currentData[currentData.length - 1]?.Value || "165.543"} A</span></span>} 
            data={currentData}
          />
          <ChartCard 
            title={<span className="text-foreground">kW: <span className="font-normal">{kwData[kwData.length - 1]?.Value || "105.101"}</span></span>} 
            data={kwData}
          />
          <ChartCard 
            title={<span className="text-foreground">kVAr: <span className="font-normal">{kvarData[kvarData.length - 1]?.Value || "0"} kVAr</span></span>} 
            data={kvarData}
          />
        </div>
      </div>
    </div>
  );
}
