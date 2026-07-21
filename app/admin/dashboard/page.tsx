import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  addCandidate,
} from "@/actions/candidates";

import { Input } from "@/components/ui/input";
import { toggleVoting } from "@/actions/settings";
import AdminCandidateResults from "@/components/AdminCandidateResults";
import CandidatePhotoField from "@/components/CandidatePhotoField";

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

  const kingCandidates =
    candidates?.filter(
        (candidate) => candidate.category === "roi"
    ) ?? [];

    const queenCandidates =
    candidates?.filter(
        (candidate) => candidate.category === "reine"
    ) ?? [];

    const kingVotes = kingCandidates.reduce(
    (total, candidate) =>
        total + (candidate.votes?.length ?? 0),
    0
    );

    const queenVotes = queenCandidates.reduce(
    (total, candidate) =>
        total + (candidate.votes?.length ?? 0),
    0
    );

    const totalVotes = kingVotes + queenVotes;

    const totalCandidates =
    kingCandidates.length + queenCandidates.length;

    const sortedKings = [...kingCandidates].sort(
    (a, b) =>
        (b.votes?.length ?? 0) -
        (a.votes?.length ?? 0)
    );

    const sortedQueens = [...queenCandidates].sort(
    (a, b) =>
        (b.votes?.length ?? 0) -
        (a.votes?.length ?? 0)
    );

  const { data: settings } = await supabase
  .from("settings")
  .select("id, voting_open, end_date")
  .limit(1)
  .maybeSingle();

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

       <section className="mb-10 space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
                Total des votes
            </p>

            <p className="mt-2 text-3xl font-bold">
                {totalVotes}
            </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
                Votes — Roi
            </p>

            <p className="mt-2 text-3xl font-bold">
                {kingVotes}
            </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
                Votes — Reine
            </p>

            <p className="mt-2 text-3xl font-bold">
                {queenVotes}
            </p>
            </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
                Total des candidats
            </p>

            <p className="mt-2 text-3xl font-bold">
                {totalCandidates}
            </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
                Candidats — Roi
            </p>

            <p className="mt-2 text-3xl font-bold">
                {kingCandidates.length}
            </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
                Candidates — Reine
            </p>

            <p className="mt-2 text-3xl font-bold">
                {queenCandidates.length}
            </p>
            </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm text-neutral-500">
                Statut de l&apos;élection
                </p>

                <p
                className={`mt-2 text-xl font-bold ${
                    settings?.voting_open
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                {settings?.voting_open
                    ? "Vote ouvert"
                    : "Vote fermé"}
                </p>
            </div>

            {settings && (
                <form action={toggleVoting}>
                <input
                    type="hidden"
                    name="settings_id"
                    value={settings.id}
                />

                <input
                    type="hidden"
                    name="current_status"
                    value={String(settings.voting_open)}
                />

                <Button
                    type="submit"
                    variant="outline"
                >
                    {settings.voting_open
                    ? "Fermer les votes"
                    : "Ouvrir les votes"}
                </Button>
                </form>
            )}
            </div>
        </div>
        </section>

        <section className="mb-10 rounded-xl border bg-white p-6">
        <h2 className="text-2xl font-bold">
            Ajouter un candidat
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
            Ajoutez un candidat à l&apos;élection.
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
            <label className="mb-3 block text-sm font-medium">
                Photo du candidat
            </label>

            <CandidatePhotoField />
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
          <div className="space-y-8">
  <AdminCandidateResults
    title="👑 Résultats — Roi"
    candidates={sortedKings}
    categoryVotes={kingVotes}
  />

  <AdminCandidateResults
    title="👑 Résultats — Reine"
    candidates={sortedQueens}
    categoryVotes={queenVotes}
  />
</div>
        </section>
      </div>
    </main>
  );
}