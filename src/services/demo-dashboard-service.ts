import { apiKit } from "@/lib/api-kit";

export type SummaryCard = {
  title: string;
  value: string;
  unit: string | null;
  change: number;
  helper: string;
};

export type DashboardData = {
  title: string;
  subtitle: string;
  summaryCards: SummaryCard[];
  quickInsights: string[];
  attentionItems: string[];
  monthlyConsumption: {
    month: string;
    current: number;
    previous: number;
  }[];
  stateConsumption: {
    state: string;
    value: number;
  }[];
  topSites: {
    site: string;
    state: string;
    kwh: number;
    spend: string;
    intensity: number;
    change: number;
    status: string;
  }[];
  completeness: {
    label: string;
    value: number;
    color: "good" | "warning" | string;
  }[];
  activity: {
    text: string;
    time: string;
    type: "success" | "warning" | "info" | "danger";
  }[];
  retailerMix: {
    name: string;
    value: number;
  }[];
};

type DashboardResponse = {
  status: "success";
  message: string;
  code: number;
  results: DashboardData;
};

export const demoDashboardService = {
  getDashboard: () => apiKit.get<DashboardResponse>("/demo/dashboard/"),

  uploadExcel: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiKit.post<DashboardResponse>("/demo/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};