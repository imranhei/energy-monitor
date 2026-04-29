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
  state: string;
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

export type CreateSitePayload = {
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
  results: Site[];
};

type CreateSiteResponse = {
  status: "success";
  message: string;
  code: number;
  results: Site;
};

export const siteService = {
  list: () => apiKit.get<SiteListResponse>("/sites/"),

  create: (payload: CreateSitePayload) =>
    apiKit.post<CreateSiteResponse>("/sites/", payload),

  delete: (id: number) => apiKit.delete(`/auth/sites/${id}/`),
};
