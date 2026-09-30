"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { setLocale } from "@/actions/locale";
import { useI18n } from "@/lib/i18n/client";
import { LOCALES, type Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** "dark" sur fond bordeaux, "light" sur fond clair. */
  tone?: "dark" | "light";
  className?: string;
}

export default function LanguageSwitcher({
  tone = "dark",
  className,
}: LanguageSwitcherProps) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;

    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={t.lang.label}
      className={cn(
        "inline-flex rounded-full p-0.5 text-xs font-medium transition-opacity",
        tone === "dark"
          ? "bg-white/8 ring-1 ring-white/10"
          : "bg-adm-ink/5 ring-1 ring-adm-line",
        pending && "opacity-60",
        className
      )}
    >
      {LOCALES.map((option) => {
        const active = option === locale;

        return (
          <button
            key={option}
            type="button"
            lang={option}
            aria-pressed={active}
            aria-label={t.lang[option]}
            title={t.lang[option]}
            onClick={() => choose(option)}
            className={cn(
              "min-w-9 rounded-full px-2.5 py-1 uppercase outline-none transition-colors focus-visible:ring-2",
              tone === "dark"
                ? active
                  ? "bg-adm-cream text-adm-wine"
                  : "text-adm-cream/70 hover:text-white focus-visible:ring-adm-cream/50"
                : active
                  ? "bg-adm-wine text-white"
                  : "text-adm-muted hover:text-adm-ink focus-visible:ring-adm-accent/40"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
