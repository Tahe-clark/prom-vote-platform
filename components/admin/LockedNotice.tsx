"use client";

import { Lock } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export default function LockedNotice({
  className,
}: {
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border border-adm-wine/15 bg-adm-wine/5 px-4 py-3 text-sm animate-in fade-in-0 slide-in-from-bottom-1 duration-200",
        className
      )}
    >
      <Lock className="mt-0.5 size-4 shrink-0 text-adm-wine" aria-hidden />
      <div>
        <p className="font-medium text-adm-wine">{t.lock.title}</p>
        <p className="mt-0.5 leading-relaxed text-adm-muted">
          {t.lock.body}
        </p>
      </div>
    </div>
  );
}
