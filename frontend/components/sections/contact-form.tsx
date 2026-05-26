"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          ...API_TUNNEL_HEADERS,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Unable to submit enquiry. Please try again.");
      }

      setForm(initialForm);
      setStatus("success");
      setMessage("Enquiry submitted successfully. Our team will contact you soon.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit enquiry.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-[1.75rem] border border-navy/10 bg-ivory p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your name"
            required
            className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Phone
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+91"
            required
            className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-navy">
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="you@example.com"
          required
          className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-navy">
        Message
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="How can we help?"
          required
          className="resize-none rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
        />
      </label>
      {message ? (
        <p className={status === "error" ? "text-sm font-semibold text-red-700" : "text-sm font-semibold text-emerald-700"}>
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Enquiry"}
      </Button>
    </form>
  );
}
