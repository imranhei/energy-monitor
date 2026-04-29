import { apiKit } from "@/lib/api-kit";
import type { Tenant } from "@/types";

export type CreateTenantPayload = {
  name: string;
  short_code: string;
  admin_email: string;
  admin_password: string;
  admin_full_name: string;
};

type CreateTenantResponse = {
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
  create: (payload: CreateTenantPayload) =>
    apiKit.post<CreateTenantResponse>("/auth/tenants/", payload),

  list: () => apiKit.get<TenantListResponse>("/auth/tenants/list/"),
};