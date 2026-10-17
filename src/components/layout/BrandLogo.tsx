import Image from "next/image";
import { Link } from "@/i18n/navigation";

type BrandLogoProps = {
  name: string;
  size?: "header" | "footer";
};

export function BrandLogo({ name, size = "header" }: BrandLogoProps) {
  const frame =
    size === "header"
      ? "h-10 w-[5.6rem] sm:h-12 sm:w-[6.7rem]"
      : "h-16 w-[9rem]";

  return (
    <Link href="/" className={`inline-flex shrink-0 bg-white ${frame}`}>
      <Image
        src="/images/logo.jpg"
        alt={name}
        width={1024}
        height={428}
        className="h-full w-full object-contain"
      />
    </Link>
  );
}
