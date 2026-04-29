import { apiKit } from "@/lib/api-kit";
import type { Tenant } from "@/types";

export type TenantPayload = {
  name: string;
  short_code: string;
  admin_email: string;
  admin_password: string;
  admin_full_name: string;
};

type TenantResponse = {
  status: "success";
  message: string;
  code: number;
  results: Tenant;
};

type TenantListResponse = {
  status: "success";
  message: string;
  code: number;
  results: Tenant[];
};

export const tenantService = {
  list: () => apiKit.get<TenantListResponse>("/auth/tenants/list/"),

  create: (payload: TenantPayload) =>
    apiKit.post<TenantResponse>("/auth/tenants/", payload),

  update: (id: number, payload: Partial<TenantPayload>) =>
    apiKit.put<TenantResponse>(`/auth/tenants/${id}/`, payload),

  delete: (id: number) => apiKit.delete(`/auth/tenants/${id}/`),
};
