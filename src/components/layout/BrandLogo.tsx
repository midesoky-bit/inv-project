import Logo from "@/Images/logo";
import { Link } from "@/i18n/navigation";

type BrandLogoProps = {
  name: string;
  size?: "header" | "footer";
};

export function BrandLogo({ name, size = "header" }: BrandLogoProps) {
  const className = size === "header" ? "h-9 w-auto sm:h-11" : "h-14 w-auto";

  return (
    <Link href="/" aria-label={name} className="inline-flex shrink-0">
      <Logo className={className} />
    </Link>
  );
}
