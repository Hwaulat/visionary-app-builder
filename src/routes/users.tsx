import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Plus,
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
import { Search } from "@/components/ui/search";
import { SelectInput } from "@/components/ui/custom-select";
import { users as seed, type User } from "@/lib/mock";
import { Tabs } from "@/components/ui/custom-tabs";
import { Button } from "@/components/ui/button";

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
  const [activeRole, setActiveRole] = useState("superadmin");

  const roles = ["superadmin", "admin", "member", "test", "fasf"];
  const menus = [
    "Dashboard - General",
    "Dashboard - Details",
    "Dashboard - Real-time",
    "AI Analytics - Machine Overview",
    "AI Analytics - Forecasting",
    "AI Analytics - RUL Estimation",
    "AI Analytics - Anomaly Detection",
    "Reports - Overview",
    "Reports - Summary",
    // "Master Data - Overview",
    // "Master Data - Device",
    "Users Management",
    "Log Alert",
  ];

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
          <div className="relative w-full flex-1 min-w-[200px]">
            <Search placeholder="Search by username or email" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SelectInput containerClassName="w-40" datalist={[{ label: "All Role", value: "All Role" }]} defValue="All Role" />
            <SelectInput containerClassName="w-44" datalist={[{ label: "All Department", value: "All Department" }]} defValue="All Department" />
            <SelectInput containerClassName="w-40" datalist={[{ label: "All Position", value: "All Position" }]} defValue="All Position" />
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
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="iconView" icon={<Eye className="size-4" />} />
                      <Button variant="iconView" icon={<RotateCcw className="size-4" />} />
                      <Button variant="iconEdit" icon={<Pencil className="size-4" />} />
                      <Button variant="iconDelete" icon={<Trash2 className="size-4" />} />
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
              <SelectInput
                containerClassName="w-20"
                datalist={[{ label: "10", value: "10" }, { label: "20", value: "20" }, { label: "50", value: "50" }]}
                defValue="10"
              />
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

  const rolePermissionsContent = (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left Column - Roles */}
      <div className="w-full lg:w-1/3 shrink-0 space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0f284a] dark:text-white">Roles</h2>
          <Button variant="blue" icon={<Plus className="size-4" />} text="Create New Role" size="sm" className="h-8 rounded-lg text-xs" />
        </div>
        <div className="space-y-2">
          {roles.map((r) => {
            const isActive = activeRole === r;
            return (
              <div 
                key={r}
                onClick={() => setActiveRole(r)}
                className={`flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors ${isActive ? 'bg-[#1a4a8c] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
              >
                <span className="font-medium">{r}</span>
                <div className="flex gap-2">
                  <div className={`grid size-7 place-items-center rounded-lg border ${isActive ? 'border-blue-400/30 text-white hover:bg-blue-600' : 'border-slate-200 text-slate-400 bg-white hover:border-blue-400 hover:text-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'}`}>
                    <Pencil className="size-3.5" />
                  </div>
                  <div className="grid size-7 place-items-center rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm">
                    <Trash2 className="size-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column - Permissions */}
      <div className="flex-1 rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-[#0f284a] dark:text-white">{activeRole}</h2>
          <p className="text-sm text-slate-500 mt-1">Manage permissions for this role</p>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8fafc] dark:bg-slate-800/50 text-slate-500 text-xs font-semibold">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-5 text-left uppercase">Fitur</th>
                <th className="py-3 px-5 text-center uppercase w-32">All Access</th>
                <th className="py-3 px-5 text-center uppercase w-32">Only View</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m) => (
                <tr key={m} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-5 font-medium text-slate-700 dark:text-slate-300">{m}</td>
                  <td className="py-3.5 px-5 text-center">
                    <input type="checkbox" defaultChecked className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <input type="checkbox" className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      label: "Role Permissions",
      content: rolePermissionsContent,
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
      <Tabs items={tabsItems} variant="solid" />
    </div>
  );
}
