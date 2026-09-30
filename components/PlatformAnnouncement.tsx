import { Sparkles } from "lucide-react";

import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

interface PlatformAnnouncementProps {
  locale: Locale;
  /** "gala" : page de vote publique ; "admin" : fond bordeaux ; "light" : fond clair. */
  tone?: "gala" | "admin" | "light";
  className?: string;
}

export default function PlatformAnnouncement({
  locale,
  tone = "gala",
  className,
}: PlatformAnnouncementProps) {
  const t = dictionaries[locale].announcement;

  return (
    <aside
      className={cn(
        "flex gap-4 rounded-2xl border p-5",
        tone === "gala" &&
          "border-[#F2845C]/25 bg-[#261A1B]/70 text-[#D9C7B8] backdrop-blur-xl",
        tone === "admin" &&
          "border-white/10 bg-white/5 text-adm-cream",
        tone === "light" &&
          "border-adm-line bg-white text-adm-ink",
        className
      )}
    >
      <Sparkles
        aria-hidden
        className={cn(
          "mt-0.5 size-5 shrink-0",
          tone === "light" ? "text-adm-accent" : "text-[#F2845C]"
        )}
      />
      <div>
        <p
          className={cn(
            "font-elegant text-lg leading-snug",
            tone === "light" ? "text-adm-ink" : "text-white"
          )}
        >
          {t.title}
        </p>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed",
            tone === "light" ? "text-adm-muted" : "opacity-70"
          )}
        >
          {t.body}
        </p>
      </div>
    </aside>
  );
}
