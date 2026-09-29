import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, Sparkles, Mail } from "lucide-react";
import { PageHeader, Panel, Segmented, StatCard } from "@/components/ui-kit";
import { Zap, Wallet, BellRing, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/reports/summary")({
  head: () => ({
    meta: [
      { title: "Reports Summary — EnergyIQ" },
      { name: "description", content: "Daily, weekly and monthly summaries with AI-generated highlights." },
      { property: "og:title", content: "Reports Summary — EnergyIQ" },
      { property: "og:description", content: "Periodic summaries to share with management." },
    ],
  }),
  component: Summary,
});

const d = {
  Daily: { kwh: "1,948", cost: "2.8 jt", alerts: "4", health: "-1.2" },
  Weekly: { kwh: "13,620", cost: "19.7 jt", alerts: "17", health: "-2.8" },
  Monthly: { kwh: "58,420", cost: "84.4 jt", alerts: "63", health: "-4.1" },
};

function Summary() {
  const [p, setP] = useState<keyof typeof d>("Weekly");
  const s = d[p];
  return (
    <div className="space-y-5">
      <PageHeader icon={ClipboardList} title="Reports - Summary">
        <Segmented value={p} options={["Daily", "Weekly", "Monthly"]} onChange={setP} />
        <button className="flex h-10 items-center gap-2 rounded-lg border bg-card px-4 text-sm shadow-sm"><Mail className="size-4" />Schedule email</button>
      </PageHeader>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Consumption" value={s.kwh} unit="kWh" icon={Zap} tone="primary" />
        <StatCard label="Cost" value={`Rp ${s.cost}`} icon={Wallet} tone="warning" />
        <StatCard label="Alerts" value={s.alerts} icon={BellRing} tone="destructive" />
        <StatCard label="Avg health change" value={s.health} unit="pts" icon={HeartPulse} tone="info" />
      </div>
      <Panel title="Highlights" action={<span className="flex items-center gap-1 rounded-full bg-info/15 px-3 py-1 text-xs font-semibold text-info"><Sparkles className="size-3" />AI-generated</span>}>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>Air Compressor 01 used 18% more energy than its baseline, mostly during night shifts — likely a leak or idle running.</li>
          <li>Chiller 02 health dropped to 44; temperature is forecast to exceed 85 °C within 48 h. Estimated RUL is 21 days.</li>
          <li>Peak demand of 742 kW occurred Tuesday 10:00; shifting Oven 01 warm-up by 1 h could cut peak by ~6%.</li>
          <li>Power factor averaged 0.91, within target.</li>
        </ul>
      </Panel>
    </div>
  );
}
