"use client";

import { logoutUser, setUser } from "@/features/auth/authSlice";
import { apiKit } from "@/lib/api-kit";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { User } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileResponse = {
  status: "success";
  message: string;
  code: number;
  results: User;
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      if (!accessToken && !refreshToken) {
        dispatch(logoutUser());
        router.replace("/login");
        return;
      }

      if (user) {
        setChecking(false);
        return;
      }

      try {
        const { data } = await apiKit.get<ProfileResponse>("/auth/profile/");
        dispatch(setUser(data.results));
      } catch {
        dispatch(logoutUser());
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [mounted, user, accessToken, refreshToken, dispatch, router]);

  if (!mounted || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return children;
}
