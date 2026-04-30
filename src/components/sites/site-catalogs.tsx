"use client";

import DataTable, {
  type DataTableColumn,
} from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiErrorMessage } from "@/lib/api-kit";
import { confirmAlert } from "@/lib/confirm-alert";
import {
  catalogService,
  type EmissionFactor,
  type EnergyType,
  type Retailer,
  type Unit,
} from "@/services/catalog-service";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CatalogFormModal from "../modal/catalog-form-modal";

type CatalogType = "energy" | "unit" | "retailer" | "factor";
type SelectedCatalog = EnergyType | Unit | Retailer | EmissionFactor | null;

type Props = {
  siteId: number;
};

export default function SiteCatalogs({ siteId }: Props) {
  const [energyTypes, setEnergyTypes] = useState<EnergyType[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [catalogType, setCatalogType] = useState<CatalogType>("energy");
  const [selectedCatalog, setSelectedCatalog] = useState<SelectedCatalog>(null);

  const fetchCatalogs = async () => {
    try {
      setLoading(true);

      const [energyRes, unitRes, retailerRes, factorRes] = await Promise.all([
        catalogService.energyTypes.list(),
        catalogService.units.list(),
        catalogService.retailers.list(),
        catalogService.emissionFactors.list(),
      ]);

      setEnergyTypes(energyRes.data.results);
      setUnits(unitRes.data.results);
      setRetailers(retailerRes.data.results);
      setEmissionFactors(factorRes.data.results);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, [siteId]);

  const energyColumns: DataTableColumn<EnergyType>[] = [
    { key: "name", header: "Name", className: "font-medium" },
    { key: "code", header: "Code" },
    { key: "scope", header: "Scope" },
    {
      key: "is_fuel",
      header: "Fuel",
      render: (row) => (row.is_fuel ? "Yes" : "No"),
    },
    { key: "ghg_category", header: "GHG Category" },
    {
      key: "active",
      header: "Status",
      render: (row) => (row.active ? "Active" : "Inactive"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => renderActions("energy", row),
    },
  ];

  const unitColumns: DataTableColumn<Unit>[] = [
    { key: "name", header: "Name", className: "font-medium" },
    { key: "code", header: "Code" },
    { key: "measure", header: "Measure" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => renderActions("unit", row),
    },
  ];

  const retailerColumns: DataTableColumn<Retailer>[] = [
    { key: "name", header: "Name", className: "font-medium" },
    { key: "retailer_type", header: "Type" },
    { key: "bill_format", header: "Bill Format" },
    {
      key: "active",
      header: "Status",
      render: (row) => (row.active ? "Active" : "Inactive"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => renderActions("retailer", row),
    },
  ];

  const factorColumns: DataTableColumn<EmissionFactor>[] = [
    {
      key: "energy_type",
      header: "Energy Type",
      render: (row) => row.energy_type?.name || "-",
    },
    { key: "region", header: "Region" },
    { key: "financial_year", header: "FY" },
    { key: "factor_kgco2e", header: "Factor" },
    { key: "factor_unit", header: "Unit" },
    { key: "method", header: "Method" },
    { key: "source", header: "Source" },
    {
      key: "valid_from",
      header: "Valid Period",
      render: (row) => `${row.valid_from} → ${row.valid_to}`,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => renderActions("factor", row),
    },
  ];

  const openCreateModal = (type: CatalogType) => {
    setCatalogType(type);
    setSelectedCatalog(null);
    setCatalogModalOpen(true);
  };

  const openEditModal = (type: CatalogType, item: SelectedCatalog) => {
    setCatalogType(type);
    setSelectedCatalog(item);
    setCatalogModalOpen(true);
  };

  const handleDelete = async (type: CatalogType, id: number) => {
    const confirmed = await confirmAlert(
      "Delete catalog item?",
      "This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      if (type === "energy") await catalogService.energyTypes.delete(id);
      if (type === "unit") await catalogService.units.delete(id);
      if (type === "retailer") await catalogService.retailers.delete(id);
      if (type === "factor") await catalogService.emissionFactors.delete(id);

      toast.success("Catalog item deleted successfully");
      fetchCatalogs();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const renderActions = (
    type: CatalogType,
    item: SelectedCatalog & { id: number },
  ) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-sm hover:bg-muted">
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openEditModal(type, item)}>
          <Pencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-600"
          onClick={() => handleDelete(type, item.id)}
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="energy-types">
        <TabsList>
          <TabsTrigger value="energy-types">Energy Types</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="retailers">Retailers</TabsTrigger>
          <TabsTrigger value="emission-factors">Emission Factors</TabsTrigger>
        </TabsList>

        <TabsContent value="energy-types" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => openCreateModal("energy")}>
              Add Energy Type
            </Button>
          </div>

          <DataTable
            columns={energyColumns}
            data={energyTypes}
            loading={loading}
            emptyMessage="No energy types found."
            minWidth="900px"
            getRowKey={(row) => row.id}
          />
        </TabsContent>

        <TabsContent value="units" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => openCreateModal("unit")}>Add Unit</Button>
          </div>

          <DataTable
            columns={unitColumns}
            data={units}
            loading={loading}
            emptyMessage="No units found."
            minWidth="600px"
            getRowKey={(row) => row.id}
          />
        </TabsContent>

        <TabsContent value="retailers" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => openCreateModal("retailer")}>
              Add Retailer
            </Button>
          </div>

          <DataTable
            columns={retailerColumns}
            data={retailers}
            loading={loading}
            emptyMessage="No retailers found."
            minWidth="800px"
            getRowKey={(row) => row.id}
          />
        </TabsContent>

        <TabsContent value="emission-factors" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => openCreateModal("factor")}>
              Add Emission Factor
            </Button>
          </div>

          <DataTable
            columns={factorColumns}
            data={emissionFactors}
            loading={loading}
            emptyMessage="No emission factors found."
            minWidth="1100px"
            getRowKey={(row) => row.id}
          />
        </TabsContent>
      </Tabs>

      <CatalogFormModal
        open={catalogModalOpen}
        onOpenChange={setCatalogModalOpen}
        type={catalogType}
        item={selectedCatalog}
        energyTypes={energyTypes}
        onSuccess={fetchCatalogs}
      />
    </div>
  );
}
