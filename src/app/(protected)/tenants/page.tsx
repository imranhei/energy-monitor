"use client";

import RoleGuard from "@/components/auth/role-guard";
import DataTable, {
  type DataTableColumn,
} from "@/components/common/data-table";
import TenantFormModal from "@/components/modal/tenant-form-modal";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-kit";
import { confirmAlert } from "@/lib/confirm-alert";
import { tenantService } from "@/services/tenant-service";
import type { Tenant } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

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

  const handleCreate = () => {
    setSelectedTenant(null);
    setModalOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmAlert(
    "Deactivate tenant?",
    "This tenant will no longer be active."
  );

  if (!confirmed) return;

    try {
      await tenantService.delete(id);
      toast.success("Tenant deleted successfully");
      fetchTenants();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const columns: DataTableColumn<Tenant>[] = [
    {
      key: "name",
      header: "Name",
      className: "font-medium",
    },
    {
      key: "short_code",
      header: "Short Code",
    },
    {
      key: "active",
      header: "Status",
      render: (tenant) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            tenant.active
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {tenant.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (tenant) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleEdit(tenant)}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(tenant.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            <p className="text-muted-foreground">
              Manage company accounts and tenant admins.
            </p>
          </div>

          <Button onClick={handleCreate}>Create Tenant</Button>
        </div>

        <DataTable
          columns={columns}
          data={tenants}
          loading={loading}
          emptyMessage="No tenants found."
          minWidth="700px"
          getRowKey={(tenant) => tenant.id}
        />

        <TenantFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          tenant={selectedTenant}
          onSuccess={fetchTenants}
        />
      </div>
    </RoleGuard>
  );
}
