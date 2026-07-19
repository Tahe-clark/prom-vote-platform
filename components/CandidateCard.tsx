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
}

export default function CandidateCard({
  candidate,
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
        setMessage(result.error ?? "Une erreur est survenue.");
        return;
      }

      setMessage("Merci ! Votre vote a bien été enregistré.");
    } catch {
      setMessage("Impossible d'enregistrer le vote. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {candidate.photo_url ? (
        <img
          src={candidate.photo_url}
          alt={candidate.name}
          className="h-80 w-full object-cover"
        />
      ) : (
        <div className="flex h-80 items-center justify-center bg-neutral-100 text-neutral-500">
          Photo à venir
        </div>
      )}

      <div className="p-5">
        <h3 className="text-xl font-bold">{candidate.name}</h3>

        {candidate.description && (
          <p className="mt-2 text-sm text-neutral-600">
            {candidate.description}
          </p>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="mt-5 w-full rounded-md bg-black px-4 py-2 text-white">
            Voter pour {candidate.name}
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer votre vote</DialogTitle>

              <DialogDescription>
                Voulez-vous voter pour {candidate.name} dans la catégorie{" "}
                {candidate.category === "roi" ? "Roi" : "Reine"} ?
              </DialogDescription>
            </DialogHeader>

            {message && (
              <p className="text-sm font-medium">
                {message}
              </p>
            )}

            <DialogFooter>
              {!message.includes("bien été enregistré") && (
                <Button
                  onClick={handleVote}
                  disabled={loading}
                >
                  {loading ? "Enregistrement..." : "Confirmer mon vote"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}