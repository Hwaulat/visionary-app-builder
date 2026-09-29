import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Eye,
  RotateCcw,
  Pencil,
  Trash2,
  ChevronDown,
  UserCheck,
  UserX,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react";
import { users as seed, type User } from "@/lib/mock";
import { Tabs } from "@/components/ui/custom-tabs";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users Management — EnergyIQ" },
      { name: "description", content: "Manage users, roles, and permissions" },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const [rows, setRows] = useState(seed);

  const totalUsers = rows.length;
  const activeUsers = rows.filter((r) => r.active).length;
  const inactiveUsers = totalUsers - activeUsers;

  const userAccountContent = (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Users className="size-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalUsers}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid size-12 place-items-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <UserCheck className="size-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeUsers}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid size-12 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            <UserX className="size-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Inactive Users</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inactiveUsers}</div>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              placeholder="Search by username or email"
              className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="appearance-none rounded-lg border bg-background py-2 pl-3 pr-8 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>All Role</option>
            </select>
            <select className="appearance-none rounded-lg border bg-background py-2 pl-3 pr-8 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>All Department</option>
            </select>
            <select className="appearance-none rounded-lg border bg-background py-2 pl-3 pr-8 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>All Position</option>
            </select>
            <button className="flex items-center gap-2 rounded-lg bg-[#1a4b8c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#153a6d]">
              <Plus className="size-4" />
              Create New User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase">Action</th>
                <th className="px-4 py-3 font-semibold uppercase">Status</th>
                <th className="px-4 py-3 font-semibold uppercase">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Username <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold uppercase">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Role <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold uppercase">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Department <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold uppercase">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Position <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold uppercase">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Phone <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold uppercase">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    City <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold uppercase">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Country <ArrowUpDown className="size-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="grid size-7 place-items-center rounded border bg-background text-muted-foreground shadow-sm transition hover:text-primary">
                        <Eye className="size-3.5" />
                      </button>
                      <button className="grid size-7 place-items-center rounded border bg-background text-muted-foreground shadow-sm transition hover:text-primary">
                        <RotateCcw className="size-3.5" />
                      </button>
                      <button className="grid size-7 place-items-center rounded border bg-background text-muted-foreground shadow-sm transition hover:text-primary">
                        <Pencil className="size-3.5" />
                      </button>
                      <button className="grid size-7 place-items-center rounded border bg-background text-muted-foreground shadow-sm transition hover:text-destructive">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        setRows((r) =>
                          r.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
                        )
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                        u.active ? "bg-[#1a4b8c]" : "bg-border"
                      }`}
                      role="switch"
                      aria-checked={u.active}
                    >
                      <span
                        className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${
                          u.active ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          u.name
                        )}&background=random&rounded=true&size=128`}
                        alt={u.name}
                        className="size-8 rounded-full shadow-sm"
                      />
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.department}</td>
                  <td className="px-4 py-3">{u.position}</td>
                  <td className="px-4 py-3">{u.phone}</td>
                  <td className="px-4 py-3">{u.city}</td>
                  <td className="px-4 py-3">{u.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select className="rounded-md border bg-background px-2 py-1 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <span>
              1-{rows.length} of {rows.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="grid size-8 place-items-center rounded hover:bg-muted disabled:opacity-50" disabled>
              <ChevronsLeft className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded hover:bg-muted disabled:opacity-50" disabled>
              <ChevronLeft className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded bg-[#1a4b8c] text-white font-medium shadow-sm">
              1
            </button>
            <button className="grid size-8 place-items-center rounded hover:bg-muted disabled:opacity-50" disabled>
              <ChevronRight className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded hover:bg-muted disabled:opacity-50" disabled>
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabsItems = [
    {
      value: "user-account",
      label: "User Account",
      content: userAccountContent,
    },
    {
      value: "role-permission",
      label: "Role Permission",
      content: <div className="py-10 text-center text-muted-foreground">Role permissions management is under construction.</div>,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users className="size-6 text-foreground" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Users Management</h1>
          <p className="text-sm text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
      </div>

      {/* Tabs Component */}
      <Tabs items={tabsItems} variant="pill" className="inline-flex rounded-full border bg-card p-1 shadow-sm" />
    </div>
  );
}
