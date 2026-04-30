import { NavGroup } from "@/types";

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        page: "dashboard",
        href: "/dashboard",
      },
      {
        label: "Alerts",
        page: "alerts",
        href: "/alerts",
        // count: "7",
        alert: true,
      },
    ],
  },
  {
    label: "Data",
    items: [
      {
        label: "Bills",
        page: "bills",
        href: "/bills",
        // count: "523",
      },
      {
        label: "Sites",
        page: "sites",
        href: "/sites",
        // count: "41",
      },
      {
        label: "Consumption",
        page: "consumption",
        href: "/consumption",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Tenants",
        page: "tenants",
        href: "/tenants",
        permission: ["super_admin"],
      },
      {
        label: "Users",
        page: "users",
        href: "/users",
        permission: ["super_admin", "admin"],
      },
      {
        label: "Roles & Permissions",
        page: "roles",
        href: "/roles",
        permission: ["super_admin", "admin"],
      },
    ],
  },
  {
    label: "Reporting",
    items: [
      {
        label: "NGER FY26",
        page: "nger",
        href: "/dashboard/nger",
      },
      {
        label: "Scope 1 & 2",
        page: "scope",
        href: "/dashboard/scope",
      },
      {
        label: "Exports",
        page: "exports",
        href: "/dashboard/exports",
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        label: "Audit trail",
        page: "audit",
        href: "/dashboard/audit",
      },
    ],
  },
];
