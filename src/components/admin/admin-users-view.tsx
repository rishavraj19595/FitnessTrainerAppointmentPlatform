"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users, Trash2, Shield, User, Briefcase, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface AdminUsersViewProps {
  initialUsers: any[];
}

export function AdminUsersView({ initialUsers }: AdminUsersViewProps) {
  const router = useRouter();
  const [users, setUsers] = React.useState(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("ALL");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`User ${userName} deleted successfully`);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        router.refresh();
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            User Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Directory of all registered client members, fitness coaches, and administrators.
          </p>
        </div>

        {/* Search and role filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 px-3.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Roles</option>
            <option value="CLIENT">Clients</option>
            <option value="TRAINER">Trainers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.image || ""} />
                        <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        u.role === "ADMIN"
                          ? "destructive"
                          : u.role === "TRAINER"
                          ? "accent"
                          : "success"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {u.phone || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
