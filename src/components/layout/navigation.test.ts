import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "@/components/layout/navigation";

describe("NAV_LINKS", () => {
  it("lists the seven reference routes", () => {
    expect(NAV_LINKS.map((item) => [item.href, item.messageKey])).toEqual([
      ["/", "home"],
      ["/about", "about"],
      ["/services", "services"],
      ["/work", "work"],
      ["/insights", "insights"],
      ["/careers", "careers"],
      ["/contact", "contact"],
    ]);
  });
});
