"use client";

import Activity from "@/components/dashboard/activity";
import Attention from "@/components/dashboard/attention";
import MonthlyChart from "@/components/dashboard/charts/monthly";
import StateChart from "@/components/dashboard/charts/state";
import Completeness from "@/components/dashboard/completeness";
import {
  cardGradients,
  cardIcons,
  RETAILER_COLORS,
  STATE_COLORS,
} from "@/components/dashboard/constants";
import DashboardHeader from "@/components/dashboard/header";
import QuickInsights from "@/components/dashboard/quick-insights";
import RetailerMix from "@/components/dashboard/retailer";
import SummaryCards from "@/components/dashboard/summary-cards";
import TopSites from "@/components/dashboard/tables/top-sites";
import { getApiErrorMessage } from "@/lib/api-kit";
import { demoDashboardService } from "@/services/demo-dashboard-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["demo-dashboard"],
    queryFn: async () => {
      const res = await demoDashboardService.getDashboard();
      return res.data.results;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => demoDashboardService.uploadExcel(file),
    onSuccess: (res) => {
      queryClient.setQueryData(["demo-dashboard"], res.data.results);
      toast.success(res.data.message || "Dashboard updated");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
    onSettled: () => {
      if (fileRef.current) fileRef.current.value = "";
    },
  });

  const handleUpload = (file?: File) => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const AreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
          <p className="mb-2 font-semibold text-slate-700">{label}</p>
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center gap-2 text-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: p.stroke }}
              />
              <span className="text-slate-500">{p.name}:</span>
              <span className="font-medium text-slate-800">{p.value} GWh</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:bg-linear-to-br dark:from-muted/3 dark:via-muted/3 dark:to-muted/3">
      <div className="mx-auto max-w-400 space-y-8">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />

        <DashboardHeader
          title={data.title}
          subtitle={data.subtitle}
          uploading={uploadMutation.isPending}
          onUploadClick={() => fileRef.current?.click()}
        />

        <SummaryCards
          data={data.summaryCards || []}
          cardGradients={cardGradients}
          cardIcons={cardIcons}
        />

        <QuickInsights data={data.quickInsights || []} />

        <Attention data={data.attentionItems || []} />

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <MonthlyChart
            data={data.monthlyConsumption || []}
            AreaTooltip={AreaTooltip}
          />
          <StateChart
            data={data.stateConsumption || []}
            colors={STATE_COLORS}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <TopSites data={data.topSites || []} />
          <Activity data={data.activity || []} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Completeness data={data.completeness || []} />
          <RetailerMix data={data.retailerMix || []} colors={RETAILER_COLORS} />
        </div>
      </div>
    </div>
  );
}
