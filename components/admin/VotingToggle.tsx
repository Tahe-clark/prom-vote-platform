"use client";

import { useState } from "react";
import { Lock, LockOpen } from "lucide-react";

import { toggleVoting } from "@/actions/settings";
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

interface VotingToggleProps {
  settingsId: string;
  votingOpen: boolean;
}

export default function VotingToggle({
  settingsId,
  votingOpen,
}: VotingToggleProps) {
  const { t } = useI18n();
  const tt = t.admin.toggle;

  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<"locked" | "error" | null>(
    null
  );

  async function handleToggle(formData: FormData) {
    setFeedback(null);

    if (EDITS_LOCKED) {
      setFeedback("locked");
      return;
    }

    try {
      const result = await toggleVoting(formData);

      if (!result.ok) {
        setFeedback(result.error === "locked" ? "locked" : "error");
        return;
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
      setFeedback("error");
    }
  }

  const Icon = votingOpen ? Lock : LockOpen;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setFeedback(null);
      }}
    >
      <DialogTrigger className="inline-flex h-11 items-center gap-2 rounded-lg bg-adm-cream px-5 text-sm font-medium text-adm-wine outline-none transition-colors hover:bg-white focus-visible:ring-4 focus-visible:ring-adm-cream/40">
        <Icon className="size-4" />
        {votingOpen ? tt.close : tt.open}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="font-body gap-0 bg-white p-6 text-adm-ink sm:max-w-md"
      >
        <DialogTitle className="font-elegant text-xl font-semibold">
          {votingOpen ? tt.closeTitle : tt.openTitle}
        </DialogTitle>
        <DialogDescription className="mt-2 leading-relaxed text-adm-muted">
          {votingOpen ? tt.closeBody : tt.openBody}
        </DialogDescription>

        <form action={handleToggle} className="mt-6">
          <input type="hidden" name="settings_id" value={settingsId} />
          <input
            type="hidden"
            name="current_status"
            value={String(votingOpen)}
          />

          {feedback === "locked" && <LockedNotice className="mb-4" />}
          {feedback === "error" && (
            <p
              role="alert"
              className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              {tt.error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium outline-none hover:bg-adm-bg focus-visible:ring-3 focus-visible:ring-adm-accent/30">
              {t.admin.cancel}
            </DialogClose>
            <SubmitButton
              variant={votingOpen ? "danger" : "primary"}
              pendingLabel={votingOpen ? tt.closing : tt.opening}
            >
              {votingOpen ? tt.close : tt.open}
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
