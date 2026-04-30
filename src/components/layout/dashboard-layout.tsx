"use client";

import AuthGuard from "@/components/auth/auth-guard";
import { useState } from "react";
import AppSidebar from "./app-sidebar";
import TopNavbar from "./top-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <AppSidebar isOpen={isSidebarOpen} />

        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main
          className={`pt-14 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="mx-auto max-w-500 px-4 py-4">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
