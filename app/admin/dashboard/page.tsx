import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pas connecté
  if (!user) {
    redirect("/admin/login");
  }

  // Connecté, mais est-il réellement admin ?
  const { data: admin } = await supabase
    .from("admins")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();

    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex items-center justify-between">
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
            <Button
              type="submit"
              variant="outline"
            >
              Se déconnecter
            </Button>
          </form>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
              Candidats
            </p>

            <p className="mt-2 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
              Votes
            </p>

            <p className="mt-2 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-neutral-500">
              Statut
            </p>

            <p className="mt-2 text-xl font-bold">
              Vote ouvert
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}