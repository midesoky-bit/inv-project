import { SectionLink } from "@/components/layout/SectionLink";
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
    <SectionLink
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        variant === "primary" &&
          "gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
        variant === "ghost" &&
          "rounded-full border border-current bg-transparent text-foreground",
        className,
      )}
    >
      {children}
      {variant === "primary" ? (
        <svg
          viewBox="0 0 20 20"
          aria-hidden
          className="size-4 rtl:-scale-x-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </SectionLink>
  );
}
