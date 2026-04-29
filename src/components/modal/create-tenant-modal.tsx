"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-kit";
import { tenantService } from "@/services/tenant-service";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onCreated: () => void;
};

export default function CreateTenantModal({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    short_code: "",
    admin_email: "",
    admin_password: "",
    admin_full_name: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await tenantService.create(form);

      toast.success(data.message || "Tenant created successfully");
      setOpen(false);
      onCreated();

      setForm({
        name: "",
        short_code: "",
        admin_email: "",
        admin_password: "",
        admin_full_name: "",
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
        Create Tenant
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Tenant Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={form.admin_email}
                  onChange={(e) => handleChange("admin_email", e.target.value)}
                  placeholder="admin@dj.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Admin Password</Label>
                <Input
                  type="password"
                  value={form.admin_password}
                  onChange={(e) =>
                    handleChange("admin_password", e.target.value)
                  }
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Tenant"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
