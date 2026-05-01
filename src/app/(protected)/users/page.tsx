"use client";

import RoleGuard from "@/components/auth/role-guard";
import DataTable, {
  type DataTableColumn,
} from "@/components/common/data-table";
import UserFormModal from "@/components/modal/user-form-modal";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-kit";
import { confirmAlert } from "@/lib/confirm-alert";
import { userService } from "@/services/user-service";
import type { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const formatRole = (role: string) =>
  role
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

export default function UsersPage() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await userService.list();
      return data.results;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: ({ data }) => {
      toast.success(data.message || "User deactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmAlert(
      "Deactivate user?",
      "This user will no longer be active.",
    );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  const columns: DataTableColumn<User>[] = useMemo(
    () => [
      {
        key: "full_name",
        header: "Name",
        className: "font-medium",
        render: (user) => user.full_name || "-",
      },
      {
        key: "email",
        header: "Email",
      },
      {
        key: "role",
        header: "Role",
        render: (user) => (
          <span className="rounded-full bg-muted px-2 py-1 text-xs">
            {formatRole(user.role)}
          </span>
        ),
      },
      {
        key: "tenant",
        header: "Tenant",
        render: (user) => user.tenant?.name || "-",
      },
      {
        key: "actions",
        header: "Actions",
        render: (user) => (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleEdit(user)}
            >
              <Pencil className="size-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => handleDelete(user.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation.isPending],
  );

  return (
    <RoleGuard allowedRoles={["super_admin", "admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage company users and permissions.
            </p>
          </div>

          <Button onClick={handleCreate}>Create User</Button>
        </div>

        <DataTable
          columns={columns}
          data={users}
          loading={isLoading}
          emptyMessage="No users found."
          minWidth="900px"
          getRowKey={(user) => user.id}
        />

        <UserFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          user={selectedUser}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        />
      </div>
    </RoleGuard>
  );
}
