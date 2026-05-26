"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  fetchContactQueries,
  updateContactQueryStatus,
  type ContactQuery
} from "@/lib/contact-query-store";

const statusOptions = ["New", "In Review", "Contacted", "Closed"];

export function ContactQueryManager({ compact = false }: { compact?: boolean }) {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadQueries();
  }, []);

  async function loadQueries() {
    const token = window.localStorage.getItem("mins-admin-token");
    setQueries(await fetchContactQueries(token));
  }

  async function handleStatusChange(id: number, status: string) {
    const token = window.localStorage.getItem("mins-admin-token");
    if (!token) {
      setMessage("Please login again to update enquiry status.");
      return;
    }

    try {
      const updated = await updateContactQueryStatus(id, status, token);
      setQueries((current) => current.map((query) => (query.id === id ? updated : query)));
      setMessage("Enquiry status updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update enquiry status.");
    }
  }

  const filteredQueries = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? queries.filter((query) =>
          [query.name, query.email, query.phone, query.message, query.status]
            .join(" ")
            .toLowerCase()
            .includes(term)
        )
      : queries;

    return [...filtered].sort((a, b) => {
      const left = new Date(a.createdAt).getTime();
      const right = new Date(b.createdAt).getTime();
      return sortDirection === "desc" ? right - left : left - right;
    });
  }, [queries, search, sortDirection]);

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-navy">Submitted Enquiries</h2>
          <p className="mt-2 text-sm text-charcoal/60">
            Enquiries submitted from the website contact form.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search enquiries"
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

      <div className={compact ? "mt-6 max-h-[420px] overflow-auto rounded-2xl border border-navy/10" : "mt-6 max-h-[620px] overflow-auto rounded-2xl border border-navy/10"}>
        <div className="hidden min-w-[980px] grid-cols-[0.8fr_1fr_0.85fr_1.4fr_0.75fr_0.8fr] bg-ivory px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/55 lg:grid">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Message</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {filteredQueries.map((query) => (
          <div
            key={query.id}
            className="grid gap-3 border-t border-navy/10 px-5 py-4 text-sm text-charcoal/70 lg:min-w-[980px] lg:grid-cols-[0.8fr_1fr_0.85fr_1.4fr_0.75fr_0.8fr]"
          >
            <strong className="text-navy">{query.name}</strong>
            <a href={`mailto:${query.email}`} className="break-all hover:text-navy">
              {query.email}
            </a>
            <a href={`tel:${query.phone}`} className="hover:text-navy">
              {query.phone}
            </a>
            <span className="leading-6">{query.message}</span>
            <span>{new Date(query.createdAt).toLocaleDateString()}</span>
            <select
              value={query.status}
              onChange={(event) => handleStatusChange(query.id, event.target.value)}
              className="w-fit rounded-full border border-navy/10 bg-ivory px-3 py-2 text-xs font-bold text-navy outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}

        {filteredQueries.length === 0 ? (
          <div className="border-t border-navy/10 px-5 py-8 text-center text-sm font-semibold text-charcoal/60">
            No contact enquiries found.
          </div>
        ) : null}
      </div>
    </section>
  );
}
