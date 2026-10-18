import { getTranslations } from "next-intl/server";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
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
    logo: `${siteUrl}/images/logo-light.jpg`,
  };

  return <JsonLdScript id="organization-jsonld" json={JSON.stringify(schema)} />;
}
