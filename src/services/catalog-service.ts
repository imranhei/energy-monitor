import { apiKit } from "@/lib/api-kit";

export type EnergyType = {
  id: number;
  code: string;
  name: string;
  scope: number;
  is_fuel: boolean;
  ghg_category: string;
  active: boolean;
};

export type Unit = {
  id: number;
  code: string;
  name: string;
  measure: string;
};

export type Retailer = {
  id: number;
  tenant?: {
    id: number;
    name: string;
    short_code: string;
  };
  name: string;
  retailer_type: string;
  bill_format: string;
  active: boolean;
  created_at?: string;
};

export type EmissionFactor = {
  id: number;
  energy_type: EnergyType;
  region: string;
  financial_year: number;
  factor_kgco2e: string;
  factor_unit: string;
  method: string;
  source: string;
  valid_from: string;
  valid_to: string;
};

type ListResponse<T> = {
  status: "success";
  message: string;
  code: number;
  count: number;
  current_page: number;
  last_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type DetailResponse<T> = {
  status: "success";
  message: string;
  code: number;
  results: T;
};

export type EnergyTypePayload = {
  code: string;
  name: string;
  scope: number;
  is_fuel: boolean;
  ghg_category: string;
};

export type UnitPayload = {
  code: string;
  name: string;
  measure: string;
};

export type RetailerPayload = {
  name: string;
  retailer_type: string;
  bill_format: string;
  tenant_id?: number;
};

export type EmissionFactorPayload = {
  energy_type_id: number;
  region: string;
  financial_year: number;
  factor_kgco2e: string;
  factor_unit: string;
  method: string;
  source: string;
  valid_from: string;
  valid_to: string;
};

export const catalogService = {
  energyTypes: {
    list: () => apiKit.get<ListResponse<EnergyType>>("/catalogs/energy-types/"),
    create: (payload: EnergyTypePayload) =>
      apiKit.post<DetailResponse<EnergyType>>("/catalogs/energy-types/", payload),
    update: (id: number, payload: Partial<EnergyTypePayload>) =>
      apiKit.patch<DetailResponse<EnergyType>>(`/catalogs/energy-types/${id}/`, payload),
    delete: (id: number) => apiKit.delete(`/catalogs/energy-types/${id}/`),
  },

  units: {
    list: () => apiKit.get<ListResponse<Unit>>("/catalogs/units/"),
    create: (payload: UnitPayload) =>
      apiKit.post<DetailResponse<Unit>>("/catalogs/units/", payload),
    update: (id: number, payload: Partial<UnitPayload>) =>
      apiKit.patch<DetailResponse<Unit>>(`/catalogs/units/${id}/`, payload),
    delete: (id: number) => apiKit.delete(`/catalogs/units/${id}/`),
  },

  retailers: {
    list: () => apiKit.get<ListResponse<Retailer>>("/catalogs/retailers/"),
    create: (payload: RetailerPayload) =>
      apiKit.post<DetailResponse<Retailer>>("/catalogs/retailers/", payload),
    update: (id: number, payload: Partial<RetailerPayload>) =>
      apiKit.patch<DetailResponse<Retailer>>(`/catalogs/retailers/${id}/`, payload),
    delete: (id: number) => apiKit.delete(`/catalogs/retailers/${id}/`),
  },

  emissionFactors: {
    list: () =>
      apiKit.get<ListResponse<EmissionFactor>>("/catalogs/emission-factors/"),
    create: (payload: EmissionFactorPayload) =>
      apiKit.post<DetailResponse<EmissionFactor>>(
        "/catalogs/emission-factors/",
        payload
      ),
    update: (id: number, payload: Partial<EmissionFactorPayload>) =>
      apiKit.patch<DetailResponse<EmissionFactor>>(`/catalogs/emission-factors/${id}/`, payload),
    delete: (id: number) =>
      apiKit.delete(`/catalogs/emission-factors/${id}/`),
  },
};