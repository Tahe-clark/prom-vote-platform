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

export async function addCandidate(formData: FormData) {
  const supabase = await requireAdmin();

  const name = formData.get("name");
  const category = formData.get("category");
  const photoUrl = formData.get("photo_url");
  const description = formData.get("description");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    (category !== "roi" && category !== "reine")
  ) {
    throw new Error("Données candidat invalides.");
  }

  const { error } = await supabase
    .from("candidates")
    .insert({
      name: name.trim(),
      category,
      photo_url:
        typeof photoUrl === "string" && photoUrl.trim()
          ? photoUrl.trim()
          : null,
      description:
        typeof description === "string" &&
        description.trim()
          ? description.trim()
          : null,
    });

  if (error) {
    console.error(error);
    throw new Error(
      "Impossible d'ajouter le candidat."
    );
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");
}

export async function updateCandidate(formData: FormData) {
  const supabase = await requireAdmin();

  const candidateId = formData.get("candidate_id");
  const name = formData.get("name");
  const category = formData.get("category");
  const photoUrl = formData.get("photo_url");
  const description = formData.get("description");

  if (
    typeof candidateId !== "string" ||
    typeof name !== "string" ||
    !name.trim() ||
    (category !== "roi" && category !== "reine")
  ) {
    throw new Error("Données candidat invalides.");
  }

  const { error } = await supabase
    .from("candidates")
    .update({
      name: name.trim(),
      category,
      photo_url:
        typeof photoUrl === "string" && photoUrl.trim()
          ? photoUrl.trim()
          : null,
      description:
        typeof description === "string" &&
        description.trim()
          ? description.trim()
          : null,
    })
    .eq("id", candidateId);

  if (error) {
    console.error("Erreur modification candidat:", error);

    throw new Error(
      "Impossible de modifier le candidat."
    );
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");
}

export async function deleteCandidate(
  formData: FormData
) {
  const supabase = await requireAdmin();

  const candidateId =
    formData.get("candidate_id");

  if (typeof candidateId !== "string") {
    throw new Error("Candidat invalide.");
  }

  const { error } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidateId);

  if (error) {
    console.error(error);
    throw new Error(
      "Impossible de supprimer le candidat."
    );
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");
}