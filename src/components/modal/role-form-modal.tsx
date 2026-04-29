"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-kit";
import {
  roleService,
  type RoleItem,
  type RolePayload,
} from "@/services/role-service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleItem | null;
  onSuccess: () => void;
};

export default function RoleFormModal({
  open,
  onOpenChange,
  role,
  onSuccess,
}: Props) {
  const isEdit = Boolean(role);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RolePayload>({
    name: "",
    code: "",
    active: true,
  });

  useEffect(() => {
    if (!open) return;

    if (role) {
      setForm({
        name: role.name,
        code: role.code,
        active: role.active,
      });
    } else {
      setForm({
        name: "",
        code: "",
        active: true,
      });
    }
  }, [open, role]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } =
        isEdit && role
          ? await roleService.update(role.id, form)
          : await roleService.create({
              name: form.name,
              code: form.code,
            });

      toast.success(
        data.message ||
          (isEdit ? "Role updated successfully" : "Role created successfully"),
      );

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Energy Manager"
            />
          </div>

          <div className="space-y-2">
            <Label>Role Code</Label>
            <Input
              value={form.code}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="energy_manager"
              disabled={isEdit}
            />
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
              <input
                type="checkbox"
                checked={!!form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
              />
              Active role
            </label>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Role"
                : "Create Role"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
