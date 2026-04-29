"use client";

import { useAppSelector } from "@/store/hooks";
import type { Role } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const hasAccess = !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!hasAccess) {
      router.replace("/dashboard");
    }
  }, [hasAccess, router]);

  if (!hasAccess) return null;

  return children;
}
