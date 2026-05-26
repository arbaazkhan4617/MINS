"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveApiUrl } from "@/lib/api";
import {
  deleteClient,
  fetchClients,
  saveClient,
  uploadClientPhoto,
  type ClientProfile,
  type ClientProfileInput
} from "@/lib/client-store";

const emptyForm: ClientProfileInput = {
  name: "",
  role: "",
  company: "",
  quote: "",
  photoUrl: "",
  displayOrder: 1
};

export function ClientManager() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [form, setForm] = useState<ClientProfileInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadClients();
  }, []);

  async function loadClients() {
    setClients(await fetchClients());
  }

  function token() {
    return window.localStorage.getItem("mins-admin-token");
  }

  async function handlePhotoUpload(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file for the client photo.");
      return;
    }

    const authToken = token();
    if (!authToken) {
      setMessage("Please login again before uploading photos.");
      return;
    }

    try {
      const uploaded = await uploadClientPhoto(file, authToken);
      setForm((current) => ({ ...current, photoUrl: uploaded.url }));
      setMessage("Client photo uploaded. Save the client to publish it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload client photo.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const authToken = token();
    if (!authToken) {
      setMessage("Please login again before saving clients.");
      return;
    }

    if (!form.name.trim() || !form.role.trim() || !form.company.trim() || !form.quote.trim() || !form.photoUrl.trim()) {
      setMessage("Name, role, company, quote, and photo are required.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await saveClient(form, authToken, editingId ?? undefined);
      setForm({ ...emptyForm, displayOrder: clients.length + 1 });
      setEditingId(null);
      await loadClients();
      setMessage("Client saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save client.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const authToken = token();
    if (!authToken) {
      setMessage("Please login again before deleting clients.");
      return;
    }

    try {
      await deleteClient(id, authToken);
      await loadClients();
      if (editingId === id) {
        resetForm();
      }
      setMessage("Client deleted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete client.");
    }
  }

  function startEdit(client: ClientProfile) {
    setEditingId(client.id);
    setForm({
      name: client.name,
      role: client.role,
      company: client.company,
      quote: client.quote,
      photoUrl: client.photoUrl,
      displayOrder: client.displayOrder
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, displayOrder: clients.length + 1 });
    setMessage("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">Manage Clients</h1>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">
              Add, update, remove, and reorder client voices shown on the website.
            </p>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-navy/10 p-2 text-navy"
              aria-label="Cancel editing"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Client Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Designation / Role
              <input
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Company
              <input
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
                className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-navy">
            Feedback / Quote
            <textarea
              value={form.quote}
              onChange={(event) => setForm({ ...form, quote: event.target.value })}
              rows={4}
              className="resize-none rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal leading-7 outline-none transition focus:border-gold"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
            <div className="h-24 w-24 overflow-hidden rounded-2xl bg-ivory">
              {form.photoUrl ? (
                <img src={resolveApiUrl(form.photoUrl)} alt={form.name || "Client photo"} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-navy">
                Photo Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handlePhotoUpload(event.target.files?.[0] ?? null)}
                  className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 text-sm font-normal outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-gold"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy">
                Or Photo URL
                <input
                  value={form.photoUrl}
                  onChange={(event) => setForm({ ...form, photoUrl: event.target.value })}
                  className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
                />
              </label>
            </div>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-navy">
            Display Order
            <input
              type="number"
              min={1}
              value={form.displayOrder}
              onChange={(event) => setForm({ ...form, displayOrder: Number(event.target.value) || 1 })}
              className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
            />
          </label>

          {message ? (
            <p className={message.includes("success") || message.includes("uploaded") ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-red-700"}>
              {message}
            </p>
          ) : null}

          <Button type="submit" className="gap-2" disabled={isSaving}>
            {editingId ? <Save size={18} /> : <Plus size={18} />}
            {isSaving ? "Saving..." : editingId ? "Update Client" : "Add Client"}
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
        <h2 className="text-xl font-bold text-navy">Current Clients</h2>
        <div className="mt-6 grid gap-4">
          {clients.map((client) => (
            <article key={client.id} className="rounded-2xl border border-navy/10 bg-ivory p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <img
                  src={resolveApiUrl(client.photoUrl)}
                  alt={client.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-bold text-navy">{client.name}</h3>
                      <p className="mt-1 text-sm text-charcoal/65">
                        {client.role} - {client.company}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gold">
                      Order {client.displayOrder}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-charcoal/70">"{client.quote}"</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(client)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(client.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {clients.length === 0 ? (
            <div className="rounded-2xl bg-ivory p-6 text-sm font-semibold text-charcoal/60">
              No clients added yet.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
