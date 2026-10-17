import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localePath } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";

type OrganizationJsonLdProps = {
  locale: Locale;
};

export async function OrganizationJsonLd({ locale }: OrganizationJsonLdProps) {
  const t = await getTranslations({ locale, namespace: "brand" });
  const siteUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("name"),
    url: `${siteUrl}${localePath(locale)}`,
    logo: `${siteUrl}/images/logo.jpg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
