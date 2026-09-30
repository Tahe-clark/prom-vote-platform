import { redirect } from "next/navigation";

import DashboardView from "@/components/admin/DashboardView";
import { getLocale } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { AdminCandidate } from "@/types/admin";

function countVotes(candidates: AdminCandidate[]) {
  return candidates.reduce(
    (total, candidate) => total + (candidate.votes?.length ?? 0),
    0
  );
}

function byVotesDesc(a: AdminCandidate, b: AdminCandidate) {
  return (b.votes?.length ?? 0) - (a.votes?.length ?? 0);
}

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

  // Les deux requêtes sont indépendantes : on les lance en parallèle.
  const [{ data: candidates }, { data: settings }] =
    await Promise.all([
      supabase
        .from("candidates")
        .select(
          `
          id,
          name,
          category,
          photo_url,
          description,
          votes (
            id
          )
        `
        )
        .order("created_at", { ascending: true }),
      supabase
        .from("settings")
        .select("id, voting_open, end_date")
        .limit(1)
        .maybeSingle(),
    ]);

  const locale = await getLocale();

  const all = (candidates ?? []) as AdminCandidate[];

  const kings = all
    .filter((candidate) => candidate.category === "roi")
    .sort(byVotesDesc);

  const queens = all
    .filter((candidate) => candidate.category === "reine")
    .sort(byVotesDesc);

  return (
    <DashboardView
      email={user.email ?? ""}
      kings={kings}
      queens={queens}
      kingVotes={countVotes(kings)}
      queenVotes={countVotes(queens)}
      settings={settings}
      locale={locale}
    />
  );
}
