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
import { siteService } from "@/services/site-service";
import { useState } from "react";
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
  onCreated: () => void;
};

export default function CreateSiteModal({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        mirn: form.mirn || null,
        active_to: form.active_to || null,
        landlord_name: form.landlord_name || null,
      };

      const { data } = await siteService.create(payload);

      toast.success(data.message || "Site created successfully");
      setOpen(false);
      setForm(initialForm);
      onCreated();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Site</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Site</DialogTitle>
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
                  onChange={(e) =>
                    handleChange("floor_area_m2", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleChange("landlord_name", e.target.value)
                  }
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
              {loading ? "Creating..." : "Create Site"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
