"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { userService } from "@/services/user-service";
import { getApiErrorMessage } from "@/lib/api-kit";
import { useAppSelector } from "@/store/hooks";
import type { Role } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormState = {
  full_name: string;
  email: string;
  password: string;
  role: Role | "";
};

type Props = {
  onCreated: () => void;
};

export default function CreateUserModal({ onCreated }: Props) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
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
        { label: "Ampec Support", value: "ampec_support" as Role },
        { label: "Admin", value: "admin" as Role },
        { label: "Energy Manager", value: "energy_manager" as Role },
        { label: "Viewer", value: "viewer" as Role },
      ];
    }

    if (currentUser?.role === "admin") {
      return [
        { label: "Energy Manager", value: "energy_manager" as Role },
        { label: "Viewer", value: "viewer" as Role },
      ];
    }

    return [];
  }, [currentUser]);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      setOpen(false);
      onCreated();

      setForm({
        full_name: "",
        email: "",
        password: "",
        role: "",
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
        Create User
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="John Smith"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select onValueChange={(value) => handleChange("role", value as Role)}>
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
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}