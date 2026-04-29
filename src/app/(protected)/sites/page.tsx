"use client";

import RoleGuard from "@/components/auth/role-guard";
import CreateSiteModal from "@/components/modal/create-site-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api-kit";
import { siteService, type Site } from "@/services/site-service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = async () => {
    try {
      setLoading(true);

      const { data } = await siteService.list();
      setSites(data.results);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleEdit = (site: Site) => {
    // later → open edit modal (reuse create modal)
    console.log("Edit:", site);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this site?");
    if (!confirmDelete) return;

    try {
      await siteService.delete(id);
      toast.success("Site deleted");
      fetchSites();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <RoleGuard allowedRoles={["super_admin", "admin", "energy_manager"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
            <p className="text-muted-foreground">
              Manage company sites and location data.
            </p>
          </div>

          <CreateSiteModal onCreated={fetchSites} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Site List</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : sites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sites found.</p>
            ) : (
              <div className="w-full overflow-x-auto rounded-lg border">
                <table className="min-w-300 w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Tenant</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Code</th>
                      <th className="px-4 py-3 text-left">State</th>
                      <th className="px-4 py-3 text-left">Floor Area (m²)</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">NMI / MIRN</th>
                      <th className="px-4 py-3 text-left">Landlord</th>
                      <th className="px-4 py-3 text-left">Active Period</th>
                      <th className="px-4 py-3 text-left">Notes</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sites.map((site) => (
                      <tr key={site.id} className="border-t align-top">
                        <td className="px-4 py-3">{site.tenant?.name}</td>

                        <td className="px-4 py-3 font-medium">{site.name}</td>

                        <td className="px-4 py-3">{site.short_code}</td>

                        <td className="px-4 py-3">{site.state}</td>

                        <td className="px-4 py-3">
                          {site.floor_area_m2
                            ? `${Number(site.floor_area_m2).toLocaleString()} m²`
                            : "-"}
                        </td>

                        <td className="px-4 py-3 capitalize">
                          {site.site_type?.replace("_", " ")}
                        </td>

                        <td className="px-4 py-3">
                          {site.nmi || site.mirn || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {site.landlord_billed
                            ? site.landlord_name || "Yes"
                            : "No"}
                        </td>

                        <td className="px-4 py-3">
                          {site.active_from}
                          {site.active_to ? ` → ${site.active_to}` : ""}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground max-w-50 truncate">
                          {site.notes || "-"}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              site.active
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            }`}
                          >
                            {site.active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(site)}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(site.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
