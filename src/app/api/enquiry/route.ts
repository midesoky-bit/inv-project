import { NextResponse } from "next/server";

type Enquiry = {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  timeline?: string;
  budget?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: Enquiry;
  try {
    body = (await request.json()) as Enquiry;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const service = body.service?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !service || !message || !email.includes("@")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = {
    name,
    email,
    company: body.company?.trim() ?? "",
    service,
    timeline: body.timeline?.trim() ?? "",
    budget: body.budget?.trim() ?? "",
    message,
  };

  const webhook = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!webhook) {
    return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 });
  }

  const forwarded = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!forwarded.ok) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
