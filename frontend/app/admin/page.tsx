"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FileImage,
  FolderKanban,
  Inbox,
  Settings,
  Upload,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import { ContactQueryManager } from "@/components/admin/contact-query-manager";
import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";
import { fetchClients } from "@/lib/client-store";
import { fetchContactQueries } from "@/lib/contact-query-store";
import { fetchHomepageContent } from "@/lib/homepage-store";

type DashboardState = {
  mediaItems: number;
  projects: number;
  clients: number;
  enquiries: number;
  activities: string[];
};

type MediaItem = { id: number | string };
type Project = { id: number | string };

const quickActions = [
  { label: "Upload Images", href: "/admin/media", icon: Upload },
  { label: "Upload Videos", href: "/admin/media", icon: Upload },
  { label: "Create Project", href: "/admin/projects", icon: FolderKanban },
  { label: "Manage Clients", href: "/admin/clients", icon: UsersRound },
  { label: "View Enquiries", href: "/admin/queries", icon: Inbox },
  { label: "Edit Homepage Content", href: "/admin/content", icon: Settings }
];

const initialDashboard: DashboardState = {
  mediaItems: 0,
  projects: 0,
  clients: 0,
  enquiries: 0,
  activities: ["Loading latest admin content..."]
};

async function fetchList<T>(url: string, token: string | null) {
  const response = await fetch(url, {
    headers: token
      ? { ...API_TUNNEL_HEADERS, Authorization: `Bearer ${token}` }
      : API_TUNNEL_HEADERS
  });

  if (!response.ok) return [];
  const data = (await response.json()) as T[];
  return Array.isArray(data) ? data : [];
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardState>(initialDashboard);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      const token = window.localStorage.getItem("mins-admin-token");

      const [media, projects, clients, contactQueries, homepageContent] = await Promise.all([
        fetchList<MediaItem>(`${API_BASE_URL}/api/media`, token),
        fetchList<Project>(`${API_BASE_URL}/api/projects`, token),
        fetchClients(),
        fetchContactQueries(token),
        fetchHomepageContent()
      ]);

      if (!mounted) return;

      setDashboard({
        mediaItems: media.length,
        projects: projects.length,
        clients: clients.length,
        enquiries: contactQueries.length,
        activities: [
          `${media.length} media item${media.length === 1 ? "" : "s"} available in the library`,
          `${projects.length} project${projects.length === 1 ? "" : "s"} ready for the work page`,
          `${clients.length} client voice${clients.length === 1 ? "" : "s"} shown on the website`,
          `${contactQueries.length} submitted enquir${contactQueries.length === 1 ? "y" : "ies"} available for follow-up`,
          `Homepage hero uses ${homepageContent.heroMediaType} media`
        ]
      });
    }

    void loadDashboard();

    function refreshDashboard() {
      void loadDashboard();
    }

    window.addEventListener("mins-homepage-content-updated", refreshDashboard);
    window.addEventListener("storage", refreshDashboard);

    return () => {
      mounted = false;
      window.removeEventListener("mins-homepage-content-updated", refreshDashboard);
      window.removeEventListener("storage", refreshDashboard);
    };
  }, []);

  const metrics = useMemo(
    () =>
      [
        { label: "Media Items", value: String(dashboard.mediaItems), icon: FileImage },
        { label: "Projects", value: String(dashboard.projects), icon: FolderKanban },
        { label: "Clients", value: String(dashboard.clients), icon: UsersRound },
        { label: "Enquiries", value: String(dashboard.enquiries), icon: Inbox }
      ] satisfies Array<{ label: string; value: string; icon: LucideIcon }>,
    [dashboard]
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold">
                <metric.icon size={22} />
              </div>
              <p className="font-display text-4xl font-semibold text-navy">
                {metric.value}
              </p>
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-charcoal/55">
              {metric.label}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
          <h2 className="text-xl font-bold text-navy">Quick Actions</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group rounded-2xl border border-navy/10 bg-ivory p-5 text-left text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:border-gold/50"
              >
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gold transition group-hover:bg-gold group-hover:text-navy">
                  <action.icon size={17} />
                </span>
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
          <h2 className="text-xl font-bold text-navy">Recent Activity</h2>
          <div className="mt-6 grid gap-4">
            {dashboard.activities.map((activity) => (
              <div
                key={activity}
                className="rounded-2xl bg-mist p-4 text-sm font-semibold leading-6 text-charcoal/70"
              >
                {activity}
              </div>
            ))}
          </div>
        </section>
      </div>

      <ContactQueryManager compact />
    </div>
  );
}
