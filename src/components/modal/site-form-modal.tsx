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
import { getApiErrorMessage } from "@/lib/api-kit";
import {
  siteService,
  type Site,
  type SitePayload,
} from "@/services/site-service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FormState = {
  name: string;
  short_code: string;
  address: string;
  state: string;
  postcode: string;
  floor_area_m2: string;
  site_type: string;
  nmi: string;
  mirn: string;
  landlord_billed: boolean;
  landlord_name: string;
  active_from: string;
  active_to: string;
  notes: string;
};

const initialForm: FormState = {
  name: "",
  short_code: "",
  address: "",
  state: "",
  postcode: "",
  floor_area_m2: "",
  site_type: "store",
  nmi: "",
  mirn: "",
  landlord_billed: false,
  landlord_name: "",
  active_from: "",
  active_to: "",
  notes: "",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: Site | null;
  onSuccess: () => void;
};

export default function SiteFormModal({
  open,
  onOpenChange,
  site,
  onSuccess,
}: Props) {
  const isEdit = Boolean(site);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!open) return;

    if (site) {
      setForm({
        name: site.name || "",
        short_code: site.short_code || "",
        address: site.address || "",
        state: site.state || "",
        postcode: site.postcode || "",
        floor_area_m2: site.floor_area_m2 || "",
        site_type: site.site_type || "store",
        nmi: site.nmi || "",
        mirn: site.mirn || "",
        landlord_billed: site.landlord_billed || false,
        landlord_name: site.landlord_name || "",
        active_from: site.active_from || "",
        active_to: site.active_to || "",
        notes: site.notes || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [site, open]);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = (): SitePayload => ({
    name: form.name,
    short_code: form.short_code,
    address: form.address,
    state: form.state,
    postcode: form.postcode,
    floor_area_m2: form.floor_area_m2,
    site_type: form.site_type,
    nmi: form.nmi,
    mirn: form.mirn || null,
    landlord_billed: form.landlord_billed,
    landlord_name: form.landlord_billed ? form.landlord_name || null : null,
    active_from: form.active_from,
    active_to: form.active_to || null,
    notes: form.notes,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = buildPayload();

      const { data } =
        isEdit && site
          ? await siteService.update(site.id, payload)
          : await siteService.create(payload);

      toast.success(
        data.message ||
          (isEdit ? "Site updated successfully" : "Site created successfully"),
      );

      onOpenChange(false);
      onSuccess();
      setForm(initialForm);
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
          <DialogTitle>{isEdit ? "Edit Site" : "Create Site"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="DJ Elizabeth Street"
              />
            </div>

            <div className="space-y-2">
              <Label>Short Code</Label>
              <Input
                value={form.short_code}
                onChange={(e) => handleChange("short_code", e.target.value)}
                placeholder="DJ-ELZ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Elizabeth Street, Sydney"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                placeholder="NSW"
              />
            </div>

            <div className="space-y-2">
              <Label>Postcode</Label>
              <Input
                value={form.postcode}
                onChange={(e) => handleChange("postcode", e.target.value)}
                placeholder="2000"
              />
            </div>

            <div className="space-y-2">
              <Label>Site Type</Label>
              <Input
                value={form.site_type}
                onChange={(e) => handleChange("site_type", e.target.value)}
                placeholder="store"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Floor Area m²</Label>
              <Input
                value={form.floor_area_m2}
                onChange={(e) => handleChange("floor_area_m2", e.target.value)}
                placeholder="12500.00"
              />
            </div>

            <div className="space-y-2">
              <Label>NMI</Label>
              <Input
                value={form.nmi}
                onChange={(e) => handleChange("nmi", e.target.value)}
                placeholder="4103876921"
              />
            </div>

            <div className="space-y-2">
              <Label>MIRN</Label>
              <Input
                value={form.mirn}
                onChange={(e) => handleChange("mirn", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Active From</Label>
              <Input
                type="date"
                value={form.active_from}
                onChange={(e) => handleChange("active_from", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Active To</Label>
              <Input
                type="date"
                value={form.active_to}
                onChange={(e) => handleChange("active_to", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <input
              id="landlord_billed"
              type="checkbox"
              checked={form.landlord_billed}
              onChange={(e) =>
                handleChange("landlord_billed", e.target.checked)
              }
            />
            <Label htmlFor="landlord_billed">Landlord billed</Label>
          </div>

          {form.landlord_billed && (
            <div className="space-y-2">
              <Label>Landlord Name</Label>
              <Input
                value={form.landlord_name}
                onChange={(e) => handleChange("landlord_name", e.target.value)}
                placeholder="Landlord company name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Main David Jones CBD store"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Site"
                : "Create Site"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
