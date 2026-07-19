import CandidateCard from "@/components/CandidateCard";
import type { Candidate } from "@/types/candidate";

interface CandidateListProps {
  title: string;
  candidates: Candidate[];
}

export default function CandidateList({
  title,
  candidates,
}: CandidateListProps) {
  return (
    <section>
      <h2 className="mb-6 text-3xl font-bold">
        {title}
      </h2>

      {candidates.length === 0 ? (
        <p className="text-neutral-500">
          Aucun candidat disponible pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
            />
          ))}
        </div>
      )}
    </section>
  );
}