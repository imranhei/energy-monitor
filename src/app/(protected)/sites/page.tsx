"use client";

import RoleGuard from "@/components/auth/role-guard";
import DataTable, {
  type DataTableColumn,
} from "@/components/common/data-table";
import SiteFormModal from "@/components/modal/site-form-modal";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-kit";
import { confirmAlert } from "@/lib/confirm-alert";
import { siteService, type Site } from "@/services/site-service";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

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

  const handleCreate = () => {
    setSelectedSite(null);
    setModalOpen(true);
  };

  const handleEdit = (site: Site) => {
    setSelectedSite(site);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmAlert(
      "Delete site?",
      "This site will no longer be active.",
    );

    if (!confirmed) return;

    try {
      await siteService.delete(id);
      toast.success("Site deleted successfully");
      fetchSites();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const columns: DataTableColumn<Site>[] = [
    {
      key: "tenant",
      header: "Tenant",
      render: (site) => site.tenant?.name || "-",
    },
    {
      key: "name",
      header: "Name",
      className: "font-medium",
    },
    {
      key: "short_code",
      header: "Code",
    },
    {
      key: "state",
      header: "State",
    },
    {
      key: "floor_area_m2",
      header: "Floor Area",
      render: (site) =>
        site.floor_area_m2
          ? `${Number(site.floor_area_m2).toLocaleString()} m²`
          : "-",
    },
    {
      key: "site_type",
      header: "Type",
      render: (site) => site.site_type?.replace("_", " ") || "-",
      className: "capitalize",
    },
    {
      key: "nmi",
      header: "NMI / MIRN",
      render: (site) => site.nmi || site.mirn || "-",
    },
    {
      key: "landlord_billed",
      header: "Landlord",
      render: (site) =>
        site.landlord_billed ? site.landlord_name || "Yes" : "No",
    },
    {
      key: "active_from",
      header: "Active Period",
      render: (site) =>
        `${site.active_from || "-"}${site.active_to ? ` → ${site.active_to}` : ""}`,
    },
    {
      key: "notes",
      header: "Notes",
      className: "max-w-[220px] truncate text-muted-foreground",
      render: (site) => site.notes || "-",
    },
    {
      key: "active",
      header: "Status",
      render: (site) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            site.active
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {site.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (site) => (
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline">
            <Link href={`/sites/${site.id}`}>
              <Eye className="size-4" />
            </Link>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleEdit(site)}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(site.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

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

          <Button onClick={handleCreate}>Create Site</Button>
        </div>

        <DataTable
          columns={columns}
          data={sites}
          loading={loading}
          emptyMessage="No sites found."
          minWidth="1300px"
          getRowKey={(site) => site.id}
        />

        <SiteFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          site={selectedSite}
          onSuccess={fetchSites}
        />
      </div>
    </RoleGuard>
  );
}
