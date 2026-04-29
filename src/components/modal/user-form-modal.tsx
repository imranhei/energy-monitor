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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api-kit";
import { userService, type UserPayload } from "@/services/user-service";
import { useAppSelector } from "@/store/hooks";
import type { Role, User } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type FormState = {
  full_name: string;
  email: string;
  password: string;
  role: Role | "";
};

const initialForm: FormState = {
  full_name: "",
  email: "",
  password: "",
  role: "",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess: () => void;
};

export default function UserFormModal({
  open,
  onOpenChange,
  user,
  onSuccess,
}: Props) {
  const isEdit = Boolean(user);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

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

  useEffect(() => {
    if (!open) return;

    if (user) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        password: "",
        role: user.role,
      });
    } else {
      setForm(initialForm);
    }
  }, [open, user]);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.role) {
      toast.error("Please select a role");
      return;
    }

    if (!isEdit && !form.password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const payload: UserPayload = {
        email: form.email,
        full_name: form.full_name,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const { data } =
        isEdit && user
          ? await userService.update(user.id, payload)
          : await userService.create(payload as Required<UserPayload>);

      toast.success(
        data.message ||
          (isEdit ? "User updated successfully" : "User created successfully"),
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
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              name="user_full_name"
              autoComplete="off"
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="John Smith"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="user_email"
              autoComplete="new-email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Password{" "}
              {isEdit && (
                <span className="text-muted-foreground">(optional)</span>
              )}
            </Label>
            <Input
              type="password"
              name="user_password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder={
                isEdit
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) => handleChange("role", value as Role)}
            >
              <SelectTrigger className="w-full">
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
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update User"
                : "Create User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
