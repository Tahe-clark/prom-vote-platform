import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";

const VOTER_COOKIE = "prom_voter_token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const candidateId = body.candidateId;

    if (!candidateId || typeof candidateId !== "string") {
      return NextResponse.json(
        { error: "Candidat invalide." },
        { status: 400 }
      );
    }

    // 1. Vérifier que le candidat existe réellement.
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("id, category")
      .eq("id", candidateId)
      .single();

    if (candidateError || !candidate) {
      return NextResponse.json(
        { error: "Ce candidat n'existe pas." },
        { status: 404 }
      );
    }

    if (
      candidate.category !== "roi" &&
      candidate.category !== "reine"
    ) {
      return NextResponse.json(
        { error: "Catégorie de candidat invalide." },
        { status: 400 }
      );
    }

    // 2. Récupérer ou créer l'identifiant anonyme du navigateur.
    let voterToken =
      request.cookies.get(VOTER_COOKIE)?.value;

    const tokenWasCreated = !voterToken;

    if (!voterToken) {
      voterToken = randomUUID();
    }

    // 3. Vérifier si ce navigateur a déjà voté
    // dans cette catégorie.
    const { data: existingVote, error: existingVoteError } =
      await supabase
        .from("votes")
        .select("id")
        .eq("voter_token", voterToken)
        .eq("category", candidate.category)
        .maybeSingle();

    if (existingVoteError) {
      console.error(
        "Erreur vérification vote:",
        existingVoteError
      );

      return NextResponse.json(
        { error: "Impossible de vérifier votre vote." },
        { status: 500 }
      );
    }

    if (existingVote) {
      return NextResponse.json(
        {
          error: `Vous avez déjà voté pour la catégorie ${candidate.category}.`,
        },
        { status: 409 }
      );
    }

    // 4. Enregistrer le vote.
    const { error: voteError } = await supabase
      .from("votes")
      .insert({
        candidate_id: candidate.id,
        category: candidate.category,
        voter_token: voterToken,
      });

    if (voteError) {
      console.error("Erreur insertion vote:", voteError);

      if (voteError.code === "23505") {
        return NextResponse.json(
          {
            error: `Vous avez déjà voté pour la catégorie ${candidate.category}.`,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Impossible d'enregistrer le vote." },
        { status: 500 }
      );
    }

    // 5. Réponse.
    const response = NextResponse.json(
      {
        success: true,
        message: "Vote enregistré.",
      },
      { status: 201 }
    );

    // Cookie anonyme : aucun nom, email ou donnée personnelle.
    if (tokenWasCreated) {
      response.cookies.set({
        name: VOTER_COOKIE,
        value: voterToken,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error("Erreur API vote:", error);

    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}