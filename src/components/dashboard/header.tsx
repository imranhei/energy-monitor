"use client";

import { Upload, Zap } from "lucide-react";

export default function DashboardHeader({
  title,
  subtitle,
  uploading,
  onUploadClick,
}: any) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-200">
          <Zap className="h-7 w-7 text-white" />
        </div>

        <div>
          <h1 className="bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            {title}
          </h1>

          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={onUploadClick}
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:scale-105 hover:shadow-lg"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading…" : "Upload Excel"}
      </button>
    </div>
  );
}
