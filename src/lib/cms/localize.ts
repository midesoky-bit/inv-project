import type { Locale } from "@/i18n/routing";
import type {
  EsgCommitment,
  EsgCommitmentRecord,
  LocalizedString,
  Service,
  ServiceRecord,
} from "@/types/cms";

export function pickLocalized(value: LocalizedString, locale: Locale): string {
  const localized = value[locale]?.trim();
  if (localized) return localized;
  return value.en;
}

export function toService(record: ServiceRecord, locale: Locale): Service {
  return {
    id: record.id,
    slug: record.slug,
    order: record.order,
    icon: record.icon,
    title: pickLocalized(record.title, locale),
    summary: pickLocalized(record.summary, locale),
    description: pickLocalized(record.description, locale),
    highlights:
      record.highlights[locale]?.length > 0
        ? record.highlights[locale]
        : record.highlights.en,
  };
}

export function toEsgCommitment(
  record: EsgCommitmentRecord,
  locale: Locale,
): EsgCommitment {
  return {
    id: record.id,
    order: record.order,
    title: pickLocalized(record.title, locale),
    summary: pickLocalized(record.summary, locale),
  };
}
