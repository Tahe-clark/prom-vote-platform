import "server-only";

import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  dictionaries,
  isLocale,
  type Locale,
} from "@/lib/i18n/dictionaries";

/**
 * Langue choisie par le visiteur (cookie), sinon celle de son
 * navigateur, sinon le français.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;

  if (isLocale(saved)) {
    return saved;
  }

  const headerStore = await headers();
  const accepted = headerStore.get("accept-language") ?? "";
  const first = accepted.split(",")[0]?.trim().slice(0, 2).toLowerCase();

  return first === "en" ? "en" : DEFAULT_LOCALE;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
