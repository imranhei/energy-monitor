"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiKit, getApiErrorMessage } from "@/lib/api-kit";
import { logoutUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { navGroups } from "@/lib/constants";

type AppSidebarProps = {
  isOpen: boolean;
};

type LogoutResponse = {
  status: "success";
  message: string;
  code: number;
  results: null;
};

export default function AppSidebar({ isOpen }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.user);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

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
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-background transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="border-b p-5">
        <div className="text-xl font-bold">
          Ampec <em className="font-normal text-muted-foreground">Energy</em>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {currentUser?.tenant?.name || "Ampec"} — Prod
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.permission) return true;
            if (!currentUser) return false;

            return item.permission.includes(currentUser.role);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </div>

              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.page}
                      href={item.href}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted ${
                        isActive ? "bg-muted font-medium" : ""
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive
                            ? "bg-primary"
                            : "bg-muted-foreground/40"
                        }`}
                      />

                      <span className="flex-1">{item.label}</span>

                      {item.count && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            item.alert
                              ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold">
            {currentUser?.full_name
              ? currentUser.full_name
                  .split(" ")
                  .map((item) => item[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "U"}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {currentUser?.full_name || currentUser?.email || "User"}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {currentUser?.role?.replace("_", " ")}
            </div>
          </div>
        </div>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <FiLogOut className="mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}