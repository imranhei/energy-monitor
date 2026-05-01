"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-black px-4 text-center">

      {/* Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 shadow-lg">
        <Wrench className="h-8 w-8 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
        Page Under Construction
      </h1>

      {/* Subtitle */}
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        This page is currently being built. Please check back later or navigate to another section.
      </p>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>

        <Button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}