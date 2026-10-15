import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-inv-navy">{t("notFoundTitle")}</h1>
      <p className="mt-4 text-inv-slate">{t("notFoundBody")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex justify-center text-sm font-medium text-inv-accent hover:underline"
      >
        Inventure Communications
      </Link>
    </div>
  );
}
