import { describe, expect, it } from "vitest";
import { mapDirectusCareer, mapDirectusInsight } from "@/lib/cms/directus-map";

describe("listing mappers", () => {
  it("maps an insight translation", () => {
    expect(
      mapDirectusInsight({
        id: 4,
        slug: "note",
        published_at: "2026-10-17",
        translations: [{ title: "Note", summary: "Short" }],
      }),
    ).toEqual({
      id: "4",
      slug: "note",
      title: "Note",
      summary: "Short",
      publishedAt: "2026-10-17",
    });
  });

  it("maps a career translation", () => {
    expect(
      mapDirectusCareer({
        id: 2,
        translations: [{ title: "Advisor", summary: "Counsel", location: "Cairo" }],
      }),
    ).toEqual({
      id: "2",
      title: "Advisor",
      summary: "Counsel",
      location: "Cairo",
    });
  });
});
