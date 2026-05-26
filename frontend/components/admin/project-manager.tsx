"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  categoryOptions,
  initialProjects,
  loadProjectsFromStorage,
  placeholderProjectImage,
  saveProjectsToStorage,
  type ProjectItem
} from "@/lib/project-store";

type ProjectForm = Omit<ProjectItem, "id">;

const emptyForm: ProjectForm = {
  title: "",
  category: "Product Supply",
  image: placeholderProjectImage,
  summary: "",
  outcome: "",
  status: "Published"
};

export function ProjectManager() {
  const [items, setItems] = useState<ProjectItem[]>(initialProjects);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [message, setMessage] = useState("");

  const editingProject = useMemo(
    () => items.find((item) => item.id === editingId) ?? null,
    [editingId, items]
  );

  useEffect(() => {
    setItems(loadProjectsFromStorage());
  }, []);

  function persist(nextItems: ProjectItem[]) {
    setItems(nextItems);
    saveProjectsToStorage(nextItems);
  }

  function openNewProject() {
    setEditorOpen(true);
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  function openEditProject(project: ProjectItem) {
    setEditorOpen(true);
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      image: project.image,
      summary: project.summary,
      outcome: project.outcome,
      status: project.status
    });
    setMessage("");
  }

  function closeModal() {
    setEditorOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.category.trim() || !form.summary.trim()) {
      setMessage("Title, category, and summary are required.");
      return;
    }

    if (editingProject) {
      persist(
        items.map((item) =>
          item.id === editingProject.id ? { ...item, ...form } : item
        )
      );
      setMessage("Project updated successfully.");
      closeModal();
      return;
    }

    persist([
      {
        id: `project-${Date.now()}`,
        ...form
      },
      ...items
    ]);
    setMessage("Project created successfully.");
    closeModal();
  }

  function handleDelete(project: ProjectItem) {
    const confirmed = window.confirm(`Delete ${project.title}?`);
    if (!confirmed) return;
    persist(items.filter((item) => item.id !== project.id));
  }

  function handleImageUpload(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((current) => ({ ...current, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Projects</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            Create, edit, categorize, and remove portfolio project cards.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewProject}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-navy/10">
        <div className="hidden grid-cols-[1.2fr_0.8fr_1fr_0.8fr] bg-ivory px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/55 md:grid">
          <span>Project</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {items.map((project) => (
          <div
            key={project.id}
            className="grid gap-4 border-t border-navy/10 px-5 py-4 md:grid-cols-[1.2fr_0.8fr_1fr_0.8fr] md:items-center"
          >
            <div className="flex items-center gap-3">
              <img
                src={project.image}
                alt={project.title}
                className="h-14 w-20 rounded-xl object-cover"
              />
              <div>
                <h2 className="font-bold text-navy">{project.title}</h2>
                <p className="text-xs text-charcoal/55">Updated locally</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-charcoal/70">{project.category}</span>
            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              {project.status}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => openEditProject(project)}
                className="rounded-full border border-navy/10 px-4 py-2 text-xs font-bold text-navy transition hover:bg-ivory"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project)}
                className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editorOpen ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-navy/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.5rem] bg-white p-6 shadow-premium">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Project Details</p>
                <h2 className="mt-2 text-2xl font-bold text-navy">
                  {editingProject ? "Edit Project" : "New Project"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-navy/10 p-2 text-navy hover:bg-ivory"
                aria-label="Close project editor"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-navy">
                  Title
                  <input
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-navy">
                  Category
                  <select
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">
                <img
                  src={form.image || placeholderProjectImage}
                  alt="Project preview"
                  className="h-32 w-full rounded-2xl object-cover shadow-card"
                />
                <label className="grid gap-2 text-sm font-semibold text-navy">
                  Upload Project Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageUpload(event.target.files?.[0] ?? null)}
                    className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 text-sm font-normal outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-gold"
                  />
                  <input
                    value={form.image.startsWith("data:") ? "" : form.image}
                    onChange={(event) => setForm({ ...form, image: event.target.value })}
                    placeholder="Or paste image URL"
                    className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
                  />
                  <span className="flex items-center gap-2 text-xs font-normal leading-5 text-charcoal/55">
                    <Upload size={14} />
                    Upload JPG/PNG/WEBP or paste a direct image URL. The preview updates immediately.
                  </span>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-navy">
                Summary
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={(event) => setForm({ ...form, summary: event.target.value })}
                  className="resize-none rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy">
                Client Outcome
                <textarea
                  rows={2}
                  value={form.outcome}
                  onChange={(event) => setForm({ ...form, outcome: event.target.value })}
                  className="resize-none rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy">
                Status
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value as ProjectForm["status"] })}
                  className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold"
                >
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </label>
              {message ? <p className="text-sm font-semibold text-red-700">{message}</p> : null}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-navy/10 px-5 py-3 text-sm font-bold text-navy hover:bg-ivory"
                >
                  Cancel
                </button>
                <Button type="submit">Save Project</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
