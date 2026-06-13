"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ExternalLink, FileDown } from "lucide-react";
import { resolveApiUrl } from "@/lib/api";
import {
  fetchCareerApplications,
  updateCareerApplicationStatus,
  type CareerApplication
} from "@/lib/career-store";

const statusOptions = ["New", "Reviewed", "Shortlisted", "Rejected"];

export function CareerManager() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadApplications();
  }, []);

  async function loadApplications() {
    const token = window.localStorage.getItem("mins-admin-token");
    setApplications(await fetchCareerApplications(token));
  }

  async function handleStatusChange(id: number, status: string) {
    const token = window.localStorage.getItem("mins-admin-token");
    if (!token) {
      setMessage("Please login again to update application status.");
      return;
    }

    try {
      const updated = await updateCareerApplicationStatus(id, status, token);
      setApplications((current) => current.map((app) => (app.id === id ? updated : app)));
      setMessage("Application status updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update status.");
    }
  }

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? applications.filter((app) =>
          [app.name, app.email, app.phone, app.position, app.message, app.status]
            .join(" ")
            .toLowerCase()
            .includes(term)
        )
      : applications;

    return [...filtered].sort((a, b) => {
      const left = new Date(a.createdAt).getTime();
      const right = new Date(b.createdAt).getTime();
      return sortDirection === "desc" ? right - left : left - right;
    });
  }, [applications, search, sortDirection]);

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-navy">Career Applications</h2>
          <p className="mt-2 text-sm text-charcoal/60">
            View and manage resumes and responses submitted by candidates.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search applications"
              className="w-full rounded-full border border-navy/10 bg-ivory py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gold sm:w-72"
            />
          </label>
          <select
            value={sortDirection}
            onChange={(event) => setSortDirection(event.target.value as "desc" | "asc")}
            className="rounded-full border border-navy/10 bg-ivory px-4 py-3 text-sm font-semibold text-navy outline-none transition focus:border-gold"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {message ? (
        <p className={message.includes("updated") ? "mt-4 text-sm font-semibold text-emerald-700" : "mt-4 text-sm font-semibold text-red-700"}>
          {message}
        </p>
      ) : null}

      <div className="mt-6 max-h-[620px] overflow-auto rounded-2xl border border-navy/10">
        <div className="hidden grid-cols-[0.7fr_1.2fr_0.9fr_1fr_1.5fr_0.8fr_0.8fr_1.1fr] bg-ivory px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/55 lg:grid">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Position</span>
          <span>Cover Note</span>
          <span>Resume</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="grid gap-3 border-t border-navy/10 px-5 py-4 text-sm text-charcoal/70 lg:grid-cols-[0.7fr_1.2fr_0.9fr_1fr_1.5fr_0.8fr_0.8fr_1.1fr]"
          >
            <strong className="truncate block text-navy" title={app.name}>{app.name}</strong>
            <a
              href={`mailto:${app.email}`}
              className="truncate block hover:text-navy"
              title={app.email}
            >
              {app.email}
            </a>
            <a href={`tel:${app.phone}`} className="truncate block hover:text-navy" title={app.phone}>
              {app.phone}
            </a>
            <span className="truncate block font-semibold text-navy/80" title={app.position}>
              {app.position}
            </span>
            <span className="truncate block leading-6" title={app.message}>
              {app.message}
            </span>
            <div>
              <a
                href={resolveApiUrl(app.resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy/10 bg-ivory px-2.5 py-1.5 text-xs font-bold text-navy hover:bg-gold/10 hover:border-gold/30 transition"
              >
                <FileDown size={14} className="text-gold" />
                Resume
              </a>
            </div>
            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
            <select
              value={app.status}
              onChange={(event) => handleStatusChange(app.id, event.target.value)}
              className="w-fit rounded-full border border-navy/10 bg-ivory px-2 py-1.5 text-xs font-bold text-navy outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}

        {filteredApplications.length === 0 ? (
          <div className="border-t border-navy/10 px-5 py-8 text-center text-sm font-semibold text-charcoal/60">
            No career applications found.
          </div>
        ) : null}
      </div>
    </section>
  );
}
