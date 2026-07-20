import { Button } from "@/components/ui/button";
import {
  deleteCandidate,
  updateCandidate,
} from "@/actions/candidates";

type AdminCandidate = {
  id: string;
  name: string;
  category: string;
  photo_url: string | null;
  description: string | null;
  votes: {
    id: string;
  }[];
};

interface AdminCandidateResultsProps {
  title: string;
  candidates: AdminCandidate[];
  categoryVotes: number;
}

export default function AdminCandidateResults({
  title,
  candidates,
  categoryVotes,
}: AdminCandidateResultsProps) {
  return (
    <section className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Classement du plus voté au moins voté.
        </p>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate, index) => {
          const voteCount =
            candidate.votes?.length ?? 0;

          const percentage =
            categoryVotes > 0
              ? (
                  (voteCount / categoryVotes) *
                  100
                ).toFixed(1)
              : "0.0";

          return (
            <div
              key={candidate.id}
              className="rounded-xl border p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                    {candidate.photo_url ? (
                      <img
                        src={candidate.photo_url}
                        alt={candidate.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-neutral-400">
                        Photo
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-neutral-400">
                      #{index + 1}
                    </p>

                    <h3 className="font-semibold">
                      {candidate.name}
                    </h3>

                    <p className="text-sm uppercase text-neutral-500">
                      {candidate.category}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="min-w-24 text-right">
                    <p className="text-2xl font-bold">
                      {voteCount}
                    </p>

                    <p className="text-xs text-neutral-500">
                      vote{voteCount !== 1 ? "s" : ""} ·{" "}
                      {percentage} %
                    </p>
                  </div>

                  <details className="rounded-md border p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      Modifier
                    </summary>

                    <form
                      action={updateCandidate}
                      className="mt-4 min-w-64 space-y-3"
                    >
                      <input
                        type="hidden"
                        name="candidate_id"
                        value={candidate.id}
                      />

                      <input
                        name="name"
                        defaultValue={candidate.name}
                        required
                        className="h-9 w-full rounded-md border px-3 text-sm"
                      />

                      <select
                        name="category"
                        defaultValue={candidate.category}
                        className="h-9 w-full rounded-md border px-3 text-sm"
                      >
                        <option value="roi">
                          Roi
                        </option>

                        <option value="reine">
                          Reine
                        </option>
                      </select>

                      <input
                        name="photo_url"
                        type="url"
                        defaultValue={
                          candidate.photo_url ?? ""
                        }
                        placeholder="URL de la photo"
                        className="h-9 w-full rounded-md border px-3 text-sm"
                      />

                      <textarea
                        name="description"
                        defaultValue={
                          candidate.description ?? ""
                        }
                        rows={3}
                        className="w-full rounded-md border p-3 text-sm"
                      />

                      <Button
                        type="submit"
                        size="sm"
                      >
                        Enregistrer
                      </Button>
                    </form>
                  </details>

                  <form action={deleteCandidate}>
                    <input
                      type="hidden"
                      name="candidate_id"
                      value={candidate.id}
                    />

                    <Button
                      type="submit"
                      variant="outline"
                      className="text-red-600"
                    >
                      Supprimer
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}

        {candidates.length === 0 && (
          <p className="py-8 text-center text-neutral-500">
            Aucun candidat dans cette catégorie.
          </p>
        )}
      </div>
    </section>
  );
}