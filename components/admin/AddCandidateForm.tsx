"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { addCandidate } from "@/actions/candidates";
import CandidateFields from "@/components/admin/CandidateFields";
import LockedNotice from "@/components/admin/LockedNotice";
import SubmitButton from "@/components/admin/SubmitButton";
import { EDITS_LOCKED } from "@/lib/edit-lock";
import { useI18n } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/dictionaries";

type Status =
  | { type: "success"; name: string }
  | { type: "error" }
  | { type: "locked" }
  | null;

export default function AddCandidateForm() {
  const { t } = useI18n();

  // Change de valeur après chaque ajout pour remettre
  // les champs (photo comprise) à zéro.
  const [formKey, setFormKey] = useState(0);
  const [status, setStatus] = useState<Status>(null);

  async function handleSubmit(formData: FormData) {
    setStatus(null);

    if (EDITS_LOCKED) {
      setStatus({ type: "locked" });
      return;
    }

    try {
      const result = await addCandidate(formData);

      if (!result.ok) {
        setStatus({
          type: result.error === "locked" ? "locked" : "error",
        });
        return;
      }

      setStatus({
        type: "success",
        name: String(formData.get("name") ?? "").trim(),
      });
      setFormKey((key) => key + 1);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error" });
    }
  }

  return (
    <form key={formKey} action={handleSubmit} className="space-y-5">
      <CandidateFields
        onLocked={() => setStatus({ type: "locked" })}
      />

      {status?.type === "locked" && <LockedNotice />}

      {status?.type === "error" && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {t.admin.add.error}
        </p>
      )}

      {status?.type === "success" && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-md bg-adm-open/10 px-3 py-2 text-sm text-adm-open"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {fmt(t.admin.add.success, { name: status.name })}
        </p>
      )}

      <SubmitButton pendingLabel={t.admin.add.pending} className="w-full">
        {t.admin.add.submit}
      </SubmitButton>
    </form>
  );
}
