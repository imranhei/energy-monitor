"use client";

import RoleGuard from "@/components/auth/role-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import CreateUserModal from "@/components/modal/create-user-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-kit";
import { userService } from "@/services/user-service";
import type { User } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const formatRole = (role: string) =>
  role
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await userService.list();
      setUsers(data.results);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    // <DashboardLayout>
      <RoleGuard allowedRoles={["super_admin", "admin"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Users & Roles</h1>
              <p className="text-muted-foreground">
                Manage company users and permissions.
              </p>
            </div>

            <CreateUserModal onCreated={fetchUsers} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users found.</p>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Tenant</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="px-4 py-3 font-medium">
                            {user.full_name || "-"}
                          </td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-muted px-2 py-1 text-xs">
                              {formatRole(user.role)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {user.tenant?.name || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    // </DashboardLayout>
  );
}
