"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Non authentifié.");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    throw new Error("Accès interdit.");
  }

  return supabase;
}

export async function toggleVoting(formData: FormData) {
  const supabase = await requireAdmin();

  const settingsId = formData.get("settings_id");
  const currentStatus =
    formData.get("current_status") === "true";

  if (typeof settingsId !== "string") {
    throw new Error("Configuration invalide.");
  }

  const { error } = await supabase
    .from("settings")
    .update({
      voting_open: !currentStatus,
    })
    .eq("id", settingsId);

  if (error) {
    console.error(
      "Erreur changement statut vote:",
      error
    );

    throw new Error(
      "Impossible de modifier le statut du vote."
    );
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");
}