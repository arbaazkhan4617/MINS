"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, API_TUNNEL_HEADERS, resolveApiUrl } from "@/lib/api";
import {
  createMediaCategory,
  createMediaSubCategory,
  createMediaUrl,
  deleteMediaItem,
  fetchMediaCategories,
  fetchMediaItems,
  fetchMediaSubCategories,
  updateMediaCategory,
  updateMediaItem,
  updateMediaSubCategory,
  type MediaCategory,
  type MediaItem,
  type MediaSubCategory
} from "@/lib/media-store";

function isPlayableVideo(item: MediaItem) {
  return item.type === "Video" && /\.(mp4|webm|ogg|mov|m4v)(?:[?#]|$)/i.test(item.url);
}

type MediaEditForm = {
  title: string;
  category: string;
  subCategory: string;
};

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Operations");
  const [files, setFiles] = useState<File[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaUrlType, setMediaUrlType] = useState<"Image" | "Video">("Image");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editForm, setEditForm] = useState<Omit<MediaEditForm, "subCategory">>({ title: "", category: "" });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryEditName, setCategoryEditName] = useState("");
  const [message, setMessage] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const activeCategories = useMemo(() => categories.filter((entry) => entry.active), [categories]);
  const uploadCategoryOptions = activeCategories.length > 0 ? activeCategories : categories;

  const editCategoryOptions = useMemo(() => {
    const options = activeCategories.map((entry) => entry.name);
    if (editingItem?.category && !options.includes(editingItem.category)) options.push(editingItem.category);
    return options;
  }, [activeCategories, editingItem]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      [item.title, item.category, item.type]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [items, search]);

  async function loadMedia() {
    setItems(await fetchMediaItems());
  }

  async function loadCategories() {
    const nextCategories = await fetchMediaCategories();
    setCategories(nextCategories);

    const firstActive = nextCategories.find((entry) => entry.active)?.name;
    if (firstActive) {
      setCategory((current) =>
        nextCategories.some((entry) => entry.active && entry.name === current) ? current : firstActive
      );
    }
  }

  async function loadAll() {
    await Promise.all([loadMedia(), loadCategories()]);
  }

  useEffect(() => {
    void loadAll();
  }, []);

  function getToken() {
    return window.localStorage.getItem("mins-admin-token");
  }

  function handleCategoryChange(nextCategory: string) {
    setCategory(nextCategory);
  }

  function handleEditCategoryChange(nextCategory: string) {
    setEditForm((current) => ({ ...current, category: nextCategory }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if ((files.length === 0 && !mediaUrl.trim()) || !title.trim() || !category.trim()) {
      setStatus("error");
      setMessage("Add a title, category, and either at least one file or media URL.");
      return;
    }

    const token = getToken();
    if (!token) {
      setStatus("error");
      setMessage("Please login before saving media.");
      return;
    }

    try {
      setStatus("loading");

      if (files.length === 0 && mediaUrl.trim()) {
        await createMediaUrl({ title, category, subCategory: category, type: mediaUrlType, url: mediaUrl.trim() }, token);
      } else {
        // Sequentially upload all files
        for (let i = 0; i < files.length; i++) {
          const currentFile = files[i];
          const fileTitle = files.length > 1 ? `${title} - ${i + 1}` : title;
          const formData = new FormData();
          formData.append("file", currentFile);
          formData.append("title", fileTitle);
          formData.append("category", category);
          formData.append("subCategory", category);

          const response = await fetch(`${API_BASE_URL}/api/media`, {
            method: "POST",
            headers: { ...API_TUNNEL_HEADERS, Authorization: `Bearer ${token}` },
            body: formData
          });

          if (!response.ok) {
            throw new Error(`Upload failed for file "${currentFile.name}". Login again and retry.`);
          }
        }
      }

      setTitle("");
      setFiles([]);
      setMediaUrl("");
      setMediaUrlType("Image");
      setStatus("success");
      setMessage(files.length > 1 ? "All media files saved successfully." : "Media saved successfully.");
      await loadMedia();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save media.");
    }
  }

  function openEdit(item: MediaItem) {
    setEditingItem(item);
    setEditForm({ title: item.title, category: item.category });
    setMessage("");
  }

  function closeEdit() {
    setEditingItem(null);
    setEditForm({ title: "", category: "" });
  }

  async function handleEditSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingItem) return;

    if (!editForm.title.trim() || !editForm.category.trim()) {
      setMessage("Title and category are required.");
      return;
    }

    const token = getToken();
    if (!token) {
      setMessage("Please login before editing media.");
      return;
    }

    try {
      await updateMediaItem(editingItem.id, { ...editForm, subCategory: editForm.category }, token);
      closeEdit();
      await loadMedia();
      setStatus("success");
      setMessage("Media updated successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update media.");
    }
  }

  async function handleDelete(item: MediaItem) {
    const confirmed = window.confirm(`Delete ${item.title}?`);
    if (!confirmed) return;

    const token = getToken();
    if (!token) {
      setMessage("Please login before deleting media.");
      return;
    }

    try {
      await deleteMediaItem(item.id, token);
      await loadMedia();
      setStatus("success");
      setMessage("Media deleted successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to delete media.");
    }
  }

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCategoryMessage("");

    const token = getToken();
    if (!token) {
      setCategoryMessage("Please login before creating categories.");
      return;
    }

    if (!newCategoryName.trim()) {
      setCategoryMessage("Category name is required.");
      return;
    }

    try {
      await createMediaCategory({ name: newCategoryName, active: true }, token);
      setNewCategoryName("");
      setCategoryMessage("Category created successfully.");
      await loadCategories();
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : "Unable to create category.");
    }
  }

  function startCategoryEdit(entry: MediaCategory) {
    setEditingCategoryId(entry.id);
    setCategoryEditName(entry.name);
    setCategoryMessage("");
  }

  function cancelCategoryEdit() {
    setEditingCategoryId(null);
    setCategoryEditName("");
  }

  async function saveCategory(entry: MediaCategory) {
    const token = getToken();
    if (!token) {
      setCategoryMessage("Please login before updating categories.");
      return;
    }

    if (!categoryEditName.trim()) {
      setCategoryMessage("Category name is required.");
      return;
    }

    try {
      await updateMediaCategory(entry.id, { name: categoryEditName, active: entry.active }, token);
      cancelCategoryEdit();
      setCategoryMessage("Category updated successfully.");
      await loadAll();
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : "Unable to update category.");
    }
  }

  async function toggleCategory(entry: MediaCategory) {
    const token = getToken();
    if (!token) {
      setCategoryMessage("Please login before updating categories.");
      return;
    }

    try {
      await updateMediaCategory(entry.id, { name: entry.name, active: !entry.active }, token);
      setCategoryMessage(entry.active ? "Category disabled." : "Category enabled.");
      await loadCategories();
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : "Unable to update category.");
    }
  }

  // Subcategory event handlers removed

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-navy">Upload Images & Videos</h1>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">
              Media is saved with category. Uploaded files will be displayed in their respective public sections.
            </p>
          </div>
          <Link href="/admin/login" className="rounded-full border border-navy/10 px-5 py-3 text-sm font-bold text-navy transition hover:bg-ivory">
            Admin Login
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 rounded-2xl border border-dashed border-gold/60 bg-ivory p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Media Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Example: Dispatch Visit 01" className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Category
              <select value={category} onChange={(event) => handleCategoryChange(event.target.value)} className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold">
                {uploadCategoryOptions.map((entry) => (
                  <option key={entry.id} value={entry.name}>{entry.name}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Image / Video Files
            <input type="file" multiple key={files.length === 0 ? "empty" : "selected"} accept="image/*,video/*" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} className="rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm font-normal outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-gold" />
            {files.length > 0 && (
              <span className="text-xs font-semibold text-emerald-700 mt-1">
                {files.length} {files.length === 1 ? "file" : "files"} selected: {files.map((f) => f.name).join(", ")}
              </span>
            )}
          </label>
          <div className="grid gap-5 md:grid-cols-[1fr_180px]">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Or Media URL
              <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="Paste image or video URL" className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              URL Type
              <select value={mediaUrlType} onChange={(event) => setMediaUrlType(event.target.value as "Image" | "Video")} className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold">
                <option value="Image">Image</option>
                <option value="Video">Video</option>
              </select>
            </label>
          </div>
          <p className="text-xs leading-5 text-charcoal/55">
            Choose a file upload or paste a URL. Both are saved in the backend database.
          </p>
          {message ? <p className={status === "error" ? "text-sm font-semibold text-red-700" : "text-sm font-semibold text-emerald-700"}>{message}</p> : null}
          <Button type="submit" className="w-fit gap-2" disabled={status === "loading"}>
            <Upload size={18} />
            {status === "loading" ? "Saving..." : "Upload Media"}
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-navy">Manage Categories</h2>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">
              Create, rename, enable, or disable top-level media categories.
            </p>
          </div>
          <form onSubmit={handleCreateCategory} className="flex w-full gap-3 lg:max-w-md">
            <input value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} placeholder="New category name" className="min-w-0 flex-1 rounded-xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none transition focus:border-gold" />
            <button type="submit" className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">Add</button>
          </form>
        </div>
        {categoryMessage ? <p className="mt-4 text-sm font-semibold text-charcoal/70">{categoryMessage}</p> : null}
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-navy/10 bg-ivory p-4">
              {editingCategoryId === entry.id ? (
                <div className="grid gap-3">
                  <input value={categoryEditName} onChange={(event) => setCategoryEditName(event.target.value)} className="rounded-xl border border-navy/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => saveCategory(entry)} className="rounded-full bg-navy px-4 py-2 text-xs font-bold text-white">Save</button>
                    <button type="button" onClick={cancelCategoryEdit} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-navy">{entry.name}</h3>
                  <p className={entry.active ? "mt-1 text-xs font-bold text-emerald-700" : "mt-1 text-xs font-bold text-red-700"}>{entry.active ? "Active" : "Disabled"}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => startCategoryEdit(entry)} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy">Edit</button>
                    <button type="button" onClick={() => toggleCategory(entry)} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy">{entry.active ? "Disable" : "Enable"}</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Subcategory management section removed */}

      <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-navy">Manage Media</h2>
            <p className="mt-2 text-sm text-charcoal/60">Showing {filteredItems.length} of {items.length} media items.</p>
          </div>
          <label className="w-full lg:max-w-sm">
            <span className="sr-only">Search media</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, category, or subcategory" className="w-full rounded-xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none transition focus:border-gold" />
          </label>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-navy/10 bg-ivory shadow-card">
              <div className="h-48 bg-navy/5">
                {isPlayableVideo(item) ? (
                  <video src={resolveApiUrl(item.url)} className="h-48 w-full object-cover" muted loop playsInline controls />
                ) : item.url ? (
                  <img src={resolveApiUrl(item.url)} alt={item.title} className="h-48 w-full object-cover" />
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{item.category}</p>
                <h3 className="mt-2 text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-xs text-charcoal/55">Uploaded {new Date(item.uploadedAt).toLocaleDateString()}</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => openEdit(item)} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy">Edit</button>
                  <button type="button" onClick={() => handleDelete(item)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700">Delete</button>
                </div>
              </div>
            </article>
          ))}
          {filteredItems.length === 0 ? <div className="rounded-2xl bg-ivory p-6 text-sm font-semibold text-charcoal/60">No media matches your search.</div> : null}
        </div>
      </section>

      {editingItem ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-navy/70 p-4 backdrop-blur">
          <form onSubmit={handleEditSave} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">Edit Media</h2>
              <button type="button" onClick={closeEdit} className="rounded-full bg-ivory p-2 text-navy"><X size={18} /></button>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-navy">
                Title
                <input value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy">
                Category
                <select value={editForm.category} onChange={(event) => handleEditCategoryChange(event.target.value)} className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold">
                  {editCategoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
