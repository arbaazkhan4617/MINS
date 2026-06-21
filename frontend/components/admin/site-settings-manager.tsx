"use client";

import { useEffect, useState } from "react";
import { Save, Upload, FileCheck, ShieldAlert, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveApiUrl } from "@/lib/api";
import {
  defaultSiteSettings,
  fetchSiteSettings,
  saveSiteSettings,
  uploadSiteAsset,
  type SiteSettings
} from "@/lib/site-settings-store";

type Product = {
  id: string;
  name: string;
  description: string;
  variantName: string;
  coaUrl?: string;
};

type SpecsData = {
  description: string;
  specificationsTable: Array<{ parameter: string; value: string }>;
  secureLogistics: string;
};

type SafetyData = {
  overview: string;
  items: Array<{ title: string; text: string }>;
};

type SupplyTerms = {
  terms: Array<{ title: string; text: string }>;
  legalDisclaimer: string;
};

type AllocationItem = {
  mineral: string;
  status: string;
  color: "blue" | "green" | "yellow" | "default";
};

type RegisteredOffice = {
  officeName: string;
  address: string;
  miningOperations: string;
  isoCertifications: string;
};

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCoaIndex, setUploadingCoaIndex] = useState<number | null>(null);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  // Parse state sections
  let productsList: Product[] = [];
  try {
    productsList = JSON.parse(settings.productsJson || "[]");
  } catch (e) {}

  let specsData: SpecsData = { description: "", specificationsTable: [], secureLogistics: "" };
  try {
    if (settings.technicalSpecsJson) specsData = JSON.parse(settings.technicalSpecsJson);
  } catch (e) {}

  let safetyData: SafetyData = { overview: "", items: [] };
  try {
    if (settings.safetyGuidelinesJson) safetyData = JSON.parse(settings.safetyGuidelinesJson);
  } catch (e) {}

  let supplyTerms: SupplyTerms = { terms: [], legalDisclaimer: "" };
  try {
    if (settings.supplyTermsJson) supplyTerms = JSON.parse(settings.supplyTermsJson);
  } catch (e) {}

  let assetAllocations: AllocationItem[] = [];
  try {
    if (settings.assetAllocationsJson) assetAllocations = JSON.parse(settings.assetAllocationsJson);
  } catch (e) {}

  let registeredOffice: RegisteredOffice = { officeName: "", address: "", miningOperations: "", isoCertifications: "" };
  try {
    if (settings.registeredOfficeJson) registeredOffice = JSON.parse(settings.registeredOfficeJson);
  } catch (e) {}

  // Update logic helpers
  function updateProducts(newList: Product[]) {
    update("productsJson", JSON.stringify(newList));
  }

  function updateSpecs(updated: SpecsData) {
    update("technicalSpecsJson", JSON.stringify(updated));
  }

  function updateSafety(updated: SafetyData) {
    update("safetyGuidelinesJson", JSON.stringify(updated));
  }

  function updateSupply(updated: SupplyTerms) {
    update("supplyTermsJson", JSON.stringify(updated));
  }

  function updateAllocations(newList: AllocationItem[]) {
    update("assetAllocationsJson", JSON.stringify(newList));
  }

  function updateOffice(updated: RegisteredOffice) {
    update("registeredOfficeJson", JSON.stringify(updated));
  }

  function token() {
    return window.localStorage.getItem("mins-admin-token");
  }

  async function handleUpload(file: File | null, key: "logoUrl" | "aboutImageUrl") {
    if (!file) return;
    const authToken = token();
    if (!authToken) {
      setMessage("Please login again before uploading files.");
      return;
    }
    try {
      const uploaded = await uploadSiteAsset(file, authToken);
      update(key, uploaded.url);
      setMessage("File uploaded. Save settings to publish the change.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload file.");
    }
  }

  async function handleCoaUpload(file: File | null, index: number) {
    if (!file) return;
    const authToken = token();
    if (!authToken) {
      setMessage("Please login again before uploading files.");
      return;
    }
    setUploadingCoaIndex(index);
    try {
      const uploaded = await uploadSiteAsset(file, authToken);
      const updated = [...productsList];
      updated[index].coaUrl = uploaded.url;
      updateProducts(updated);
      setMessage("CoA file uploaded successfully. Remember to save settings.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload CoA.");
    } finally {
      setUploadingCoaIndex(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const authToken = token();
    if (!authToken) {
      setMessage("Please login again before saving settings.");
      return;
    }
    setIsSaving(true);
    setMessage("");

    try {
      const saved = await saveSiteSettings(settings, authToken);
      setSettings(saved);
      setMessage("Site settings saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
      <form onSubmit={handleSubmit} className="grid gap-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-navy">Corporate settings & Portal Configurations</h1>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">
              Manage website identity, Mineral Portfolio, Technical Specifications, ISO Excellence and Safety, Supply Terms, and live stock allocations.
            </p>
          </div>
          <Button type="submit" className="gap-2" disabled={isSaving}>
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="Company Name" value={settings.companyName} onChange={(value) => update("companyName", value)} />
          <TextInput label="Tagline" value={settings.tagline} onChange={(value) => update("tagline", value)} />
          <TextInput label="Contact Email" value={settings.email} onChange={(value) => update("email", value)} />
          <TextInput label="Mobile Number" value={settings.mobile} onChange={(value) => update("mobile", value)} />
          <TextInput label="WhatsApp Number (e.g. 918226023925)" value={settings.whatsappNumber} onChange={(value) => update("whatsappNumber", value)} />
          <TextInput label="Office Location Address" value={settings.location} onChange={(value) => update("location", value)} />
          <TextInput label="GSTIN" value={settings.gstin} onChange={(value) => update("gstin", value)} />
          <TextInput label="Proprietor Name" value={settings.proprietor} onChange={(value) => update("proprietor", value)} />
        </div>

        <div className="grid gap-5">
          <TextInput label="Gosalpur Mine Lease Site Address" value={settings.mineSiteAddress} onChange={(value) => update("mineSiteAddress", value)} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AssetInput
            label="Logo Asset"
            value={settings.logoUrl}
            previewAlt="Company logo"
            onValue={(value) => update("logoUrl", value)}
            onFile={(file) => handleUpload(file, "logoUrl")}
          />
          <AssetInput
            label="About Hero Image"
            value={settings.aboutImageUrl}
            previewAlt="About section background"
            onValue={(value) => update("aboutImageUrl", value)}
            onFile={(file) => handleUpload(file, "aboutImageUrl")}
          />
        </div>

        <TextInput label="Google Map Embed URL" value={settings.mapEmbedUrl} onChange={(value) => update("mapEmbedUrl", value)} />
        <TextInput label="Copyright Text" value={settings.copyrightText} onChange={(value) => update("copyrightText", value)} />

        {/* Corporate Overview Section Settings */}
        <div className="grid gap-5 border-t border-navy/10 pt-6">
          <h3 className="text-lg font-bold text-navy">Corporate Overview (About Us)</h3>
          <TextInput label="About Section Eyebrow" value={settings.aboutEyebrow} onChange={(value) => update("aboutEyebrow", value)} />
          <TextInput label="About Section Headline" value={settings.aboutTitle} onChange={(value) => update("aboutTitle", value)} />
          <TextArea label="About Section Content Copy" value={settings.aboutContent} onChange={(value) => update("aboutContent", value)} />
          <TextArea label="Director's Corporate Message" value={settings.directorMessage} onChange={(value) => update("directorMessage", value)} />
        </div>

        {/* Dynamic Products (Mineral Portfolio) Section Editor */}
        <div className="grid gap-5 rounded-2xl border border-navy/10 bg-mist p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-navy">Mineral Portfolio Manager</h3>
              <p className="text-xs text-charcoal/60">Configure high-grade mineral variants and Certificate of Analysis (CoA) documents.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newId = `product-${Date.now()}`;
                updateProducts([...productsList, { id: newId, name: "", description: "", variantName: "", coaUrl: "" }]);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-xs font-bold text-white hover:bg-gold hover:text-navy"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>

          <div className="grid gap-4 mt-2">
            {productsList.map((product, index) => (
              <div key={product.id} className="relative bg-white p-5 rounded-xl border border-navy/5 grid gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const updated = productsList.filter((_, i) => i !== index);
                    updateProducts(updated);
                  }}
                  className="absolute right-4 top-4 text-red-600 hover:text-red-800"
                  aria-label="Delete product"
                >
                  <Trash size={16} />
                </button>

                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput
                    label="Product Name"
                    value={product.name}
                    onChange={(val) => {
                      const updated = [...productsList];
                      updated[index].name = val;
                      updateProducts(updated);
                    }}
                  />
                  <TextInput
                    label="Short Variant Name (e.g. Iron Ore Lumps)"
                    value={product.variantName}
                    onChange={(val) => {
                      const updated = [...productsList];
                      updated[index].variantName = val;
                      updateProducts(updated);
                    }}
                  />
                </div>

                <TextArea
                  label="Variant Specifications & Detailed Description"
                  value={product.description}
                  onChange={(val) => {
                    const updated = [...productsList];
                    updated[index].description = val;
                    updateProducts(updated);
                  }}
                />

                <div className="grid gap-2 border-t border-navy/5 pt-4">
                  <p className="text-xs font-bold text-navy">Certificate of Analysis (CoA) Document</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={(e) => handleCoaUpload(e.target.files?.[0] ?? null, index)}
                      className="text-xs border border-navy/10 rounded-lg p-2 bg-ivory/50 flex-1 outline-none"
                    />
                    <input
                      placeholder="CoA Document URL path"
                      value={product.coaUrl || ""}
                      onChange={(e) => {
                        const updated = [...productsList];
                        updated[index].coaUrl = e.target.value;
                        updateProducts(updated);
                      }}
                      className="text-xs border border-navy/10 rounded-lg p-2.5 bg-white w-full sm:w-72 outline-none focus:border-gold"
                    />
                  </div>
                  {product.coaUrl && (
                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <FileCheck size={12} /> Registered CoA path: {product.coaUrl}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs Editor */}
        <div className="grid gap-5 rounded-2xl border border-navy/10 bg-mist p-6">
          <h3 className="text-lg font-bold text-navy">Technical Specifications Table</h3>
          <TextArea
            label="Specs Overview Description"
            value={specsData.description}
            onChange={(val) => updateSpecs({ ...specsData, description: val })}
          />
          <TextArea
            label="Secure Logistics Description ( Polymer Tarps & washing )"
            value={specsData.secureLogistics}
            onChange={(val) => updateSpecs({ ...specsData, secureLogistics: val })}
          />

          <div className="mt-4 border-t border-navy/5 pt-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-navy">Metallurgical Parameter Configs</p>
              <button
                type="button"
                onClick={() => {
                  const table = specsData.specificationsTable || [];
                  updateSpecs({ ...specsData, specificationsTable: [...table, { parameter: "", value: "" }] });
                }}
                className="inline-flex items-center gap-1.5 rounded bg-navy text-[10px] font-bold text-white px-2.5 py-1.5"
              >
                + Add Parameter
              </button>
            </div>
            <div className="space-y-2">
              {(specsData.specificationsTable || []).map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    placeholder="Parameter (e.g. Hematite Fe content)"
                    value={row.parameter}
                    onChange={(e) => {
                      const table = [...specsData.specificationsTable];
                      table[idx].parameter = e.target.value;
                      updateSpecs({ ...specsData, specificationsTable: table });
                    }}
                    className="flex-1 rounded border border-navy/10 px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                  <input
                    placeholder="Configuration (e.g. 64% - 67%)"
                    value={row.value}
                    onChange={(e) => {
                      const table = [...specsData.specificationsTable];
                      table[idx].value = e.target.value;
                      updateSpecs({ ...specsData, specificationsTable: table });
                    }}
                    className="flex-1 rounded border border-navy/10 px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const table = specsData.specificationsTable.filter((_, i) => i !== idx);
                      updateSpecs({ ...specsData, specificationsTable: table });
                    }}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety & ISO Guidelines Editor */}
        <div className="grid gap-5 rounded-2xl border border-navy/10 bg-mist p-6">
          <h3 className="text-lg font-bold text-navy">Safety & ISO Excellence Guidelines</h3>
          <TextArea
            label="Safety Dashboard Overview"
            value={safetyData.overview}
            onChange={(val) => updateSafety({ ...safetyData, overview: val })}
          />

          <div className="mt-4 border-t border-navy/5 pt-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-navy">Safety Rules Cards (Max 3 recommended)</p>
              <button
                type="button"
                onClick={() => {
                  const items = safetyData.items || [];
                  updateSafety({ ...safetyData, items: [...items, { title: "", text: "" }] });
                }}
                className="inline-flex items-center gap-1.5 rounded bg-navy text-[10px] font-bold text-white px-2.5 py-1.5"
              >
                + Add Rule
              </button>
            </div>
            <div className="space-y-4">
              {(safetyData.items || []).map((row, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-navy/5 grid gap-2">
                  <input
                    placeholder="Rule Title"
                    value={row.title}
                    onChange={(e) => {
                      const items = [...safetyData.items];
                      items[idx].title = e.target.value;
                      updateSafety({ ...safetyData, items });
                    }}
                    className="rounded border border-navy/10 px-3 py-2 text-xs font-bold outline-none focus:border-gold"
                  />
                  <textarea
                    placeholder="Description text"
                    value={row.text}
                    rows={2}
                    onChange={(e) => {
                      const items = [...safetyData.items];
                      items[idx].text = e.target.value;
                      updateSafety({ ...safetyData, items });
                    }}
                    className="rounded border border-navy/10 px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const items = safetyData.items.filter((_, i) => i !== idx);
                      updateSafety({ ...safetyData, items });
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold self-start"
                  >
                    Delete Rule
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms of Supply & Legal Disclaimer Editor */}
        <div className="grid gap-5 rounded-2xl border border-navy/10 bg-mist p-6">
          <h3 className="text-lg font-bold text-navy">Legal Disclaimers & Raw Material Supply Terms</h3>
          <TextArea
            label="Website Legal Disclaimer"
            value={supplyTerms.legalDisclaimer}
            onChange={(val) => updateSupply({ ...supplyTerms, legalDisclaimer: val })}
          />

          <div className="mt-4 border-t border-navy/5 pt-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-navy">Terms of Supply Clauses</p>
              <button
                type="button"
                onClick={() => {
                  const clauses = supplyTerms.terms || [];
                  updateSupply({ ...supplyTerms, terms: [...clauses, { title: "", text: "" }] });
                }}
                className="inline-flex items-center gap-1.5 rounded bg-navy text-[10px] font-bold text-white px-2.5 py-1.5"
              >
                + Add Clause
              </button>
            </div>
            <div className="space-y-4">
              {(supplyTerms.terms || []).map((row, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-navy/5 grid gap-2">
                  <input
                    placeholder="Clause Title (e.g. Title & Risk Allocation)"
                    value={row.title}
                    onChange={(e) => {
                      const clauses = [...supplyTerms.terms];
                      clauses[idx].title = e.target.value;
                      updateSupply({ ...supplyTerms, terms: clauses });
                    }}
                    className="rounded border border-navy/10 px-3 py-2 text-xs font-bold outline-none focus:border-gold"
                  />
                  <textarea
                    placeholder="Clause text copy"
                    value={row.text}
                    rows={2}
                    onChange={(e) => {
                      const clauses = [...supplyTerms.terms];
                      clauses[idx].text = e.target.value;
                      updateSupply({ ...supplyTerms, terms: clauses });
                    }}
                    className="rounded border border-navy/10 px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clauses = supplyTerms.terms.filter((_, i) => i !== idx);
                      updateSupply({ ...supplyTerms, terms: clauses });
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold self-start"
                  >
                    Delete Clause
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset Allocations Editor */}
        <div className="grid gap-5 rounded-2xl border border-navy/10 bg-mist p-6">
          <h3 className="text-lg font-bold text-navy">Asset Allocation Tracking Statuses</h3>
          <p className="text-xs text-charcoal/60 -mt-2">Update availability levels and status highlights on the Global Procurement board.</p>

          <div className="grid gap-4 mt-2">
            {assetAllocations.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-navy/5 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase text-navy">Mineral Name</label>
                  <input
                    value={item.mineral}
                    onChange={(e) => {
                      const updated = [...assetAllocations];
                      updated[idx].mineral = e.target.value;
                      updateAllocations(updated);
                    }}
                    className="w-full rounded border border-navy/10 px-3 py-2 text-xs mt-1 outline-none"
                  />
                </div>
                <div className="w-full sm:w-60">
                  <label className="text-[10px] font-bold uppercase text-navy">Availability Status</label>
                  <input
                    value={item.status}
                    onChange={(e) => {
                      const updated = [...assetAllocations];
                      updated[idx].status = e.target.value;
                      updateAllocations(updated);
                    }}
                    className="w-full rounded border border-navy/10 px-3 py-2 text-xs mt-1 outline-none"
                  />
                </div>
                <div className="w-full sm:w-36">
                  <label className="text-[10px] font-bold uppercase text-navy">Status Badge Theme</label>
                  <select
                    value={item.color}
                    onChange={(e) => {
                      const updated = [...assetAllocations];
                      updated[idx].color = e.target.value as any;
                      updateAllocations(updated);
                    }}
                    className="w-full rounded border border-navy/10 px-3 py-2 text-xs mt-1 bg-white outline-none"
                  >
                    <option value="blue">Blue (Allocated)</option>
                    <option value="green">Green (Spot Available)</option>
                    <option value="yellow">Yellow (Limited)</option>
                    <option value="default">Gray (Default)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registered office inputs */}
        <div className="grid gap-5 border-t border-navy/10 pt-6">
          <h3 className="text-lg font-bold text-navy">Registered Office details</h3>
          <TextInput
            label="Corporate Registered Name"
            value={registeredOffice.officeName}
            onChange={(val) => updateOffice({ ...registeredOffice, officeName: val })}
          />
          <TextInput
            label="Corporate Registered Address"
            value={registeredOffice.address}
            onChange={(val) => updateOffice({ ...registeredOffice, address: val })}
          />
          <TextInput
            label="Mining Operations Village Tehsil Sihora details"
            value={registeredOffice.miningOperations}
            onChange={(val) => updateOffice({ ...registeredOffice, miningOperations: val })}
          />
          <TextArea
            label="ISO Certifications Details Text"
            value={registeredOffice.isoCertifications}
            onChange={(val) => updateOffice({ ...registeredOffice, isoCertifications: val })}
          />
        </div>

        {message ? (
          <p className={message.includes("success") || message.includes("uploaded") ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-red-700"}>
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-navy">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-navy">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal leading-7 outline-none transition focus:border-gold"
      />
    </label>
  );
}

function AssetInput({
  label,
  value,
  previewAlt,
  onValue,
  onFile
}: {
  label: string;
  value: string;
  previewAlt: string;
  onValue: (value: string) => void;
  onFile: (file: File | null) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-navy/10 bg-ivory p-4">
      <p className="text-sm font-semibold text-navy">{label}</p>
      <div className="h-32 overflow-hidden rounded-xl bg-white">
        {value ? (
          <img src={resolveApiUrl(value)} alt={previewAlt} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => onFile(event.target.files?.[0] ?? null)}
        className="rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm font-normal outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-gold"
      />
      <div className="flex items-center gap-2 text-xs text-charcoal/55">
        <Upload size={14} />
        Upload image or paste URL below.
      </div>
      <input
        value={value}
        onChange={(event) => onValue(event.target.value)}
        className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
      />
    </div>
  );
}
