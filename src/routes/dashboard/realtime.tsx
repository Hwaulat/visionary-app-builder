import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { PageHeader, Pill } from "@/components/ui-kit";
import { machines } from "@/lib/mock";

export const Route = createFileRoute("/dashboard/realtime")({
  head: () => ({
    meta: [
      { title: "Real-time Monitoring — EnergyIQ" },
      { name: "description", content: "Live machine readings refreshed every 5 seconds with connection status." },
      { property: "og:title", content: "Real-time Monitoring — EnergyIQ" },
      { property: "og:description", content: "Live machine readings and threshold breaches." },
    ],
  }),
  component: Realtime,
});

const LIMIT = 80;

function read(seed: number) {
  return { kw: +(20 + Math.random() * 60).toFixed(1), temp: +(55 + seed % 7 * 4 + Math.random() * 8).toFixed(1), amp: +(30 + Math.random() * 20).toFixed(1) };
}

function Realtime() {
  const [tick, setTick] = useState(0);
  const [vals, setVals] = useState(() => machines.map((_, i) => ({ kw: 0, temp: 0, amp: 0, i })));
  useEffect(() => {
    const upd = () => setVals(machines.map((_, i) => ({ ...read(i + 3), i })));
    upd();
    const t = setInterval(() => { upd(); setTick((x) => x + 1); }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader icon={Radio} title="Dashboard - Real-time">
        <span className="flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-success" />Live · refresh 5 s · update #{tick}</span>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {machines.map((m, i) => {
          const v = vals[i];
          const breach = m.status !== "offline" && v.temp > LIMIT;
          const off = m.status === "offline";
          return (
            <div key={m.id} className={`rounded-xl bg-card p-5 shadow-sm ring-2 transition ${breach ? "ring-destructive" : "ring-transparent"} ${off ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div><div className="text-xs text-muted-foreground">{m.id}</div><div className="font-semibold">{m.name}</div></div>
                <Pill tone={m.status === "online" ? "success" : m.status === "stale" ? "warning" : "muted"}>
                  {m.status === "offline" ? <WifiOff className="mr-1 size-3" /> : <Wifi className="mr-1 size-3" />}{m.status}
                </Pill>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[["kW", v.kw], ["°C", v.temp], ["A", v.amp]].map(([u, n]) => (
                  <div key={u} className="rounded-lg bg-muted py-2">
                    <div className={`text-lg font-bold tabular-nums ${u === "°C" && breach ? "text-destructive" : ""}`}>{off ? "—" : n}</div>
                    <div className="text-xs text-muted-foreground">{u}</div>
                  </div>
                ))}
              </div>
              {m.status === "stale" && <p className="mt-3 text-xs text-warning">Last reading older than 30 s</p>}
              {breach && (
                <Link to="/alerts" className="mt-3 flex items-center gap-1 text-xs font-semibold text-destructive hover:underline">
                  <AlertTriangle className="size-3" />Temperature above {LIMIT} °C — view alert
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
