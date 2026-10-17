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
          "rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
        variant === "ghost" &&
          "rounded-full border border-current bg-transparent text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
