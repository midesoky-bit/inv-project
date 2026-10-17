import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const BARE_TAGS = new Set(["services", "insights", "esg", "case-studies", "careers"]);
const LOCALES = ["en", "ar"] as const;
const LOCALE_SCOPED_TAG =
  /^(services|insights|esg|case-studies|careers):(en|ar)$/;
const SERVICE_LOCALE_TAG = /^service:(en|ar):[a-z0-9-]+$/;

function isAllowedTag(tag: unknown): tag is string {
  return (
    typeof tag === "string" &&
    (BARE_TAGS.has(tag) ||
      LOCALE_SCOPED_TAG.test(tag) ||
      SERVICE_LOCALE_TAG.test(tag))
  );
}

function expandTags(tags: string[]): string[] {
  const expanded: string[] = [];
  for (const tag of tags) {
    if (BARE_TAGS.has(tag)) {
      for (const locale of LOCALES) {
        expanded.push(`${tag}:${locale}`);
      }
    } else {
      expanded.push(tag);
    }
  }
  return expanded;
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

  const expanded = expandTags(tags);
  for (const tag of expanded) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: expanded });
}
