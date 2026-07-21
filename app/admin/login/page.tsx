import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Déjà connecté ?
  if (user) {
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (admin) {
      redirect("/admin/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="text-4xl">
            👑
          </div>

          <h1 className="mt-3 text-2xl font-bold">
            Administration
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Connectez-vous pour gérer l&apos;élection.
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </main>
  );
}