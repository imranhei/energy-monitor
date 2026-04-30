"use client";

import { getApiErrorMessage } from "@/lib/api-kit";
import { demoDashboardService } from "@/services/demo-dashboard-service";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// components
import Activity from "@/components/dashboard/activity";
import Attention from "@/components/dashboard/attention";
import MonthlyChart from "@/components/dashboard/charts/monthly";
import StateChart from "@/components/dashboard/charts/state";
import Completeness from "@/components/dashboard/completeness";
import DashboardHeader from "@/components/dashboard/header";
import QuickInsights from "@/components/dashboard/quick-insights";
import RetailerMix from "@/components/dashboard/retailer";
import SummaryCards from "@/components/dashboard/summary-cards";
import TopSites from "@/components/dashboard/tables/top-sites";

// constants (keep yours if already exist)
import {
  cardGradients,
  cardIcons,
  RETAILER_COLORS,
  STATE_COLORS,
} from "@/components/dashboard/constants";

export default function DashboardPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await demoDashboardService.getDashboard();
      setData(res.data.results);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpload = async (file?: File) => {
    if (!file) return;

    try {
      setUploading(true);
      const res = await demoDashboardService.uploadExcel(file);
      setData(res.data.results);
      toast.success("Dashboard updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const AreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-3 rounded shadow">
          <p>{label}</p>
          {payload.map((p: any) => (
            <div key={p.name}>
              {p.name}: {p.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="mx-auto max-w-400 space-y-8">
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />

        <DashboardHeader
          title={data.title}
          subtitle={data.subtitle}
          uploading={uploading}
          onUploadClick={() => fileRef.current?.click()}
        />

        <SummaryCards
          data={data.summaryCards || []}
          cardGradients={cardGradients}
          cardIcons={cardIcons}
        />

        <QuickInsights data={data.quickInsights} />

        <Attention data={data.attentionItems} />

        <div className="grid xl:grid-cols-[2fr_1fr] gap-4">
          <MonthlyChart
            data={data.monthlyConsumption}
            AreaTooltip={AreaTooltip}
          />
          <StateChart data={data.stateConsumption} colors={STATE_COLORS} />
        </div>

        <div className="grid xl:grid-cols-[2fr_1fr] gap-4">
          <TopSites data={data.topSites} />
          <Activity data={data.activity} />
        </div>

        <div className="grid xl:grid-cols-2 gap-4">
          <Completeness data={data.completeness} />
          <RetailerMix data={data.retailerMix} colors={RETAILER_COLORS} />
        </div>
      </div>
    </div>
  );
}
