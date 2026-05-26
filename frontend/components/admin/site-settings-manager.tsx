"use client";

import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveApiUrl } from "@/lib/api";
import {
  defaultSiteSettings,
  fetchSiteSettings,
  saveSiteSettings,
  uploadSiteAsset,
  type SiteSettings
} from "@/lib/site-settings-store";

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
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
            <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">
              Update company identity, contact details, map, WhatsApp number, social links, footer copyright, and about content.
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
          <TextInput label="Email" value={settings.email} onChange={(value) => update("email", value)} />
          <TextInput label="Mobile" value={settings.mobile} onChange={(value) => update("mobile", value)} />
          <TextInput label="WhatsApp Number" value={settings.whatsappNumber} onChange={(value) => update("whatsappNumber", value)} />
          <TextInput label="Location" value={settings.location} onChange={(value) => update("location", value)} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AssetInput
            label="Logo"
            value={settings.logoUrl}
            previewAlt="Company logo"
            onValue={(value) => update("logoUrl", value)}
            onFile={(file) => handleUpload(file, "logoUrl")}
          />
          <AssetInput
            label="About Image"
            value={settings.aboutImageUrl}
            previewAlt="About section"
            onValue={(value) => update("aboutImageUrl", value)}
            onFile={(file) => handleUpload(file, "aboutImageUrl")}
          />
        </div>

        <TextInput label="Map Embed URL" value={settings.mapEmbedUrl} onChange={(value) => update("mapEmbedUrl", value)} />

        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="Website Link" value={settings.websiteUrl} onChange={(value) => update("websiteUrl", value)} />
          <TextInput label="Facebook Link" value={settings.facebookUrl} onChange={(value) => update("facebookUrl", value)} />
          <TextInput label="Instagram Link" value={settings.instagramUrl} onChange={(value) => update("instagramUrl", value)} />
          <TextInput label="LinkedIn Link" value={settings.linkedinUrl} onChange={(value) => update("linkedinUrl", value)} />
          <TextInput label="X / Twitter Link" value={settings.xUrl} onChange={(value) => update("xUrl", value)} />
          <TextInput label="Copyright Text" value={settings.copyrightText} onChange={(value) => update("copyrightText", value)} />
        </div>

        <div className="grid gap-5">
          <TextInput label="About Eyebrow" value={settings.aboutEyebrow} onChange={(value) => update("aboutEyebrow", value)} />
          <TextInput label="About Title" value={settings.aboutTitle} onChange={(value) => update("aboutTitle", value)} />
          <TextArea label="About Content" value={settings.aboutContent} onChange={(value) => update("aboutContent", value)} />
          <TextArea label="Director Message" value={settings.directorMessage} onChange={(value) => update("directorMessage", value)} />
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
        className="resize-none rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal leading-7 outline-none transition focus:border-gold"
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
