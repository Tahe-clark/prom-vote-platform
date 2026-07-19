import CandidateList from "@/components/CandidateList";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/candidate";

async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(
      "Erreur récupération candidats:",
      JSON.stringify(error, null, 2)
    );

    return [];
  }

  return (data ?? []) as Candidate[];
}

export default async function VotePage() {
  const candidates = await getCandidates();

  const kings = candidates.filter(
    (candidate) => candidate.category === "roi"
  );

  const queens = candidates.filter(
    (candidate) => candidate.category === "reine"
  );

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest">
            Bal de promotion
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Élection du Roi & de la Reine
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Découvrez les candidats et choisissez votre Roi et votre Reine du bal.
          </p>
        </header>

        <div className="space-y-16">
          <CandidateList
            title="👑 Candidats — Roi"
            candidates={kings}
          />

          <CandidateList
            title="👑 Candidates — Reine"
            candidates={queens}
          />
        </div>
      </div>
    </main>
  );
}