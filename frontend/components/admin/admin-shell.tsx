"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FileImage,
  FolderKanban,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UsersRound,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/media", label: "Media", icon: FileImage },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/clients", label: "Clients", icon: UsersRound },
  { href: "/admin/queries", label: "Enquiries", icon: Inbox },
  { href: "/admin/content", label: "Homepage Content", icon: Settings },
  { href: "/admin/settings", label: "Site Settings", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-ivory">{children}</main>;
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-navy/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin" onClick={closeSidebar} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">
            M
          </span>
          <span>
            <span className="block font-display text-2xl font-bold text-navy">
              MINS
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Admin
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={closeSidebar}
          className="rounded-full border border-navy/10 p-2 text-navy lg:hidden"
          aria-label="Close admin navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="mt-10 grid gap-2">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
              pathname === link.href
                ? "bg-navy text-white"
                : "text-charcoal/70 hover:bg-ivory hover:text-navy"
            )}
          >
            <link.icon size={18} />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10 grid gap-2 border-t border-navy/10 pt-6">
        <Link
          href="/"
          onClick={closeSidebar}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-charcoal/70 hover:bg-ivory hover:text-navy"
        >
          <Home size={18} />
          View Website
        </Link>
        <Link
          href="/admin/login"
          onClick={closeSidebar}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-charcoal/70 hover:bg-ivory hover:text-navy"
        >
          <LogOut size={18} />
          Logout
        </Link>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-mist text-charcoal">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">{sidebar}</div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-navy/55"
              onClick={closeSidebar}
              aria-label="Close admin navigation overlay"
            />
            <div className="relative h-full w-[82vw] max-w-[320px] shadow-premium">
              {sidebar}
            </div>
          </div>
        ) : null}

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-navy/10 bg-white/86 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-full border border-navy/10 p-2 text-navy lg:hidden"
                  aria-label="Open admin navigation"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                    Content Management
                  </p>
                  <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
                </div>
              </div>
            </div>
          </header>
          <div className="p-5 lg:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
