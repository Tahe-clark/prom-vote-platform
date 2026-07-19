"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error?: string;
};

export async function login(
  previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    return {
      error: "Email et mot de passe requis.",
    };
  }

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.user) {
    return {
      error: "Email ou mot de passe incorrect.",
    };
  }

  // Vérification supplémentaire :
  // l'utilisateur doit exister dans la table admins.
  const { data: admin, error: adminError } =
    await supabase
      .from("admins")
      .select("id, role")
      .eq("user_id", data.user.id)
      .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();

    return {
      error: "Vous n'êtes pas autorisé à accéder à l'administration.",
    };
  }

  redirect("/admin/dashboard");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/admin/login");
}