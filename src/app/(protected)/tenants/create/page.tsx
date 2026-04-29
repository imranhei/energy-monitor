"use client";

import RoleGuard from "@/components/auth/role-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-kit";
import { tenantService } from "@/services/tenant-service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateTenantPage() {
  const router = useRouter();

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
      router.push("/tenants");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    // <DashboardLayout>
      <RoleGuard allowedRoles={["super_admin"]}>
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Create Tenant Company</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      placeholder="David Jones"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Short Code</Label>
                    <Input
                      placeholder="DJ"
                      value={form.short_code}
                      onChange={(e) =>
                        handleChange("short_code", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-5">
                  <h3 className="mb-4 font-semibold">Tenant Admin Account</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Admin Full Name</Label>
                      <Input
                        placeholder="DJ Admin"
                        value={form.admin_full_name}
                        onChange={(e) =>
                          handleChange("admin_full_name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Admin Email</Label>
                      <Input
                        type="email"
                        placeholder="admin@dj.com"
                        value={form.admin_email}
                        onChange={(e) =>
                          handleChange("admin_email", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Admin Password</Label>
                      <Input
                        type="password"
                        placeholder="123456"
                        value={form.admin_password}
                        onChange={(e) =>
                          handleChange("admin_password", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating Tenant..." : "Create Tenant"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    // </DashboardLayout>
  );
}
