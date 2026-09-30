"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { EDITS_LOCKED } from "@/lib/edit-lock";
import type { AdminActionResult } from "@/actions/result";

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

export async function addCandidate(formData: FormData): Promise<AdminActionResult> {
  if (EDITS_LOCKED) {
    return { ok: false, error: "locked" };
  }

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
    return { ok: false, error: "invalid" };
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
    return { ok: false, error: "failed" };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");

  return { ok: true };
}

export async function updateCandidate(formData: FormData): Promise<AdminActionResult> {
  if (EDITS_LOCKED) {
    return { ok: false, error: "locked" };
  }

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
    return { ok: false, error: "invalid" };
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

    return { ok: false, error: "failed" };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");

  return { ok: true };
}

export async function deleteCandidate(
  formData: FormData
): Promise<AdminActionResult> {
  if (EDITS_LOCKED) {
    return { ok: false, error: "locked" };
  }

  const supabase = await requireAdmin();

  const candidateId =
    formData.get("candidate_id");

  if (typeof candidateId !== "string") {
    return { ok: false, error: "invalid" };
  }

  const { error } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidateId);

  if (error) {
    console.error(error);
    return { ok: false, error: "failed" };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");

  return { ok: true };
}