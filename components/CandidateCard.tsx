"use client";

import { useState } from "react";

import type { Candidate } from "@/types/candidate";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CandidateCardProps {
  candidate: Candidate;
  index: number;

  votedCandidateId:
    | string
    | null;

  votingOpen: boolean;

  onVoteSuccess: (
    candidateId: string
  ) => void;
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
  votedCandidateId,
  votingOpen,
  onVoteSuccess,
}: CandidateCardProps) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /*
   * true si un vote existe déjà
   * dans cette catégorie.
   */
  const categoryAlreadyVoted =
    Boolean(votedCandidateId);

  /*
   * true si CETTE carte correspond
   * au candidat sélectionné.
   */
  const isSelected =
    votedCandidateId === candidate.id;

  /*
   * true si l'utilisateur a choisi
   * un AUTRE candidat de cette catégorie.
   */
  const isOtherCandidate =
    categoryAlreadyVoted &&
    !isSelected;

  async function handleVote() {
    if (
      categoryAlreadyVoted ||
      !votingOpen
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response =
        await fetch("/api/vote", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            candidateId:
              candidate.id,
          }),
        });

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ??
            "Une erreur est survenue."
        );

        return;
      }

      /*
       * Mise à jour immédiate de
       * toutes les cartes de la catégorie.
       */
      onVoteSuccess(candidate.id);

      setMessage(
        "✓ Vote enregistré"
      );

      /*
       * Petite attente pour que
       * l'utilisateur voie la confirmation.
       */
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 900);
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
      className={`
        group
        relative
        rounded-3xl
        border
        bg-[#261A1B]/40
        p-5
        backdrop-blur-xl
        transition-all
        duration-500

        ${
          isSelected
            ? `
              border-[#F2845C]
              bg-[#261A1B]/90
              shadow-[0_20px_60px_rgba(242,132,92,0.12)]
            `
            : `
              border-[#D9C7B8]/10
              hover:border-[#F2845C]/40
              hover:bg-[#261A1B]/70
              hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]
            `
        }

        ${
          isOtherCandidate
            ? "opacity-40"
            : "opacity-100"
        }
      `}
    >
      {/* PHOTO */}
      <div
        className="
          relative
          aspect-[4/5]
          overflow-hidden
          rounded-2xl
          bg-[#1A1213]
        "
      >
        {candidate.photo_url ? (
          <img
            src={candidate.photo_url}
            alt={candidate.name}
            className={`
              h-full
              w-full
              object-cover
              transition-all
              duration-700
              ease-out

              ${
                isSelected
                  ? "grayscale-0"
                  : "grayscale-[20%] group-hover:scale-105 group-hover:grayscale-0"
              }
            `}
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              text-sm
              text-[#D9C7B8]/30
            "
          >
            Photo à venir
          </div>
        )}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#261A1B]
            via-transparent
            to-transparent
            opacity-60
          "
        />

        {/* Numéro romain */}
        <span
          className="
            absolute
            left-4
            top-4
            rounded-full
            border
            border-white/5
            bg-[#1A1213]/60
            px-3
            py-1
            font-royal
            text-xs
            italic
            tracking-widest
            text-[#D9C7B8]/70
            backdrop-blur-md
          "
        >
          {romanNumeral(index)}
        </span>
      </div>

      {/* INFOS */}
      <div
        className="
          space-y-3
          px-2
          pb-2
          pt-6
          text-center
        "
      >
        <h3
          className="
            font-royal
            text-2xl
            font-medium
            tracking-wide
            text-[#D9C7B8]
            md:text-3xl
          "
        >
          {candidate.name}
        </h3>

        {candidate.description && (
          <p
            className="
              font-ui
              line-clamp-2
              px-4
              text-xs
              leading-relaxed
              text-[#D9C7B8]/60
            "
          >
            {candidate.description}
          </p>
        )}

        <div className="pt-3">
          {/* CAS 1 : candidat choisi */}
          {isSelected && (
            <div
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#F2845C]/40
                bg-[#F2845C]/10
                px-6
                py-3.5
                font-ui
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F2845C]
              "
            >
              <span>✓</span>

              <span>
                Vote enregistré
              </span>
            </div>
          )}

          {/* CAS 2 : autre candidat */}
          {isOtherCandidate && (
            <button
              type="button"
              disabled
              className="
                w-full
                cursor-not-allowed
                rounded-xl
                border
                border-white/5
                bg-transparent
                px-6
                py-3.5
                font-ui
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-[#D9C7B8]/30
              "
            >
              Vote déjà effectué
            </button>
          )}

          {/* CAS 3 : catégorie encore disponible */}
          {!categoryAlreadyVoted && (
            <Dialog
              open={open}
              onOpenChange={(
                isOpen
              ) => {
                setOpen(isOpen);

                if (!isOpen) {
                  setMessage("");
                }
              }}
            >
              <DialogTrigger
                disabled={
                  !votingOpen
                }
                className={`
                  w-full
                  rounded-xl
                  border
                  px-6
                  py-3.5
                  font-ui
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  transition-all
                  duration-300

                  ${
                    votingOpen
                      ? `
                        border-[#BF6E50]/40
                        bg-transparent
                        text-[#D9C7B8]
                        hover:border-transparent
                        hover:bg-gradient-to-r
                        hover:from-[#BF6E50]
                        hover:to-[#F2845C]
                        hover:text-[#1A1213]
                        hover:shadow-[0_0_25px_rgba(242,132,92,0.3)]
                      `
                      : `
                        cursor-not-allowed
                        border-white/5
                        bg-transparent
                        text-[#D9C7B8]/30
                      `
                  }
                `}
              >
                {votingOpen
                  ? "Offrir mon vote"
                  : "Votes fermés"}
              </DialogTrigger>

              <DialogContent
                className="
                  w-[calc(100%-2rem)]
                  max-w-md
                  rounded-3xl
                  border
                  border-[#BF6E50]/30
                  bg-[#261A1B]
                  p-6
                  text-[#D9C7B8]
                  shadow-[0_25px_70px_rgba(0,0,0,0.8)]
                  sm:p-8
                "
              >
                {/* Photo */}
                {candidate.photo_url && (
                  <div
                    className="
                      mx-auto
                      h-24
                      w-24
                      overflow-hidden
                      rounded-full
                      border-2
                      border-[#F2845C]
                      shadow-lg
                    "
                  >
                    <img
                      src={
                        candidate.photo_url
                      }
                      alt={
                        candidate.name
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </div>
                )}

                {/* Texte */}
                <div
                  className="
                    mt-6
                    space-y-3
                    text-center
                  "
                >
                  <p
                    className="
                      font-ui
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.3em]
                      text-[#F2845C]
                    "
                  >
                    Confirmation de vote
                  </p>

                  <h3
                    className="
                      font-royal
                      text-3xl
                      text-[#D9C7B8]
                    "
                  >
                    {candidate.name}
                  </h3>

                  <p
                    className="
                      font-ui
                      text-xs
                      leading-relaxed
                      text-[#D9C7B8]/60
                    "
                  >
                    Confirmez-vous
                    l&apos;attribution de
                    votre unique suffrage
                    dans cette catégorie ?
                  </p>
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`
                      mt-6
                      rounded-xl
                      border
                      px-4
                      py-4
                      text-center
                      text-sm
                      font-medium

                      ${
                        message.includes(
                          "✓"
                        )
                          ? `
                            border-[#F2845C]/40
                            bg-[#F2845C]/10
                            text-[#F2845C]
                          `
                          : `
                            border-red-500/30
                            bg-red-500/10
                            text-red-300
                          `
                      }
                    `}
                  >
                    {message}
                  </div>
                )}

                {/* Actions */}
                {!message.includes(
                  "✓"
                ) && (
                  <div
                    className="
                      mt-8
                      grid
                      grid-cols-1
                      gap-3
                      sm:grid-cols-2
                      sm:gap-4
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-transparent
                        py-3
                        font-ui
                        text-[10px]
                        uppercase
                        tracking-widest
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
                      onClick={
                        handleVote
                      }
                      disabled={
                        loading
                      }
                      className="
                        rounded-xl
                        bg-gradient-to-r
                        from-[#BF6E50]
                        to-[#F2845C]
                        py-3
                        font-ui
                        text-[10px]
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
                      {loading
                        ? "Enregistrement..."
                        : "Confirmer"}
                    </button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </article>
  );
}