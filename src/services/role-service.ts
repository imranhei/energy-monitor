import { apiKit } from "@/lib/api-kit";

export type Permission = {
  id: number;
  name: string;
  code: string;
};

export type RoleItem = {
  id: number;
  name: string;
  code: string;
  tenant: number;
  permissions: Permission[];
  is_system_role: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type RolePayload = {
  name: string;
  code: string;
  active?: boolean;
};

type PermissionListResponse = {
  status: "success";
  message: string;
  code: number;
  count: number;
  current_page: number;
  last_page: number;
  next: string | null;
  previous: string | null;
  results: Permission[];
};

type RoleListResponse = {
  status: "success";
  message: string;
  code: number;
  count: number;
  current_page: number;
  last_page: number;
  next: string | null;
  previous: string | null;
  results: RoleItem[];
};

type RoleResponse = {
  status: "success";
  message: string;
  code: number;
  results: RoleItem;
};

type DeleteRoleResponse = {
  status: "success";
  message: string;
  code: number;
  results: null;
};

export const roleService = {
  permissions: () =>
    apiKit.get<PermissionListResponse>("/auth/permissions/"),

  list: () => apiKit.get<RoleListResponse>("/auth/roles/"),

  create: (payload: RolePayload) =>
    apiKit.post<RoleResponse>("/auth/roles/", payload),

  update: (id: number, payload: RolePayload) =>
    apiKit.patch<RoleResponse>(`/auth/roles/${id}/`, payload),

  delete: (id: number) =>
    apiKit.delete<DeleteRoleResponse>(`/auth/roles/${id}/`),

  assignPermissions: (roleId: number, permissions: string[]) =>
    apiKit.post<RoleResponse>(`/auth/roles/${roleId}/assign-permissions/`, {
      permissions,
    }),
};