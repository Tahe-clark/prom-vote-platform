import CandidateCard from "@/components/CandidateCard";
import type { Candidate } from "@/types/candidate";

interface CandidateListProps {
  eyebrow: string;
  title: string;
  accent: string;
  candidates: Candidate[];
}

export default function CandidateList({
  eyebrow,
  title,
  accent,
  candidates,
}: CandidateListProps) {
  return (
    <section className="space-y-12">

      <div className="space-y-2 text-center">
        <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.4em] text-[#F2845C]">
          {eyebrow}
        </span>

        <h2 className="font-royal text-3xl font-normal text-[#D9C7B8] md:text-4xl">
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
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
          {candidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              index={index}
            />
          ))}
        </div>
      )}

    </section>
  );
}