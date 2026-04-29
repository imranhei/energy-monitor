"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/lib/api-kit";
import {
  roleService,
  type Permission,
  type RoleItem,
} from "@/services/role-service";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleItem | null;
  permissions: Permission[];
  onSuccess: () => void;
};

export default function AssignPermissionsModal({
  open,
  onOpenChange,
  role,
  permissions,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !role) return;
    setSelected(role.permissions?.map((item) => item.code) || []);
  }, [open, role]);

  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((acc, item) => {
      const group = item.code.split(".")[0] || "other";
      acc[group] ||= [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [permissions]);

  const togglePermission = (code: string) => {
    setSelected((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code],
    );
  };

  const handleSubmit = async () => {
    if (!role) return;

    try {
      setLoading(true);

      const { data } = await roleService.assignPermissions(role.id, selected);

      toast.success(data.message || "Permissions assigned successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Permissions — {role.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {Object.entries(groupedPermissions).map(([group, items]) => (
            <div key={group} className="rounded-lg border p-4">
              <h3 className="mb-3 font-semibold capitalize">{group}</h3>

              <div className="grid gap-3 md:grid-cols-2">
                {items.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(permission.code)}
                      onChange={() => togglePermission(permission.code)}
                      className="mt-1"
                    />

                    <span>
                      <span className="block font-medium">
                        {permission.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {permission.code}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Permissions"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
