"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

type ServiceOption = { slug: string; title: string };

export function ContactForm({
  services,
  email,
}: {
  services: ServiceOption[];
  email: string;
}) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      service: String(data.get("service") ?? "").trim(),
      timeline: String(data.get("timeline") ?? "").trim(),
      budget: String(data.get("budget") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.service || !payload.message) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      const subject = encodeURIComponent(`Project enquiry: ${payload.service}`);
      const body = encodeURIComponent(
        [
          payload.name,
          payload.email,
          payload.company,
          payload.service,
          payload.timeline,
          payload.budget,
          payload.message,
        ]
          .filter(Boolean)
          .join("\n"),
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setStatus("success");
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus-visible:border-ring";

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-5" noValidate>
      <label className="text-sm font-medium text-foreground">
        {t("name")}*
        <input
          name="name"
          required
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          className={fieldClass}
        />
      </label>
      <label className="text-sm font-medium text-foreground">
        {t("email")}*
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className={fieldClass}
        />
      </label>
      <label className="text-sm font-medium text-foreground">
        {t("company")}
        <input
          name="company"
          autoComplete="organization"
          placeholder={t("companyPlaceholder")}
          className={fieldClass}
        />
      </label>
      <label className="text-sm font-medium text-foreground">
        {t("service")}*
        <select name="service" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            {t("servicePlaceholder")}
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
          <option value={t("multiple")}>{t("multiple")}</option>
          <option value={t("other")}>{t("other")}</option>
        </select>
      </label>
      <label className="text-sm font-medium text-foreground">
        {t("timeline")}
        <input
          name="timeline"
          placeholder={t("timelinePlaceholder")}
          className={fieldClass}
        />
      </label>
      <label className="text-sm font-medium text-foreground">
        {t("budget")}
        <input
          name="budget"
          placeholder={t("budgetPlaceholder")}
          className={fieldClass}
        />
      </label>
      <label className="text-sm font-medium text-foreground">
        {t("message")}*
        <textarea
          name="message"
          required
          rows={6}
          placeholder={t("messagePlaceholder")}
          className={fieldClass}
        />
      </label>
      <p className="text-sm leading-relaxed text-muted">{t("notice")}</p>
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
      >
        {t("submit")}
      </button>
      {status === "success" ? (
        <p className="text-sm text-accent" role="status">
          {t("success")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-700" role="alert">
          {t("error")}
        </p>
      ) : null}
    </form>
  );
}
