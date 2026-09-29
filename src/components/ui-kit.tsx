import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";

export function PageHeader({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <Icon className="size-6" />
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex-1" />
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl bg-card p-5 shadow-sm ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const tones = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/15 text-success",
};
export type Tone = keyof typeof tones;

export function StatCard({ label, value, unit, icon: Icon, tone, hint, subtext }: { label: string; value: ReactNode; unit?: string; icon: LucideIcon; tone: Tone; hint?: string; subtext?: ReactNode }) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-foreground/80">
          {label}
          {hint && <Info className="size-4 text-primary" aria-label={hint} />}
        </div>
        <div className={`grid size-8 place-items-center rounded-full ${tones[tone]}`}><Icon className="size-4" /></div>
      </div>
      <div className="mt-4 text-2xl font-bold tabular-nums">
        {value} {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
      {subtext && <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>}
    </div>
  );
}

export function Pill({ tone, children }: { tone: Tone | "muted"; children: ReactNode }) {
  const c = tone === "muted" ? "bg-muted text-muted-foreground" : tones[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${c}`}>{children}</span>;
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg bg-secondary p-1">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${value === o ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function FilterSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 min-w-44 rounded-lg border bg-card px-3 text-sm text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

export const sevTone = { info: "primary", warning: "warning", critical: "destructive" } as const;
export const statusTone = { open: "destructive", acknowledged: "warning", resolved: "success" } as const;
export const healthTone = (h: number): Tone => (h >= 80 ? "success" : h >= 60 ? "warning" : "destructive");
