import Logo from "@/Images/logo";
import { Link } from "@/i18n/navigation";

type BrandLogoProps = {
  name: string;
  size?: "header" | "footer";
};

export function BrandLogo({ name, size = "header" }: BrandLogoProps) {
  const className =
    size === "header"
      ? "h-12 w-[11.25rem] sm:h-14 sm:w-[13.15rem]"
      : "h-14 w-[13.15rem]";

  return (
    <Link href="/" aria-label={name} className="inline-flex shrink-0">
      <Logo className={className} />
    </Link>
  );
}
