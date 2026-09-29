import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Database, Plus, Upload } from "lucide-react";
import { PageHeader, Panel, Segmented, Pill, healthTone } from "@/components/ui-kit";
import { machines } from "@/lib/mock";

export const Route = createFileRoute("/master-data")({
  head: () => ({
    meta: [
      { title: "Master Data — EnergyIQ" },
      { name: "description", content: "Manage plants, machines, sensors, tag mapping, thresholds and tariffs." },
      { property: "og:title", content: "Master Data — EnergyIQ" },
      { property: "og:description", content: "Reference data that keeps monitoring accurate." },
    ],
  }),
  component: MasterData,
});

const tabs = ["Machines", "Tag Mapping", "Thresholds", "Tariffs"] as const;

function MasterData() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Machines");
  return (
    <div>
      <PageHeader icon={Database} title="Master Data">
        <button className="flex h-10 items-center gap-2 rounded-lg border bg-card px-4 text-sm shadow-sm"><Upload className="size-4" />Import Excel</button>
        <button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm text-primary-foreground shadow-sm"><Plus className="size-4" />Add</button>
      </PageHeader>
      <div className="mb-4"><Segmented value={tab} options={[...tabs]} onChange={setTab} /></div>
      <Panel>
        <table className="w-full text-sm">
          {tab === "Machines" && (<>
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b"><th className="py-2">ID</th><th>Name</th><th>Area</th><th>Line</th><th>Install date</th><th>Health</th></tr></thead>
            <tbody>{machines.map((m, i) => <tr key={m.id} className="border-b last:border-0"><td className="py-2.5 font-medium">{m.id}</td><td>{m.name}</td><td>{m.area}</td><td>{m.line}</td><td>{2018 + (i % 6)}-0{(i % 9) + 1}-15</td><td><Pill tone={healthTone(m.health)}>{m.health}</Pill></td></tr>)}</tbody>
          </>)}
          {tab === "Tag Mapping" && (<>
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b"><th className="py-2">Source</th><th>Address</th><th>Machine</th><th>Metric</th></tr></thead>
            <tbody>{machines.slice(0, 6).map((m, i) => <tr key={m.id} className="border-b last:border-0"><td className="py-2.5">{i % 2 ? "Modbus" : "MQTT"}</td><td className="font-mono text-xs">{i % 2 ? `40${100 + i}` : `plant/${m.area.toLowerCase()}/${m.id}/kwh`}</td><td>{m.id}</td><td>{i % 2 ? "Temperature" : "kWh"}</td></tr>)}</tbody>
          </>)}
          {tab === "Thresholds" && (<>
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b"><th className="py-2">Metric</th><th>Warning</th><th>Critical</th><th>Scope</th></tr></thead>
            <tbody>{[["Temperature", "75 °C", "85 °C"], ["Vibration", "4.5 mm/s", "7.1 mm/s"], ["Current", "45 A", "50 A"], ["Power factor", "< 0.85", "< 0.80"]].map((r) => <tr key={r[0]} className="border-b last:border-0"><td className="py-2.5 font-medium">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>All machines</td></tr>)}</tbody>
          </>)}
          {tab === "Tariffs" && (<>
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b"><th className="py-2">Name</th><th>Period</th><th>Rate (Rp/kWh)</th></tr></thead>
            <tbody>{[["LWBP", "22:00–17:00", "1,035.78"], ["WBP (peak)", "17:00–22:00", "1,553.67"]].map((r) => <tr key={r[0]} className="border-b last:border-0"><td className="py-2.5 font-medium">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
          </>)}
        </table>
      </Panel>
    </div>
  );
}
