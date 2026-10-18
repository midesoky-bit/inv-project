import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "@/components/layout/navigation";

describe("NAV_LINKS", () => {
  it("lists the public site routes", () => {
    expect(NAV_LINKS.map((item) => [item.href, item.messageKey])).toEqual([
      ["/", "home"],
      ["/about", "about"],
      ["/services", "services"],
      ["/team", "team"],
      ["/work", "work"],
      ["/news", "news"],
      ["/clients", "clients"],
      ["/partners", "partners"],
      ["/contact", "contact"],
    ]);
  });
});
