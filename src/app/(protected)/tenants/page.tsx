"use client";

import RoleGuard from "@/components/auth/role-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import CreateTenantModal from "@/components/modal/create-tenant-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-kit";
import { tenantService } from "@/services/tenant-service";
import type { Tenant } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      setLoading(true);

      const { data } = await tenantService.list();
      setTenants(data.results);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    // <DashboardLayout>
      <RoleGuard allowedRoles={["super_admin"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
              <p className="text-muted-foreground">
                Manage company accounts and tenant admins.
              </p>
            </div>

            <CreateTenantModal onCreated={fetchTenants} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tenant List</CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : tenants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tenants found.
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Short Code</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tenants.map((tenant) => (
                        <tr key={tenant.id} className="border-t">
                          <td className="px-4 py-3">{tenant.id}</td>
                          <td className="px-4 py-3 font-medium">
                            {tenant.name}
                          </td>
                          <td className="px-4 py-3">{tenant.short_code}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-950 dark:text-green-400">
                              {tenant.active ? "Active" : "Inactive"}
                            </span>
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
