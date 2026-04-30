import { apiKit } from "@/lib/api-kit";

export type Meter = {
  id: number;
  tenant: number;
  tenant_name: string;
  site: number;
  site_name: string;
  energy_type: number;
  energy_type_name: string;
  energy_type_code: string;
  identifier: string;
  identifier_type: string;
  description: string;
  has_imd: boolean;
  active_from: string;
  active_to: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type MeterPayload = {
  site: number;
  energy_type: number;
  identifier: string;
  identifier_type: string;
  description: string;
  has_imd: boolean;
  active_from: string;
  active_to: string | null;
  active: boolean;
};

type MeterListResponse = {
  status: "success";
  message: string;
  code: number;
  count: number;
  current_page: number;
  last_page: number;
  next: string | null;
  previous: string | null;
  results: Meter[];
};

type MeterResponse = {
  status: "success";
  message: string;
  code: number;
  results: Meter;
};

export const meterService = {
  list: (siteId?: number) =>
    apiKit.get<MeterListResponse>(siteId ? `/meters/?site=${siteId}` : "/meters/"),

  create: (payload: MeterPayload) =>
    apiKit.post<MeterResponse>("/meters/", payload),
};