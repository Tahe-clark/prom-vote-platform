"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  deleteCandidate,
  updateCandidate,
} from "@/actions/candidates";
import CandidateFields from "@/components/admin/CandidateFields";
import LockedNotice from "@/components/admin/LockedNotice";
import SubmitButton from "@/components/admin/SubmitButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EDITS_LOCKED } from "@/lib/edit-lock";
import { useI18n } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/dictionaries";
import type { AdminCandidate } from "@/types/admin";

const iconButton =
  "grid size-9 place-items-center rounded-lg text-adm-muted outline-none transition-colors hover:bg-adm-bg hover:text-adm-ink focus-visible:ring-3 focus-visible:ring-adm-accent/30";

const cancelButton =
  "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-adm-ink outline-none hover:bg-adm-bg focus-visible:ring-3 focus-visible:ring-adm-accent/30";

type Feedback = "locked" | "error" | null;

interface CandidateActionsProps {
  candidate: AdminCandidate;
  voteCount: number;
}

export default function CandidateActions({
  candidate,
  voteCount,
}: CandidateActionsProps) {
  const { t } = useI18n();
  const te = t.admin.edit;
  const tr = t.admin.remove;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function run(
    action: (formData: FormData) => ReturnType<typeof updateCandidate>,
    formData: FormData,
    close: () => void
  ) {
    setFeedback(null);

    // Verrou : on bloque avant même de contacter le serveur.
    if (EDITS_LOCKED) {
      setFeedback("locked");
      return;
    }

    try {
      const result = await action(formData);

      if (!result.ok) {
        setFeedback(result.error === "locked" ? "locked" : "error");
        return;
      }

      close();
    } catch (error) {
      console.error(error);
      setFeedback("error");
    }
  }

  const deleteBody =
    voteCount === 0
      ? tr.bodyNone
      : voteCount === 1
        ? tr.bodyOne
        : fmt(tr.bodyOther, { n: voteCount });

  return (
    <div className="flex items-center gap-0.5">
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          setFeedback(null);
        }}
      >
        <DialogTrigger
          className={iconButton}
          aria-label={fmt(te.aria, { name: candidate.name })}
          title={te.action}
        >
          <Pencil className="size-4" />
        </DialogTrigger>

        <DialogContent className="font-body max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto bg-white p-0 text-adm-ink sm:max-w-lg">
          <div className="border-b border-adm-line px-6 py-5">
            <DialogTitle className="font-elegant text-xl font-semibold">
              {fmt(te.title, { name: candidate.name })}
            </DialogTitle>
            <DialogDescription className="mt-1 text-adm-muted">
              {te.hint}
            </DialogDescription>
          </div>

          <form
            action={(formData) =>
              run(updateCandidate, formData, () => setEditOpen(false))
            }
            className="px-6 py-5"
          >
            <input type="hidden" name="candidate_id" value={candidate.id} />
            <CandidateFields
              defaults={candidate}
              onLocked={() => setFeedback("locked")}
            />

            {feedback === "locked" && <LockedNotice className="mt-5" />}
            {feedback === "error" && (
              <p
                role="alert"
                className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                {te.error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <DialogClose className={cancelButton}>
                {t.admin.cancel}
              </DialogClose>
              <SubmitButton pendingLabel={te.pending}>{te.save}</SubmitButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          setFeedback(null);
        }}
      >
        <DialogTrigger
          className={`${iconButton} hover:bg-red-50 hover:text-[#b3261e]`}
          aria-label={fmt(tr.aria, { name: candidate.name })}
          title={tr.action}
        >
          <Trash2 className="size-4" />
        </DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="font-body gap-0 bg-white p-6 text-adm-ink sm:max-w-md"
        >
          <DialogTitle className="font-elegant text-xl font-semibold">
            {fmt(tr.title, { name: candidate.name })}
          </DialogTitle>
          <DialogDescription className="mt-2 leading-relaxed text-adm-muted">
            {deleteBody}
          </DialogDescription>

          <form
            action={(formData) =>
              run(deleteCandidate, formData, () => setDeleteOpen(false))
            }
            className="mt-6"
          >
            <input type="hidden" name="candidate_id" value={candidate.id} />

            {feedback === "locked" && <LockedNotice className="mb-4" />}
            {feedback === "error" && (
              <p
                role="alert"
                className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                {tr.error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <DialogClose className={cancelButton}>
                {t.admin.cancel}
              </DialogClose>
              <SubmitButton variant="danger" pendingLabel={tr.pending}>
                {tr.confirm}
              </SubmitButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
