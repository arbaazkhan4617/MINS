import { projects as defaultProjects } from "@/lib/data";

export type ProjectItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  outcome: string;
  status: "Published" | "Draft";
};

export const PROJECT_STORAGE_KEY = "mins-admin-projects";

export const categoryOptions = [
  "Product Supply",
  "Trading",
  "Consultancy",
  "Customer Support",
  "Marketing",
  "Industrial Solutions"
];

export const placeholderProjectImage =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85";

export const initialProjects: ProjectItem[] = defaultProjects.map((project, index) => ({
  id: `project-${index + 1}`,
  title: project.title,
  category: project.category,
  image: project.image,
  summary: project.summary,
  outcome: project.outcome,
  status: "Published"
}));

export function loadProjectsFromStorage() {
  if (typeof window === "undefined") {
    return initialProjects;
  }

  const saved = window.localStorage.getItem(PROJECT_STORAGE_KEY);
  if (!saved) {
    return initialProjects;
  }

  try {
    const parsed = JSON.parse(saved) as ProjectItem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    window.localStorage.removeItem(PROJECT_STORAGE_KEY);
  }

  return initialProjects;
}

export function saveProjectsToStorage(projects: ProjectItem[]) {
  window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event("mins-projects-updated"));
}
