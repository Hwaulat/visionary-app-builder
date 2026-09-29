import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutGrid, ChevronDown, FileBarChart, BellRing, Database, Users, Bot, PanelLeft, Moon, Sun, Bell, Zap,
} from "lucide-react";

type Item = { label: string; to?: string; icon: typeof LayoutGrid; children?: { label: string; to: string }[]; badge?: number };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Monitoring",
    items: [
      { label: "Dashboard", icon: LayoutGrid, children: [
        { label: "General", to: "/" },
        { label: "Details", to: "/dashboard/details" },
        { label: "Real-time", to: "/dashboard/realtime" },
      ] },
      { label: "Alert Logs", to: "/alerts", icon: BellRing, badge: 3 },
      { label: "AI Assistant", to: "/assistant", icon: Bot },
    ],
  },
  {
    title: "Report & Analysis",
    items: [
      { label: "Reports", icon: FileBarChart, children: [
        { label: "Overview", to: "/reports" },
        { label: "Summary", to: "/reports/summary" },
      ] },
    ],
  },
  {
    title: "Setup System",
    items: [
      { label: "Master Data", to: "/master-data", icon: Database },
      { label: "Users Management", to: "/users", icon: Users },
    ],
  },
];

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right leading-tight">
      <div className="font-semibold tabular-nums">{now ? now.toLocaleTimeString("en-GB") : "--:--:--"}</div>
      <div className="text-xs text-muted-foreground">
        {now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : ""}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ Dashboard: true, Reports: true });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className={`${collapsed ? "w-16" : "w-64"} sticky top-0 flex h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-all`}>
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
            <Zap className="size-5" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-bold text-sidebar-accent-foreground">EnergyIQ - Monitoring</div>
              <div className="text-xs text-sidebar-primary">Predictive Maintenance</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {groups.map((g) => (
            <div key={g.title} className="mb-2">
              {!collapsed && (
                <div className="flex items-center gap-2 px-2 py-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
                  {g.title}<span className="h-px flex-1 bg-sidebar-border" />
                </div>
              )}
              {g.items.map((it) => {
                const Icon = it.icon;
                const active = it.to ? path === it.to : it.children?.some((c) => c.to === path);
                const cls = `relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent ${active ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-sidebar-primary" : ""}`;
                if (it.children) {
                  return (
                    <div key={it.label}>
                      <button className={cls} onClick={() => setOpen((o) => ({ ...o, [it.label]: !o[it.label] }))}>
                        <Icon className="size-5 shrink-0" />
                        {!collapsed && <><span className="flex-1 text-left">{it.label}</span><ChevronDown className={`size-4 transition-transform ${open[it.label] ? "rotate-180" : ""}`} /></>}
                      </button>
                      {open[it.label] && !collapsed && (
                        <div className="ml-6 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                          {it.children.map((c) => (
                            <Link key={c.to} to={c.to} className={`block rounded-md px-3 py-1.5 text-sm hover:text-sidebar-accent-foreground ${path === c.to ? "font-semibold text-sidebar-primary" : "text-sidebar-foreground/80"}`}>
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={it.label} to={it.to!} className={cls}>
                    <Icon className="size-5 shrink-0" />
                    {!collapsed && <span className="flex-1">{it.label}</span>}
                    {!collapsed && it.badge ? <span className="grid size-5 place-items-center rounded-full bg-sidebar-primary text-[11px] text-sidebar-primary-foreground">{it.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="flex items-center justify-between border-t border-sidebar-border px-4 py-3 text-xs text-sidebar-foreground/60">
          <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-success" />{!collapsed && "System Online"}</span>
          {!collapsed && <span>v0.1</span>}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-card px-6">
          <button aria-label="Toggle sidebar" onClick={() => setCollapsed((c) => !c)} className="rounded-md p-2 text-muted-foreground hover:bg-muted">
            <PanelLeft className="size-5" />
          </button>
          <div className="flex-1" />
          <button aria-label="Toggle theme" onClick={() => setDark((d) => !d)} className="rounded-md p-2 text-muted-foreground hover:bg-muted">
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <Clock />
          <Link to="/alerts" aria-label="Alerts" className="relative rounded-md p-2 text-muted-foreground hover:bg-muted">
            <Bell className="size-5" />
            <span className="absolute -right-1 -top-0.5 rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">9+</span>
          </Link>
          <div className="flex items-center gap-3 border-l pl-4">
            <div className="grid size-9 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">A</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">admin</div>
              <div className="text-xs text-muted-foreground">Super Admin</div>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
