"use client";

import { useRef, useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitCareerApplication } from "@/lib/career-store";

type CareerFormState = {
  name: string;
  phone: string;
  email: string;
  position: string;
  message: string;
};

const initialForm: CareerFormState = {
  name: "",
  phone: "",
  email: "",
  position: "Mining Engineer",
  message: ""
};

const positionOptions = [
  "Mining Engineer",
  "Geologist",
  "Site Supervisor",
  "Operations Manager",
  "Logistics Coordinator",
  "Accountant",
  "Other"
];

export function CareerForm() {
  const [form, setForm] = useState<CareerFormState>(initialForm);
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateField(field: keyof CareerFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const sizeLimit = 25 * 1024 * 1024; // 25MB limit match Spring Boot
      if (selectedFile.size > sizeLimit) {
        setStatus("error");
        setMessage("File is too large. Maximum size is 25MB.");
        setResume(null);
        return;
      }
      setResume(selectedFile);
      if (status === "error") {
        setStatus("idle");
        setMessage("");
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resume) {
      setStatus("error");
      setMessage("Please upload your resume.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("position", form.position);
      formData.append("message", form.message);

      await submitCareerApplication(formData);

      setForm(initialForm);
      setResume(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setStatus("success");
      setMessage("Application submitted successfully. Our HR team will review it and get in touch.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit application.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-5 rounded-[2rem] border border-navy/10 bg-ivory p-6 shadow-premium sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Full Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="John Doe"
            required
            className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Phone Number
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

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Email Address
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
          Position Applied For
          <select
            name="position"
            value={form.position}
            onChange={(event) => updateField("position", event.target.value)}
            className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal text-charcoal outline-none transition focus:border-gold"
          >
            {positionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-2 text-sm font-semibold text-navy">
        <span>Upload Resume (PDF, DOC, DOCX - Max 25MB)</span>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-navy/25 bg-white py-6 text-center transition hover:border-gold hover:bg-gold/5"
        >
          <input
            ref={fileInputRef}
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="hidden"
          />
          {resume ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-gold animate-bounce" />
              <span className="text-sm font-semibold text-navy">{resume.name}</span>
              <span className="text-xs text-charcoal/60">
                {(resume.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-navy/40 transition group-hover:text-gold" />
              <span className="text-sm font-semibold text-charcoal/80">
                Click to browse files
              </span>
              <span className="text-xs text-charcoal/50">Supports PDF, DOC, DOCX</span>
            </div>
          )}
        </div>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-navy">
        Brief Message / Cover Letter
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell us about yourself and why you'd be a great fit..."
          required
          className="resize-none rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
        />
      </label>

      {message ? (
        <div
          className={`flex items-start gap-3 rounded-xl p-4 text-sm font-semibold ${
            status === "error"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          {status === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          )}
          <span>{message}</span>
        </div>
      ) : null}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
