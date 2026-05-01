"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/features/auth/authSlice";
import { apiKit, getApiErrorMessage } from "@/lib/api-kit";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Loader2 } from "lucide-react";
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
  const [logoutLoading, setLogoutLoading] = useState(false);

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
      setLogoutLoading(true);

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
      setLogoutLoading(false);
    }
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 transition-all duration-300 ${
        isSidebarOpen ? "lg:left-64 left-0" : "left-0"
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

        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={logoutLoading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {logoutLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              initials
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72">
            <div className="border-b p-4">
              <p className="font-medium">{user?.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <DropdownMenuItem>
              <FiSettings className="mr-2" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem>
              <FiShield className="mr-2" />
              Security
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={logoutLoading}
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="text-red-600 focus:text-red-600"
            >
              {logoutLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <FiLogOut className="mr-2" />
              )}
              {logoutLoading ? "Logging out..." : "Log Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
