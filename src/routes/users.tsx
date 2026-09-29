import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Plus } from "lucide-react";
import { PageHeader, Panel, Pill } from "@/components/ui-kit";
import { users as seed } from "@/lib/mock";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users Management — EnergyIQ" },
      { name: "description", content: "Manage users and role-based access: Admin, Manager, Engineer, Viewer." },
      { property: "og:title", content: "Users Management — EnergyIQ" },
      { property: "og:description", content: "Role-based access for your team." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const [rows, setRows] = useState(seed);
  return (
    <div>
      <PageHeader icon={Users} title="Users Management">
        <button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm text-primary-foreground shadow-sm"><Plus className="size-4" />Add user</button>
      </PageHeader>
      <Panel>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b"><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th /></tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.email} className="border-b last:border-0">
                <td className="py-3 font-medium">{u.name}</td><td className="text-muted-foreground">{u.email}</td>
                <td><Pill tone={u.role === "Admin" ? "info" : u.role === "Manager" ? "primary" : "muted"}>{u.role}</Pill></td>
                <td><Pill tone={u.active ? "success" : "muted"}>{u.active ? "active" : "inactive"}</Pill></td>
                <td className="text-muted-foreground">{u.last}</td>
                <td className="space-x-2 text-right">
                  <button className="text-xs text-primary hover:underline">Reset password</button>
                  <button onClick={() => setRows((r) => r.map((x) => (x.email === u.email ? { ...x, active: !x.active } : x)))} className="text-xs text-destructive hover:underline">{u.active ? "Deactivate" : "Activate"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
