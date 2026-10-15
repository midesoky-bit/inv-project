import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const STATIC_TAGS = new Set(["services", "insights", "esg", "case-studies"]);
const SERVICE_TAG = /^service:[a-z0-9-]+$/;

function isAllowedTag(tag: unknown): tag is string {
  return (
    typeof tag === "string" && (STATIC_TAGS.has(tag) || SERVICE_TAG.test(tag))
  );
}

function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "Revalidation is not configured" },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!secretMatches(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tags = (body as { tags?: unknown })?.tags;
  if (!Array.isArray(tags) || tags.length === 0 || !tags.every(isAllowedTag)) {
    return NextResponse.json(
      { error: "Provide a non-empty `tags` array of known tags" },
      { status: 400 },
    );
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: tags });
}
