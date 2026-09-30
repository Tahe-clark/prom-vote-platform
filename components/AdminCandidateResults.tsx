import { Crown, UserRound } from "lucide-react";

import CandidateActions from "@/components/admin/CandidateActions";
import {
  dictionaries,
  fmt,
  isPlural,
  percent,
  type Locale,
} from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { AdminCandidate } from "@/types/admin";

interface AdminCandidateResultsProps {
  title: string;
  category: "roi" | "reine";
  /** Candidats déjà triés du plus voté au moins voté. */
  candidates: AdminCandidate[];
  categoryVotes: number;
  locale: Locale;
}

const tones = {
  roi: {
    text: "text-adm-roi",
    bar: "bg-adm-roi",
    soft: "bg-adm-roi/6",
  },
  reine: {
    text: "text-adm-reine",
    bar: "bg-adm-reine",
    soft: "bg-adm-reine/6",
  },
};

export default function AdminCandidateResults({
  title,
  category,
  candidates,
  categoryVotes,
  locale,
}: AdminCandidateResultsProps) {
  const t = dictionaries[locale].admin;
  const tone = tones[category];
  const topCount = candidates[0]?.votes?.length ?? 0;

  // Égalité en tête : on ne couronne personne.
  const leaderTied =
    candidates.length > 1 &&
    (candidates[1]?.votes?.length ?? 0) === topCount;

  return (
    <section
      aria-labelledby={`results-${category}`}
      className="rounded-2xl bg-white ring-1 ring-adm-line"
    >
      <header className="flex items-baseline justify-between gap-4 border-b border-adm-line px-5 py-4 sm:px-6">
        <h2
          id={`results-${category}`}
          className={cn(
            "font-elegant text-2xl font-semibold",
            tone.text
          )}
        >
          {title}
        </h2>
        <p className="nums shrink-0 text-sm text-adm-muted">
          {categoryVotes}{" "}
          {isPlural(locale, categoryVotes) ? t.voteOther : t.voteOne}
        </p>
      </header>

      {candidates.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-adm-muted">
            {t.emptyCategory}
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-adm-line">
          {candidates.map((candidate, index) => {
            const voteCount = candidate.votes?.length ?? 0;
            const share =
              categoryVotes > 0
                ? (voteCount / categoryVotes) * 100
                : 0;
            const isLeader =
              index === 0 && voteCount > 0 && !leaderTied;

            // Ex æquo : même rang pour le même nombre de votes.
            const rank =
              1 +
              candidates.filter(
                (other) => (other.votes?.length ?? 0) > voteCount
              ).length;

            return (
              <li
                key={candidate.id}
                className={cn(
                  "grid grid-cols-[1.5rem_2.5rem_1fr_auto] items-center gap-x-3 px-4 py-3 sm:grid-cols-[2rem_3.5rem_1fr_auto] sm:gap-x-4 sm:px-6",
                  isLeader && tone.soft
                )}
              >
                <span
                  className={cn(
                    "nums text-center font-elegant text-lg",
                    isLeader ? tone.text : "text-adm-muted"
                  )}
                  aria-label={fmt(t.rank, { n: rank })}
                >
                  {isLeader ? (
                    <Crown className="mx-auto size-5" aria-hidden />
                  ) : (
                    rank
                  )}
                </span>

                <div className="aspect-[4/5] w-10 overflow-hidden rounded-md bg-adm-bg sm:w-14">
                  {candidate.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={candidate.photo_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-adm-muted/50">
                      <UserRound className="size-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-medium text-adm-ink">
                    {candidate.name}
                  </p>

                  <div className="mt-1.5 flex items-center gap-3">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-adm-bg"
                      role="img"
                      aria-label={fmt(t.share, { p: percent(locale, share, 1) })}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none",
                          tone.bar,
                          !isLeader && "opacity-55"
                        )}
                        style={{ width: `${share}%` }}
                      />
                    </div>
                    <p className="nums flex shrink-0 items-baseline gap-2 text-sm">
                      <span className="font-semibold text-adm-ink">
                        {voteCount}
                      </span>
                      <span className="w-9 text-right text-xs text-adm-muted">
                        {percent(locale, share)}
                      </span>
                    </p>
                  </div>
                </div>

                <CandidateActions
                  candidate={candidate}
                  voteCount={voteCount}
                />
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
