import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function InsightsRedirect({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/news", locale });
}
