import { cookies } from "next/headers";

import CandidateList from "@/components/CandidateList";
import CookieNotice from "@/components/CookieNotice";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PlatformAnnouncement from "@/components/PlatformAnnouncement";
import { getDictionary } from "@/lib/i18n/server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase/admin";

import type { Candidate } from "@/types/candidate";

type VotingSettings = {
  voting_open: boolean;
};

type ExistingVotes = {
  roi: string | null;
  reine: string | null;
};

async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Erreur récupération candidats:",
      JSON.stringify(error, null, 2)
    );

    return [];
  }

  return (data ?? []) as Candidate[];
}

async function getVotingSettings(): Promise<VotingSettings | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("voting_open")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Erreur récupération configuration:",
      JSON.stringify(error, null, 2)
    );

    return null;
  }

  return data;
}

async function getExistingVotes(): Promise<ExistingVotes> {
  const result: ExistingVotes = {
    roi: null,
    reine: null,
  };

  const cookieStore = await cookies();

  const voterToken =
    cookieStore.get("prom_voter_token")?.value;

  if (!voterToken) {
    return result;
  }

  const { data, error } = await supabaseAdmin
  .from("votes")
    .select("candidate_id, category")
    .eq("voter_token", voterToken);

  if (error) {
    console.error(
      "Erreur récupération votes existants:",
      JSON.stringify(error, null, 2)
    );

    return result;
  }

  for (const vote of data ?? []) {
  if (vote.category === "roi") {
    result.roi = vote.candidate_id;
  }

  if (vote.category === "reine") {
    result.reine = vote.candidate_id;
  }
}

  return result;
}

export default async function VotePage() {
  const [
    candidates,
    settings,
    existingVotes,
    { locale, t: dict },
  ] = await Promise.all([
    getCandidates(),
    getVotingSettings(),
    getExistingVotes(),
    getDictionary(),
  ]);

  const t = dict.vote;

  const queens = candidates.filter(
    (candidate) =>
      candidate.category === "reine"
  );

  const kings = candidates.filter(
    (candidate) =>
      candidate.category === "roi"
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#1A1213] text-[#D9C7B8]">
      {/* Fond atmosphérique */}
      <div
        className="
          pointer-events-none
          fixed
          left-1/2
          top-0
          h-[400px]
          w-[min(800px,100vw)]
          -translate-x-1/2
          rounded-full
          bg-gradient-to-b
          from-[#F2845C]/15
          to-transparent
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          right-0
          h-[500px]
          w-[min(500px,100vw)]
          rounded-full
          bg-[#BF6E50]/10
          blur-[160px]
        "
      />

      {/* Langue */}
      <div className="relative z-20 mx-auto flex max-w-6xl justify-end px-5 pt-5 sm:px-6">
        <LanguageSwitcher tone="dark" />
      </div>

      {/* Header */}
      <header
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-5
          pb-12
          pt-6
          text-center
          sm:px-6
          sm:pt-10
        "
      >
        <div
          className="
            mb-8
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-[#BF6E50]/30
            bg-[#261A1B]/50
            px-4
            py-1.5
            backdrop-blur-md
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              animate-pulse
              rounded-full
              bg-[#F2845C]
            "
          />

          <span
            className="
              font-ui
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#D9C7B8]/80
            "
          >
            {t.badge}
          </span>
        </div>

        <h1
          className="
            font-royal
            text-5xl
            font-normal
            tracking-tight
            text-[#D9C7B8]
            md:text-7xl
            lg:text-8xl
          "
        >
          {t.titleBefore}
          <span
            className="
              bg-gradient-to-r
              from-[#F2845C]
              via-[#D9C7B8]
              to-[#BF6E50]
              bg-clip-text
              font-royal
              italic
              text-transparent
            "
          >
            {t.titleAccent}
          </span>
          {t.titleAfter}
        </h1>

        <p
          className="
            font-ui
            mx-auto
            mt-6
            max-w-lg
            text-xs
            uppercase
            leading-relaxed
            tracking-[0.15em]
            text-[#D9C7B8]/60
            md:text-sm
          "
        >
          {t.subtitle}
        </p>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-24
            bg-gradient-to-r
            from-transparent
            via-[#BF6E50]/50
            to-transparent
          "
        />
      </header>

      {/* Vote fermé */}
      {!settings?.voting_open && (
        <div
          className="
            relative
            z-10
            mx-auto
            mb-12
            max-w-3xl
            px-5
            sm:px-6
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-[#F2845C]/30
              bg-[#261A1B]/70
              p-5
              text-center
              backdrop-blur-xl
            "
          >
            <h2 className="font-royal text-xl text-[#F2845C]">
              {t.closedTitle}
            </h2>

            <p className="mt-2 text-sm text-[#D9C7B8]/60">
              {t.closedBody}
            </p>
          </div>
        </div>
      )}

      {/* Annonce : future plateforme de vote */}
      <div className="relative z-10 mx-auto mb-16 max-w-3xl px-5 sm:px-6">
        <PlatformAnnouncement locale={locale} tone="gala" />
      </div>

      {/* Candidats */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          space-y-28
          px-5
          pb-28
          sm:px-6
        "
      >
        <CandidateList
          eyebrow={t.queenEyebrow}
          title={t.queenTitle}
          accent={t.queenAccent}
          candidates={queens}
          initialVotedCandidateId={
            existingVotes.reine
          }
          votingOpen={
            settings?.voting_open ?? false
          }
        />

        <CandidateList
          eyebrow={t.kingEyebrow}
          title={t.kingTitle}
          accent={t.kingAccent}
          candidates={kings}
          initialVotedCandidateId={
            existingVotes.roi
          }
          votingOpen={
            settings?.voting_open ?? false
          }
        />
      </div>

      <footer
        className="
          relative
          z-10
          border-t
          border-white/5
          px-5
          py-10
          text-center
          text-[10px]
          uppercase
          tracking-[0.3em]
          text-[#D9C7B8]/30
        "
      >
        {t.footer}
      </footer>

      <CookieNotice />
    </main>
  );
}