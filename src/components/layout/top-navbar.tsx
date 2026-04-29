"use client";

import { FiMenu } from "react-icons/fi";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TopNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function TopNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: TopNavbarProps) {
  return (
    <header
      className={`fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6 transition-all duration-300 ${
        isSidebarOpen ? "left-64" : "left-0"
      }`}
    >
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onToggleSidebar}>
          <FiMenu />
        </Button>

        <div className="text-sm text-muted-foreground">
          <strong className="text-foreground">Dashboard</strong>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input className="w-72" placeholder="Search sites, NMIs, bills..." />
        <Button variant="outline">Export</Button>
        <Button>+ Upload bills</Button>
        <ThemeToggle />
      </div>
    </header>
  );
}