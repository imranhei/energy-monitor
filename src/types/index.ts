export type NavItem = {
  label: string;
  page: string;
  href: string;
  active?: boolean;
  count?: string;
  alert?: boolean;
  permission?: Role[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type Role =
  | "super_admin"
  | "admin"
  | "energy_manager"
  | "viewer"
  | "ampec_support";

export type Tenant = {
  id: number;
  name: string;
  short_code: string;
  active?: boolean;
};

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  tenant: Tenant | null;
};