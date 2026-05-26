"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateAdminPassword } from "@/lib/auth-store";

export function PasswordManager() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function token() {
    return window.localStorage.getItem("mins-admin-token");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New password and confirmation do not match.");
      return;
    }

    const authToken = token();
    if (!authToken) {
      setStatus("error");
      setMessage("Please login again before updating the password.");
      return;
    }

    try {
      setStatus("loading");
      await updateAdminPassword({ currentPassword, newPassword }, authToken);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus("success");
      setMessage("Password updated successfully. Use the new password next time you login.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update password.");
    }
  }

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-navy">Admin Password</h2>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">
              Update the admin login password stored in the database.
            </p>
          </div>
          <Button type="submit" className="gap-2" disabled={status === "loading"}>
            <Save size={18} />
            {status === "loading" ? "Updating..." : "Update Password"}
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        {message ? (
          <p className={status === "success" ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-red-700"}>
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function PasswordInput({
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
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
      />
    </label>
  );
}
