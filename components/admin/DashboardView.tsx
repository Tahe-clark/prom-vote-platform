import { Lock, LogOut } from "lucide-react";

import { logout } from "@/actions/auth";
import AdminCandidateResults from "@/components/AdminCandidateResults";
import AddCandidateForm from "@/components/admin/AddCandidateForm";
import VotingToggle from "@/components/admin/VotingToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { EDITS_LOCKED } from "@/lib/edit-lock";
import {
  dateLocale,
  dictionaries,
  fmt,
  type Locale,
} from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { AdminCandidate } from "@/types/admin";

export interface DashboardViewProps {
  email: string;
  kings: AdminCandidate[];
  queens: AdminCandidate[];
  kingVotes: number;
  queenVotes: number;
  settings: {
    id: string;
    voting_open: boolean;
    end_date: string | null;
  } | null;
  locale: Locale;
}

function formatEndDate(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(dateLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Abidjan",
  }).format(date);
}

export default function DashboardView({
  email,
  kings,
  queens,
  kingVotes,
  queenVotes,
  settings,
  locale,
}: DashboardViewProps) {
  const t = dictionaries[locale].admin;
  const lock = dictionaries[locale].lock;
  const votingOpen = settings?.voting_open ?? false;
  const totalVotes = kingVotes + queenVotes;
  const endDate = settings?.end_date
    ? formatEndDate(settings.end_date, locale)
    : null;

  const figures = [
    { value: totalVotes, label: t.figures.total },
    { value: queenVotes, label: t.figures.queen },
    { value: kingVotes, label: t.figures.king },
    {
      value: kings.length + queens.length,
      label: t.figures.candidates,
    },
  ];

  return (
    <div className="font-body min-h-screen bg-adm-bg text-adm-ink">
      {/* ---------- Bandeau : statut du scrutin ---------- */}
      <header className="relative overflow-hidden bg-adm-wine text-adm-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/3 h-80 w-[36rem] rounded-full bg-adm-coral/10 blur-[120px]"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
            <p className="font-elegant text-lg">
              Gala d&apos;Élégance{" "}
              <span className="text-adm-cream/50">{t.section}</span>
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher tone="dark" />
              <span className="hidden max-w-[16rem] truncate text-sm text-adm-cream/60 md:inline">
                {email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-adm-cream/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-adm-cream/40"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">{t.logout}</span>
                  <span className="sr-only sm:hidden">{t.logout}</span>
                </button>
              </form>
            </div>
          </nav>

          <div className="flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2.5 text-sm text-adm-cream/70">
                <span className="relative flex size-2.5">
                  {votingOpen && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex size-2.5 rounded-full",
                      votingOpen ? "bg-emerald-400" : "bg-adm-cream/40"
                    )}
                  />
                </span>
                {t.election}
                {EDITS_LOCKED && (
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-adm-cream">
                    <Lock className="size-3" aria-hidden />
                    {lock.badge}
                  </span>
                )}
              </p>

              <h1 className="mt-3 font-elegant text-4xl leading-tight text-white sm:text-5xl">
                {votingOpen ? t.open : t.closed}
              </h1>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-adm-cream/60">
                {votingOpen
                  ? endDate
                    ? fmt(t.closesAt, { date: endDate })
                    : t.openHint
                  : t.closedHint}
              </p>
            </div>

            {settings ? (
              <VotingToggle
                settingsId={settings.id}
                votingOpen={votingOpen}
              />
            ) : (
              <p className="max-w-xs rounded-lg bg-white/5 px-4 py-3 text-sm text-adm-cream/70">
                {t.noSettings}
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-t-xl bg-white/10 md:grid-cols-4">
            {figures.map((figure) => (
              <div
                key={figure.label}
                className="bg-adm-wine-2 px-5 py-4"
              >
                <dt className="text-xs text-adm-cream/60">
                  {figure.label}
                </dt>
                <dd className="nums mt-1 font-elegant text-3xl text-white">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ---------- Contenu ---------- */}
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-10">
        <div className="min-w-0 space-y-6">
          <AdminCandidateResults
            title={t.queenTitle}
            category="reine"
            candidates={queens}
            categoryVotes={queenVotes}
            locale={locale}
          />
          <AdminCandidateResults
            title={t.kingTitle}
            category="roi"
            candidates={kings}
            categoryVotes={kingVotes}
            locale={locale}
          />
        </div>

        <aside aria-labelledby="add-candidate" className="lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-2xl bg-white p-5 ring-1 ring-adm-line sm:p-6">
            <h2
              id="add-candidate"
              className="font-elegant text-xl font-semibold"
            >
              {t.add.title}
            </h2>
            <p className="mb-5 mt-1 text-sm text-adm-muted">
              {t.add.hint}
            </p>
            <AddCandidateForm />
          </section>
        </aside>
      </main>
    </div>
  );
}
