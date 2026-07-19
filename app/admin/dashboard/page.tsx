import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  addCandidate,
  deleteCandidate,
} from "@/actions/candidates";

import { Input } from "@/components/ui/input";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { count: candidatesCount } = await supabase
    .from("candidates")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: votesCount } = await supabase
    .from("votes")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { data: candidates } = await supabase
    .from("candidates")
    .select(`
      id,
      name,
      category,
      photo_url,
      description,
      votes (
        id
      )
    `)
    .order("created_at", {
      ascending: true,
    });

  return (
    <main className="min-h-screen bg-neutral-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">

        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Prom Vote Platform
            </p>

            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Connecté : {user.email}
            </p>
          </div>

          <form action={logout}>
            <Button type="submit" variant="outline">
              Se déconnecter
            </Button>
          </form>
        </header>

        <section className="mb-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
              Candidats
            </p>

            <p className="mt-2 text-3xl font-bold">
              {candidatesCount ?? 0}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
              Votes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {votesCount ?? 0}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
              Statut
            </p>

            <p className="mt-2 text-xl font-bold text-green-600">
              Vote ouvert
            </p>
          </div>
        </section>

        <section className="mb-10 rounded-xl border bg-white p-6">
        <h2 className="text-2xl font-bold">
            Ajouter un candidat
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
            Ajoutez un candidat à l'élection.
        </p>

        <form
            action={addCandidate}
            className="mt-6 grid gap-4 md:grid-cols-2"
        >
            <div>
            <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
            >
                Nom
            </label>

            <Input
                id="name"
                name="name"
                required
            />
            </div>

            <div>
            <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
            >
                Catégorie
            </label>

            <select
                id="category"
                name="category"
                required
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
            >
                <option value="roi">
                Roi
                </option>

                <option value="reine">
                Reine
                </option>
            </select>
            </div>

            <div className="md:col-span-2">
            <label
                htmlFor="photo_url"
                className="mb-2 block text-sm font-medium"
            >
                URL de la photo
            </label>

            <Input
                id="photo_url"
                name="photo_url"
                type="url"
                placeholder="https://..."
            />
            </div>

            <div className="md:col-span-2">
            <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
            >
                Description
            </label>

            <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full rounded-md border p-3 text-sm"
            />
            </div>

            <div className="md:col-span-2">
            <Button type="submit">
                Ajouter le candidat
            </Button>
            </div>
        </form>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Candidats et résultats
              </h2>

              <p className="text-sm text-neutral-500">
                Classement actuel de l'élection.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {candidates?.map((candidate) => {
              const voteCount =
                candidate.votes?.length ?? 0;

              return (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {candidate.name}
                    </h3>

                    <span className="text-sm uppercase text-neutral-500">
                      {candidate.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                        <p className="text-2xl font-bold">
                        {voteCount}
                        </p>

                        <p className="text-xs text-neutral-500">
                        vote{voteCount !== 1 ? "s" : ""}
                        </p>
                    </div>

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
              );
            })}

            {!candidates?.length && (
              <p className="py-8 text-center text-neutral-500">
                Aucun candidat.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}