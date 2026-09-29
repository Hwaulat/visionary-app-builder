import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BellRing, Search } from "lucide-react";
import { PageHeader, Panel, FilterSelect, Pill, sevTone, statusTone } from "@/components/ui-kit";
import { alerts as seed, type Alert } from "@/lib/mock";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alert Logs — EnergyIQ" },
      { name: "description", content: "Searchable history of threshold, connection and predictive alerts." },
      { property: "og:title", content: "Alert Logs — EnergyIQ" },
      { property: "og:description", content: "Audit and follow up machine alerts." },
    ],
  }),
  component: Alerts,
});

function Alerts() {
  const [rows, setRows] = useState<Alert[]>(seed);
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("All Severity");
  const [type, setType] = useState("All Type");
  const [status, setStatus] = useState("All Status");

  const list = useMemo(() => rows.filter((a) =>
    (!q || `${a.machine} ${a.metric} ${a.id}`.toLowerCase().includes(q.toLowerCase())) &&
    (sev === "All Severity" || a.severity === sev) &&
    (type === "All Type" || a.type === type) &&
    (status === "All Status" || a.status === status)), [rows, q, sev, type, status]);

  const act = (id: string, s: Alert["status"]) => setRows((r) => r.map((a) => (a.id === id ? { ...a, status: s, ackBy: "admin" } : a)));

  return (
    <div>
      <PageHeader icon={BellRing} title="Alert Logs">
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search machine, metric…" className="h-10 rounded-lg border bg-card pl-9 pr-3 text-sm shadow-sm" />
        </div>
        <FilterSelect value={sev} onChange={setSev} options={["All Severity", "info", "warning", "critical"]} />
        <FilterSelect value={type} onChange={setType} options={["All Type", "threshold", "connection", "predictive"]} />
        <FilterSelect value={status} onChange={setStatus} options={["All Status", "open", "acknowledged", "resolved"]} />
      </PageHeader>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b">{["ID", "Timestamp", "Machine", "Metric", "Value", "Type", "Severity", "Status", "Ack by", ""].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-3 py-3 font-medium">{a.id}</td>
                  <td className="px-3 py-3 tabular-nums text-muted-foreground">{a.time}</td>
                  <td className="px-3 py-3">{a.machine}</td>
                  <td className="px-3 py-3">{a.metric}</td>
                  <td className="px-3 py-3">{a.value}</td>
                  <td className="px-3 py-3"><Pill tone={a.type === "predictive" ? "info" : "muted"}>{a.type}</Pill></td>
                  <td className="px-3 py-3"><Pill tone={sevTone[a.severity]}>{a.severity}</Pill></td>
                  <td className="px-3 py-3"><Pill tone={statusTone[a.status]}>{a.status}</Pill></td>
                  <td className="px-3 py-3 text-muted-foreground">{a.ackBy ?? "—"}</td>
                  <td className="px-3 py-3 text-right">
                    {a.status === "open" && <button onClick={() => act(a.id, "acknowledged")} className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Acknowledge</button>}
                    {a.status === "acknowledged" && <button onClick={() => act(a.id, "resolved")} className="rounded-md border px-3 py-1 text-xs font-medium">Resolve</button>}
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={10} className="py-10 text-center text-muted-foreground">No alerts match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
