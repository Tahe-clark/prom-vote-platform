"use client";

import { useState } from "react";
import type { Candidate } from "@/types/candidate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

function romanNumeral(index: number) {
  const romans = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];

  return romans[index] ?? `${index + 1}`;
}

export default function CandidateCard({
  candidate,
  index,
}: CandidateCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleVote() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId: candidate.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error ?? "Une erreur est survenue."
        );
        return;
      }

      setMessage("✓ Vote enregistré");
    } catch {
      setMessage(
        "Impossible d'enregistrer le vote. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className="
  group relative
  rounded-3xl
  border border-[#D9C7B8]/10
  bg-[#261A1B]/40
  p-5
  backdrop-blur-xl
  transition-all
  duration-500
  hover:border-[#F2845C]/40
  hover:bg-[#261A1B]/70
  hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]
"
    >

      {/* Photo */}
      <div className="
  h-full w-full
  object-cover
  grayscale-[20%]
  transition-all
  duration-700
  ease-out
  group-hover:scale-105
  group-hover:grayscale-0
">

        {candidate.photo_url ? (
          <img
            src={candidate.photo_url}
            alt={candidate.name}
            className="
              h-full w-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#D9C7B8]/30">
            Photo à venir
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#261A1B] via-transparent to-transparent opacity-60" />

        <span className="
          absolute left-4 top-4
          rounded-full border border-white/5
          bg-[#1A1213]/60
          px-3 py-1
          font-royal text-xs italic tracking-widest
          text-[#D9C7B8]/70
          backdrop-blur-md
        ">
          {romanNumeral(index)}
        </span>

      </div>

      {/* Infos */}
      <div className="space-y-3 px-2 pb-2 pt-6 text-center">

        <h3 className="font-royal text-2xl font-medium tracking-wide text-[#D9C7B8] md:text-3xl">
          {candidate.name}
        </h3>

        {candidate.description && (
          <p className="font-ui line-clamp-2 px-4 text-xs leading-relaxed text-[#D9C7B8]/60">
            {candidate.description}
          </p>
        )}

        <div className="pt-3">

          <Dialog
            open={open}
            onOpenChange={setOpen}
          >

            <DialogTrigger
              className="
  w-full
  rounded-xl
  border border-[#BF6E50]/40
  bg-transparent
  px-6
  py-3.5
  font-ui
  text-[10px]
  font-semibold
  uppercase
  tracking-[0.25em]
  text-[#D9C7B8]
  transition-all
  duration-300
  hover:border-transparent
  hover:bg-gradient-to-r
  hover:from-[#BF6E50]
  hover:to-[#F2845C]
  hover:text-[#1A1213]
  hover:shadow-[0_0_25px_rgba(242,132,92,0.3)]
"
            >
              Offrir mon vote
            </DialogTrigger>

            <DialogContent
  className="
    max-w-md
    rounded-3xl
    border border-[#BF6E50]/30
    bg-[#261A1B]
    p-8
    text-[#D9C7B8]
    shadow-[0_25px_70px_rgba(0,0,0,0.8)]
  "
>
  {/* Fermer : le X reste géré par DialogContent */}

  {candidate.photo_url && (
    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-[#F2845C] shadow-lg">
      <img
        src={candidate.photo_url}
        alt={candidate.name}
        className="h-full w-full object-cover"
      />
    </div>
  )}

  <div className="mt-6 space-y-3 text-center">
    <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F2845C]">
      Confirmation de vote
    </p>

    <h3 className="font-royal text-3xl text-[#D9C7B8]">
      {candidate.name}
    </h3>

    <p className="font-ui text-xs leading-relaxed text-[#D9C7B8]/60">
      Confirmez-vous l&apos;attribution de votre unique suffrage dans cette catégorie ?
    </p>
  </div>

  {message && (
    <div
      className={`
        mt-6 rounded-xl border px-4 py-4 text-center text-sm font-medium
        ${
          message.includes("✓")
            ? "border-[#F2845C]/40 bg-[#F2845C]/10 text-[#F2845C]"
            : "border-red-500/30 bg-red-500/10 text-red-300"
        }
      `}
    >
      {message}
    </div>
  )}

  {!message.includes("✓") && (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="
          rounded-xl
          border border-white/10
          bg-transparent
          py-3
          font-ui text-[10px]
          uppercase tracking-widest
          text-[#D9C7B8]/60
          transition-all
          hover:bg-white/5
          hover:text-[#D9C7B8]
        "
      >
        Annuler
      </button>

      <button
        type="button"
        onClick={handleVote}
        disabled={loading}
        className="
          rounded-xl
          bg-gradient-to-r
          from-[#BF6E50]
          to-[#F2845C]
          py-3
          font-ui text-[10px]
          font-extrabold
          uppercase
          tracking-widest
          text-[#1A1213]
          shadow-lg
          transition-all
          hover:shadow-[#F2845C]/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? "Enregistrement..." : "Confirmer"}
      </button>
    </div>
  )}
</DialogContent>

          </Dialog>

        </div>

      </div>

    </article>
  );
}