import { apiKit } from "@/lib/api-kit";

export type Site = {
  id: number;
  tenant: {
    id: number;
    name: string;
    short_code: string;
  };
  name: string;
  short_code: string;
  address: string;
  state: string;
  postcode: string;
  floor_area_m2: string;
  site_type: string;
  nmi: string | null;
  mirn: string | null;
  landlord_billed: boolean;
  landlord_name: string | null;
  active_from: string;
  active_to: string | null;
  notes: string | null;
  active: boolean;
};

export type SitePayload = {
  name: string;
  short_code: string;
  address: string;
  state: string;
  postcode: string;
  floor_area_m2: string;
  site_type: string;
  nmi: string;
  mirn: string | null;
  landlord_billed: boolean;
  landlord_name: string | null;
  active_from: string;
  active_to: string | null;
  notes: string;
};

type SiteListResponse = {
  status: "success";
  message: string;
  code: number;
  count: number;
  current_page: number;
  last_page: number;
  next: string | null;
  previous: string | null;
  results: Site[];
};

type SiteResponse = {
  status: "success";
  message: string;
  code: number;
  results: Site;
};

export const siteService = {
  list: () => apiKit.get<SiteListResponse>("/sites/"),

  detail: (id: number) => apiKit.get<SiteResponse>(`/sites/${id}/`),

  create: (payload: SitePayload) =>
    apiKit.post<SiteResponse>("/sites/", payload),

  update: (id: number, payload: SitePayload) =>
    apiKit.patch<SiteResponse>(`/sites/${id}/`, payload),

  delete: (id: number) => apiKit.delete(`/sites/${id}/`),
};
