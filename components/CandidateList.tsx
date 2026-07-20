"use client";

import { useState } from "react";

import CandidateCard from "@/components/CandidateCard";

import type { Candidate } from "@/types/candidate";

interface CandidateListProps {
  eyebrow: string;
  title: string;
  accent: string;
  candidates: Candidate[];

  initialVotedCandidateId:
    | string
    | null;

  votingOpen: boolean;
}

export default function CandidateList({
  eyebrow,
  title,
  accent,
  candidates,
  initialVotedCandidateId,
  votingOpen,
}: CandidateListProps) {
  /*
   * Ce state contient l'ID du candidat
   * déjà choisi dans cette catégorie.
   *
   * Il est initialisé depuis Supabase
   * lors du chargement de /vote.
   */
  const [
    votedCandidateId,
    setVotedCandidateId,
  ] = useState<string | null>(
    initialVotedCandidateId
  );

  function handleVoteSuccess(
    candidateId: string
  ) {
    setVotedCandidateId(candidateId);
  }

  return (
    <section className="space-y-12">
      {/* Titre de catégorie */}
      <div className="space-y-2 text-center">
        <span
          className="
            font-ui
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.4em]
            text-[#F2845C]
          "
        >
          {eyebrow}
        </span>

        <h2
          className="
            font-royal
            text-3xl
            font-normal
            text-[#D9C7B8]
            md:text-4xl
          "
        >
          {title}{" "}
          <span className="italic text-[#F2845C]">
            {accent}
          </span>
        </h2>
      </div>

      {candidates.length === 0 ? (
        <p className="text-center text-sm text-[#D9C7B8]/50">
          Aucun candidat disponible pour le moment.
        </p>
      ) : (
        <div
          className="
            mx-auto
            grid
            max-w-4xl
            grid-cols-1
            gap-10
            md:grid-cols-2
          "
        >
          {candidates.map(
            (candidate, index) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                index={index}
                votedCandidateId={
                  votedCandidateId
                }
                votingOpen={votingOpen}
                onVoteSuccess={
                  handleVoteSuccess
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}