"use client";

import { useSyncExternalStore } from "react";

import { useI18n } from "@/lib/i18n/client";

const STORAGE_KEY = "prom_cookie_notice_seen";

const CHANGE_EVENT = "prom-cookie-notice-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function readSeen() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export default function CookieNotice() {
  const { t } = useI18n();

  // Côté serveur on considère la notice « vue » (rien n'est rendu),
  // puis le navigateur lit localStorage après l'hydratation :
  // plus de différence serveur / client.
  const seen = useSyncExternalStore(subscribe, readSeen, () => true);
  const visible = !seen;

  function handleDismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Stockage indisponible : on masque quand même pour cette page.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      className="
        fixed
        bottom-4
        left-1/2
        z-[100]
        w-[calc(100%-2rem)]
        max-w-xl
        -translate-x-1/2
        rounded-2xl
        border
        border-[#BF6E50]/30
        bg-[#261A1B]/95
        p-4
        shadow-[0_20px_60px_rgba(0,0,0,0.65)]
        backdrop-blur-xl
        sm:p-5
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              font-ui
              text-xs
              font-semibold
              uppercase
              tracking-[0.15em]
              text-[#F2845C]
            "
          >
            {t.vote.cookie.title}
          </p>

          <p
            className="
              mt-2
              max-w-md
              font-ui
              text-xs
              leading-relaxed
              text-[#D9C7B8]/60
            "
          >
            {t.vote.cookie.body}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="
            shrink-0
            rounded-xl
            border
            border-[#BF6E50]/40
            px-5
            py-2.5
            font-ui
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#D9C7B8]
            transition-all
            hover:border-transparent
            hover:bg-gradient-to-r
            hover:from-[#BF6E50]
            hover:to-[#F2845C]
            hover:text-[#1A1213]
          "
        >
          {t.vote.cookie.ok}
        </button>
      </div>
    </div>
  );
}