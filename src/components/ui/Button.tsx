import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        variant === "primary" &&
          "bg-brand text-brand-foreground hover:bg-brand/90",
        variant === "ghost" &&
          "bg-transparent text-foreground underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
