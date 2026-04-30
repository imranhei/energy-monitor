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
import { tenantService, type TenantPayload } from "@/services/tenant-service";
import type { Tenant } from "@/types";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";

type FormState = TenantPayload;

const initialForm: FormState = {
  name: "",
  short_code: "",
  admin_email: "",
  admin_password: "",
  admin_full_name: "",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  onSuccess: () => void;
};

export default function TenantFormModal({
  open,
  onOpenChange,
  tenant,
  onSuccess,
}: Props) {
  const isEdit = Boolean(tenant);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (tenant) {
      setForm({
        name: tenant.name || "",
        short_code: tenant.short_code || "",
        admin_email: "",
        admin_password: "",
        admin_full_name: "",
      });
    } else {
      setForm(initialForm);
    }
  }, [tenant, open]);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } =
        isEdit && tenant
          ? await tenantService.update(tenant.id, {
              name: form.name,
              short_code: form.short_code,
            })
          : await tenantService.create(form);

      toast.success(
        data.message ||
          (isEdit
            ? "Tenant updated successfully"
            : "Tenant created successfully"),
      );

      onOpenChange(false);
      setForm(initialForm);
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
          <DialogTitle>
            {isEdit ? "Edit Tenant" : "Create Tenant Company"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="David Jones"
              />
            </div>

            <div className="space-y-2">
              <Label>Short Code</Label>
              <Input
                value={form.short_code}
                onChange={(e) => handleChange("short_code", e.target.value)}
                placeholder="DJ"
              />
            </div>
          </div>

          {!isEdit && (
            <div className="border-t pt-5">
              <h3 className="mb-4 font-semibold">Tenant Admin Account</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Admin Full Name</Label>
                  <Input
                    value={form.admin_full_name}
                    onChange={(e) =>
                      handleChange("admin_full_name", e.target.value)
                    }
                    placeholder="DJ Admin"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input
                    type="email"
                    name="tenant_admin_email"
                    autoComplete="new-email"
                    value={form.admin_email}
                    onChange={(e) =>
                      handleChange("admin_email", e.target.value)
                    }
                    placeholder="admin@dj.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Admin Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="tenant_admin_password"
                      autoComplete="new-password"
                      value={form.admin_password}
                      onChange={(e) =>
                        handleChange("admin_password", e.target.value)
                      }
                      placeholder="Enter password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Tenant"
                : "Create Tenant"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
