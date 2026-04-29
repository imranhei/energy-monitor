"use client";

import RoleGuard from "@/components/auth/role-guard";
import DataTable, {
  type DataTableColumn,
} from "@/components/common/data-table";
import AssignPermissionsModal from "@/components/modal/assign-permissions-modal";
import RoleFormModal from "@/components/modal/role-form-modal";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-kit";
import { confirmAlert } from "@/lib/confirm-alert";
import {
  roleService,
  type Permission,
  type RoleItem,
} from "@/services/role-service";
import { KeyRound, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [rolesResponse, permissionsResponse] = await Promise.all([
        roleService.list(),
        roleService.permissions(),
      ]);

      setRoles(rolesResponse.data.results);
      setPermissions(permissionsResponse.data.results);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedRole(null);
    setRoleModalOpen(true);
  };

  const handleEdit = (role: RoleItem) => {
    setSelectedRole(role);
    setRoleModalOpen(true);
  };

  const handleAssignPermissions = (role: RoleItem) => {
    setSelectedRole(role);
    setPermissionModalOpen(true);
  };

  const handleDelete = async (role: RoleItem) => {
    const confirmed = await confirmAlert(
      "Deactivate role?",
      `Role "${role.name}" will be deactivated.`,
    );

    if (!confirmed) return;

    try {
      const { data } = await roleService.delete(role.id);
      toast.success(data.message || "Role deactivated successfully");
      fetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const columns: DataTableColumn<RoleItem>[] = [
    {
      key: "name",
      header: "Role",
      className: "font-medium",
    },
    {
      key: "code",
      header: "Code",
      render: (role) => (
        <span className="rounded-md bg-muted px-2 py-1 text-xs">
          {role.code}
        </span>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (role) => (
        <span className="text-sm text-muted-foreground">
          {role.permissions?.length || 0} assigned
        </span>
      ),
    },
    {
      key: "is_system_role",
      header: "System",
      render: (role) =>
        role.is_system_role ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            <ShieldCheck className="size-3" />
            System
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "active",
      header: "Status",
      render: (role) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            role.active
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {role.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (role) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAssignPermissions(role)}
          >
            <KeyRound className="size-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleEdit(role)}
            disabled={role.is_system_role}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(role)}
            disabled={role.is_system_role}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <RoleGuard allowedRoles={["super_admin", "admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and assign access permissions.
            </p>
          </div>

          <Button onClick={handleCreate}>Create Role</Button>
        </div>

        <DataTable
          columns={columns}
          data={roles}
          loading={loading}
          emptyMessage="No roles found."
          minWidth="1000px"
          getRowKey={(role) => role.id}
        />

        <RoleFormModal
          open={roleModalOpen}
          onOpenChange={setRoleModalOpen}
          role={selectedRole}
          onSuccess={fetchData}
        />

        <AssignPermissionsModal
          open={permissionModalOpen}
          onOpenChange={setPermissionModalOpen}
          role={selectedRole}
          permissions={permissions}
          onSuccess={fetchData}
        />
      </div>
    </RoleGuard>
  );
}
