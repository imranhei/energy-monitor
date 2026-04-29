"use client";

import RoleGuard from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-kit";
import { siteService, type Site } from "@/services/site-service";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="rounded-lg border p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <div className="mt-1 text-sm font-medium">{value || "-"}</div>
  </div>
);

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = Number(params.id);

  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSite = async () => {
    try {
      setLoading(true);

      const { data } = await siteService.detail(siteId);
      setSite(data.results);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (siteId) fetchSite();
  }, [siteId]);

  return (
    <RoleGuard allowedRoles={["super_admin", "admin", "energy_manager"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" size="sm">
              <Link href="/sites" className="flex items-center">
                <ArrowLeft className="mr-2 size-4" />
                Back to Sites
              </Link>
            </Button>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              {site?.name || "Site Detail"}
            </h1>
            <p className="text-muted-foreground">
              Detailed site information and operational metadata.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-60 items-center justify-center rounded-lg border">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !site ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Site not found.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-3">
                <InfoItem label="Tenant" value={site.tenant?.name} />
                <InfoItem label="Site Name" value={site.name} />
                <InfoItem label="Short Code" value={site.short_code} />
                <InfoItem label="State" value={site.state} />
                <InfoItem label="Postcode" value={site.postcode} />
                <InfoItem
                  label="Status"
                  value={
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        site.active
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      {site.active ? "Active" : "Inactive"}
                    </span>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Site Data</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-3">
                <InfoItem label="Address" value={site.address} />
                <InfoItem
                  label="Floor Area"
                  value={
                    site.floor_area_m2
                      ? `${Number(site.floor_area_m2).toLocaleString()} m²`
                      : "-"
                  }
                />
                <InfoItem
                  label="Site Type"
                  value={site.site_type?.replace("_", " ")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metering & Billing</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-3">
                <InfoItem label="NMI" value={site.nmi || "-"} />
                <InfoItem label="MIRN" value={site.mirn || "-"} />
                <InfoItem
                  label="Landlord Billed"
                  value={site.landlord_billed ? "Yes" : "No"}
                />
                <InfoItem
                  label="Landlord Name"
                  value={site.landlord_name || "-"}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lifecycle</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-3">
                <InfoItem label="Active From" value={site.active_from || "-"} />
                <InfoItem label="Active To" value={site.active_to || "-"} />
                <InfoItem label="Notes" value={site.notes || "-"} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </RoleGuard>
  );
}