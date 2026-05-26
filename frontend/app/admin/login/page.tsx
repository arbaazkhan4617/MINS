import Link from "next/link";
import { LockKeyhole, Upload } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-[1.75rem] border border-navy/10 bg-white p-8 shadow-premium">
        <Link href="/" className="mx-auto flex w-fit items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">M</span>
          <span>
            <span className="block font-display text-2xl font-bold text-navy">MINS</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Admin Login</span>
          </span>
        </Link>

        <div className="mt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ivory text-gold">
            <LockKeyhole size={24} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-navy">Media Admin Access</h1>
          <p className="mt-2 text-sm leading-6 text-charcoal/60">
            Login to upload images, upload videos, manage media, projects, homepage content, and contact queries.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-xs font-bold text-navy">
            <Upload size={15} /> Image & Video Uploads
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

