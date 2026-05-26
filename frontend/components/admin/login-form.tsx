"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mins.in");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { ...API_TUNNEL_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Invalid login details");
      }

      const data = (await response.json()) as { token: string };
      window.localStorage.setItem("mins-admin-token", data.token);
      router.push("/admin");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to login");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <label className="grid gap-2 text-sm font-semibold text-navy">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-navy">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
        />
      </label>
      {message ? <p className="text-sm font-semibold text-red-700">{message}</p> : null}
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Logging in..." : "Login & Manage Uploads"}
      </Button>
    </form>
  );
}

