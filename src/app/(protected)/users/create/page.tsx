"use client";

import RoleGuard from "@/components/auth/role-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api-kit";
import { userService } from "@/services/user-service";
import { useAppSelector } from "@/store/hooks";
import type { Role } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FormState = {
  full_name: string;
  email: string;
  password: string;
  role: Role | "";
};

export default function CreateUserPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    full_name: "",
    email: "",
    password: "",
    role: "",
  });

  const allowedRoles = useMemo(() => {
    if (currentUser?.role === "super_admin") {
      return [
        { label: "Ampec Support", value: "ampec_support" },
        { label: "Admin", value: "admin" },
        { label: "Energy Manager", value: "energy_manager" },
        { label: "Viewer", value: "viewer" },
      ];
    }

    if (currentUser?.role === "admin") {
      return [
        { label: "Energy Manager", value: "energy_manager" },
        { label: "Viewer", value: "viewer" },
      ];
    }

    return [];
  }, [currentUser]);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.role) {
      toast.error("Please select a role");
      return;
    }

    try {
      setLoading(true);

      const { data } = await userService.create({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      toast.success(data.message || "User created successfully");
      router.push("/users");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    // <DashboardLayout>
      <RoleGuard allowedRoles={["super_admin", "admin"]}>
        <div className="mx-auto max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Create User</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="John Smith"
                    value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    onValueChange={(value) =>
                      handleChange("role", value as Role)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      {allowedRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating User..." : "Create User"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    // {/* </DashboardLayout> */}
  );
}
