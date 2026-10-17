import Logo from "@/Images/logo";
import { Link } from "@/i18n/navigation";

type BrandLogoProps = {
  name: string;
  size?: "header" | "footer";
};

/** Tight crop around the wordmark so it shares an edge with the footer copy. */
const FOOTER_LOGO_VIEWBOX = "92 250 2412 630";

export function BrandLogo({ name, size = "header" }: BrandLogoProps) {
  const className =
    size === "header"
      ? "h-12 w-[11.25rem] sm:h-14 sm:w-[13.15rem]"
      : "h-14 w-auto";

  return (
    <Link href="/" aria-label={name} className="inline-flex shrink-0">
      <Logo
        className={className}
        {...(size === "footer"
          ? { viewBox: FOOTER_LOGO_VIEWBOX, preserveAspectRatio: "xMinYMin meet" }
          : {})}
      />
    </Link>
  );
}
