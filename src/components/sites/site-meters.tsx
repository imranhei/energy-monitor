"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DataTable, { type DataTableColumn } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-kit";
import { meterService, type Meter } from "@/services/meter-service";

type Props = {
  siteId: number;
};

export default function SiteMeters({ siteId }: Props) {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeters = async () => {
    try {
      setLoading(true);
      const { data } = await meterService.list(siteId);
      setMeters(data.results);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeters();
  }, [siteId]);

  const columns: DataTableColumn<Meter>[] = [
    {
      key: "identifier",
      header: "Identifier",
      className: "font-medium",
    },
    {
      key: "identifier_type",
      header: "Type",
      render: (meter) => meter.identifier_type?.toUpperCase(),
    },
    {
      key: "energy_type_name",
      header: "Energy Type",
    },
    {
      key: "description",
      header: "Description",
    },
    {
      key: "has_imd",
      header: "IMD",
      render: (meter) => (meter.has_imd ? "Yes" : "No"),
    },
    {
      key: "active_from",
      header: "Active Period",
      render: (meter) =>
        `${meter.active_from || "-"}${meter.active_to ? ` → ${meter.active_to}` : ""}`,
    },
    {
      key: "active",
      header: "Status",
      render: (meter) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            meter.active
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {meter.active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>Add Meter</Button>
      </div>

      <DataTable
        columns={columns}
        data={meters}
        loading={loading}
        emptyMessage="No meters found for this site."
        minWidth="900px"
        getRowKey={(meter) => meter.id}
      />
    </div>
  );
}