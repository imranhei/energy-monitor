"use client";

import { Upload, Zap } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  uploading: boolean;
  onUploadClick: () => void;
};

export default function DashboardHeader({
  title,
  subtitle,
  uploading,
  onUploadClick,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
          <Zap className="text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={onUploadClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white"
      >
        <Upload size={16} />
        {uploading ? "Uploading..." : "Upload Excel"}
      </button>
    </div>
  );
}