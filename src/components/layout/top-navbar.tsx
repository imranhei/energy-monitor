"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/features/auth/authSlice";
import { apiKit, getApiErrorMessage } from "@/lib/api-kit";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut, FiMenu, FiSettings, FiShield } from "react-icons/fi";
import { toast } from "sonner";

type TopNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tenants": "Tenants",
  "/users": "Users",
  "/roles": "Roles & Permissions",
  "/sites": "Sites",
  "/bills": "Bills",
  "/consumption": "Consumption",
};

type LogoutResponse = {
  status: "success";
  message: string;
  code: number;
  results: null;
};

export default function TopNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: TopNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [profileOpen, setProfileOpen] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  const activeTitle =
    pageTitles[pathname] ||
    pageTitles[`/${pathname.split("/")[1]}`] ||
    "Dashboard";

  const initials =
    user?.full_name
      ?.split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        const { data } = await apiKit.post<LogoutResponse>("/auth/logout/", {
          refresh: refreshToken,
        });

        toast.success(data.message || "Logout successful");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      dispatch(logoutUser());
      router.push("/login");
    }
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 transition-all duration-300 ${
        isSidebarOpen ? "left-64" : "left-0"
      }`}
    >
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onToggleSidebar}>
          <FiMenu />
        </Button>

        <div>
          <h1 className="text-lg font-semibold">{activeTitle}</h1>
        </div>
      </div>

      <div className="relative flex items-center gap-3">
        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setProfileOpen((prev) => !prev)}
          className="rounded-full border bg-background hover:bg-muted"
        >
          {initials}
        </Button>

        {profileOpen && (
          <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-lg border bg-background shadow-lg">
            <div className="border-b p-4">
              <p className="font-medium">{user?.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted">
              <FiSettings />
              Settings
            </button>

            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted">
              <FiShield />
              Security
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 border-t px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <FiLogOut />
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
