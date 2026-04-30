"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/api-kit";
import {
  catalogService,
  type EmissionFactor,
  type EnergyType,
  type Retailer,
  type Unit,
} from "@/services/catalog-service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CatalogType = "energy" | "unit" | "retailer" | "factor";

type CatalogItem = EnergyType | Unit | Retailer | EmissionFactor | null;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: CatalogType;
  item?: CatalogItem;
  energyTypes?: EnergyType[];
  onSuccess: () => void;
};

export default function CatalogFormModal({
  open,
  onOpenChange,
  type,
  item = null,
  energyTypes = [],
  onSuccess,
}: Props) {
  const isEdit = Boolean(item);
  const [loading, setLoading] = useState(false);

  const [energyForm, setEnergyForm] = useState({
    code: "",
    name: "",
    scope: "2",
    is_fuel: false,
    ghg_category: "",
  });

  const [unitForm, setUnitForm] = useState({
    code: "",
    name: "",
    measure: "energy",
  });

  const [retailerForm, setRetailerForm] = useState({
    name: "",
    retailer_type: "energy_retailer",
    bill_format: "pdf",
  });

  const [factorForm, setFactorForm] = useState({
    energy_type_id: "",
    region: "",
    financial_year: "",
    factor_kgco2e: "",
    factor_unit: "",
    method: "",
    source: "",
    valid_from: "",
    valid_to: "",
  });

  useEffect(() => {
    if (!open) return;

    if (!item) {
      setEnergyForm({
        code: "",
        name: "",
        scope: "2",
        is_fuel: false,
        ghg_category: "",
      });

      setUnitForm({
        code: "",
        name: "",
        measure: "energy",
      });

      setRetailerForm({
        name: "",
        retailer_type: "energy_retailer",
        bill_format: "pdf",
      });

      setFactorForm({
        energy_type_id: "",
        region: "",
        financial_year: "",
        factor_kgco2e: "",
        factor_unit: "",
        method: "",
        source: "",
        valid_from: "",
        valid_to: "",
      });

      return;
    }

    if (type === "energy") {
      const row = item as EnergyType;

      setEnergyForm({
        code: row.code || "",
        name: row.name || "",
        scope: String(row.scope || 2),
        is_fuel: !!row.is_fuel,
        ghg_category: row.ghg_category || "",
      });
    }

    if (type === "unit") {
      const row = item as Unit;

      setUnitForm({
        code: row.code || "",
        name: row.name || "",
        measure: row.measure || "",
      });
    }

    if (type === "retailer") {
      const row = item as Retailer;

      setRetailerForm({
        name: row.name || "",
        retailer_type: row.retailer_type || "",
        bill_format: row.bill_format || "pdf",
      });
    }

    if (type === "factor") {
      const row = item as EmissionFactor;

      setFactorForm({
        energy_type_id: String(row.energy_type?.id || ""),
        region: row.region || "",
        financial_year: String(row.financial_year || ""),
        factor_kgco2e: row.factor_kgco2e || "",
        factor_unit: row.factor_unit || "",
        method: row.method || "",
        source: row.source || "",
        valid_from: row.valid_from || "",
        valid_to: row.valid_to || "",
      });
    }
  }, [open, item, type]);

  const selectedEnergyTypeName =
    energyTypes.find((item) => String(item.id) === factorForm.energy_type_id)
      ?.name || "";

  const titleMap: Record<CatalogType, string> = {
    energy: isEdit ? "Edit Energy Type" : "Create Energy Type",
    unit: isEdit ? "Edit Unit" : "Create Unit",
    retailer: isEdit ? "Edit Retailer" : "Create Retailer",
    factor: isEdit ? "Edit Emission Factor" : "Create Emission Factor",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (type === "energy") {
        const payload = {
          code: energyForm.code,
          name: energyForm.name,
          scope: Number(energyForm.scope),
          is_fuel: energyForm.is_fuel,
          ghg_category: energyForm.ghg_category,
        };

        isEdit && item
          ? await catalogService.energyTypes.update(
              (item as EnergyType).id,
              payload,
            )
          : await catalogService.energyTypes.create(payload);
      }

      if (type === "unit") {
        isEdit && item
          ? await catalogService.units.update((item as Unit).id, unitForm)
          : await catalogService.units.create(unitForm);
      }

      if (type === "retailer") {
        isEdit && item
          ? await catalogService.retailers.update(
              (item as Retailer).id,
              retailerForm,
            )
          : await catalogService.retailers.create(retailerForm);
      }

      if (type === "factor") {
        const payload = {
          energy_type_id: Number(factorForm.energy_type_id),
          region: factorForm.region,
          financial_year: Number(factorForm.financial_year),
          factor_kgco2e: factorForm.factor_kgco2e,
          factor_unit: factorForm.factor_unit,
          method: factorForm.method,
          source: factorForm.source,
          valid_from: factorForm.valid_from,
          valid_to: factorForm.valid_to,
        };

        isEdit && item
          ? await catalogService.emissionFactors.update(
              (item as EmissionFactor).id,
              payload,
            )
          : await catalogService.emissionFactors.create(payload);
      }

      toast.success(
        isEdit
          ? "Catalog updated successfully"
          : "Catalog created successfully",
      );
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titleMap[type]}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === "energy" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input
                    value={energyForm.code}
                    onChange={(e) =>
                      setEnergyForm((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    placeholder="electricity"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={energyForm.name}
                    onChange={(e) =>
                      setEnergyForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Electricity"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Input
                    type="number"
                    value={energyForm.scope}
                    onChange={(e) =>
                      setEnergyForm((prev) => ({
                        ...prev,
                        scope: e.target.value,
                      }))
                    }
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>GHG Category</Label>
                  <Input
                    value={energyForm.ghg_category}
                    onChange={(e) =>
                      setEnergyForm((prev) => ({
                        ...prev,
                        ghg_category: e.target.value,
                      }))
                    }
                    placeholder="Purchased Electricity"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={energyForm.is_fuel}
                  onChange={(e) =>
                    setEnergyForm((prev) => ({
                      ...prev,
                      is_fuel: e.target.checked,
                    }))
                  }
                />
                Is fuel
              </label>
            </>
          )}

          {type === "unit" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input
                    value={unitForm.code}
                    onChange={(e) =>
                      setUnitForm((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    placeholder="kwh"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={unitForm.name}
                    onChange={(e) =>
                      setUnitForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Kilowatt Hour"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Measure</Label>
                <Input
                  value={unitForm.measure}
                  onChange={(e) =>
                    setUnitForm((prev) => ({
                      ...prev,
                      measure: e.target.value,
                    }))
                  }
                  placeholder="energy"
                />
              </div>
            </>
          )}

          {type === "retailer" && (
            <>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={retailerForm.name}
                  onChange={(e) =>
                    setRetailerForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="AGL"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Retailer Type</Label>
                  <Input
                    value={retailerForm.retailer_type}
                    onChange={(e) =>
                      setRetailerForm((prev) => ({
                        ...prev,
                        retailer_type: e.target.value,
                      }))
                    }
                    placeholder="energy_retailer"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bill Format</Label>
                  <Select
                    value={retailerForm.bill_format}
                    onValueChange={(value) => {
                      if (!value) return;

                      setRetailerForm((prev) => ({
                        ...prev,
                        bill_format: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {type === "factor" && (
            <>
              <div className="space-y-2">
                <Label>Energy Type</Label>
                <Select
                  value={factorForm.energy_type_id}
                  onValueChange={(value) =>
                    setFactorForm((prev) => ({
                      ...prev,
                      energy_type_id: value || "",
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select energy type">
                      {selectedEnergyTypeName}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {energyTypes.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input
                    value={factorForm.region}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        region: e.target.value,
                      }))
                    }
                    placeholder="NSW"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Financial Year</Label>
                  <Input
                    type="number"
                    value={factorForm.financial_year}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        financial_year: e.target.value,
                      }))
                    }
                    placeholder="2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Factor kgCO2e</Label>
                  <Input
                    value={factorForm.factor_kgco2e}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        factor_kgco2e: e.target.value,
                      }))
                    }
                    placeholder="0.820000"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Factor Unit</Label>
                  <Input
                    value={factorForm.factor_unit}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        factor_unit: e.target.value,
                      }))
                    }
                    placeholder="kgCO2e/kWh"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Method</Label>
                  <Input
                    value={factorForm.method}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        method: e.target.value,
                      }))
                    }
                    placeholder="location_based"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Source</Label>
                  <Input
                    value={factorForm.source}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        source: e.target.value,
                      }))
                    }
                    placeholder="NGER"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={factorForm.valid_from}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        valid_from: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valid To</Label>
                  <Input
                    type="date"
                    value={factorForm.valid_to}
                    onChange={(e) =>
                      setFactorForm((prev) => ({
                        ...prev,
                        valid_to: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : titleMap[type]}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
