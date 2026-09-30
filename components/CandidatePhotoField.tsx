"use client";

import { useId, useState } from "react";
import {
  ImagePlus,
  Link2,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { EDITS_LOCKED } from "@/lib/edit-lock";
import { useI18n } from "@/lib/i18n/client";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface CandidatePhotoFieldProps {
  /** Photo déjà enregistrée (formulaire de modification). */
  defaultUrl?: string | null;
  /** Appelé quand un envoi est tenté alors que l'admin est verrouillé. */
  onLocked?: () => void;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_SIZE = 50 * 1024 * 1024;

export default function CandidatePhotoField({
  defaultUrl,
  onLocked,
}: CandidatePhotoFieldProps) {
  const inputId = useId();
  const { t } = useI18n();
  const tp = t.admin.photo;

  const [photoUrl, setPhotoUrl] = useState(
    defaultUrl ?? ""
  );
  const [mode, setMode] = useState<"file" | "url">(
    "file"
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    // Admin verrouillé : rien n'est envoyé vers le stockage.
    if (EDITS_LOCKED) {
      event.target.value = "";
      onLocked?.();
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
tp.errorFormat
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setError(
tp.errorSize
      );
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `candidates/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("candidate-photos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

      if (uploadError) {
        console.error("Erreur upload:", uploadError);
        setError(
tp.errorUpload
        );
        return;
      }

      const { data } = supabase.storage
        .from("candidate-photos")
        .getPublicUrl(filePath);

      setPhotoUrl(data.publicUrl);
    } catch (uploadError) {
      console.error(uploadError);
      setError(
tp.errorNetwork
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex gap-4">
      {/* Valeur réellement envoyée au serveur */}
      <input type="hidden" name="photo_url" value={photoUrl} />

      {/* Aperçu au format de la carte publique (4:5) */}
      <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-lg bg-adm-bg ring-1 ring-adm-line sm:w-28">
        {photoUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={tp.preview}
              className="h-full w-full object-cover"
              onError={() =>
                setError(
tp.errorBroken
                )
              }
            />
            <button
              type="button"
              onClick={() => {
                setPhotoUrl("");
                setError("");
              }}
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-adm-wine/80 text-white outline-none hover:bg-adm-wine focus-visible:ring-2 focus-visible:ring-white"
              aria-label={tp.remove}
            >
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <div className="grid h-full place-items-center text-adm-muted/60">
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ImagePlus className="size-6" />
            )}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div
          role="tablist"
          aria-label={tp.source}
          className="inline-flex rounded-lg bg-adm-bg p-0.5 text-xs"
        >
          {(
            [
              ["file", tp.upload, Upload],
              ["url", tp.link, Link2],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-adm-accent/40",
                mode === value
                  ? "bg-white text-adm-ink shadow-sm"
                  : "text-adm-muted hover:text-adm-ink"
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>

        {mode === "file" ? (
          <label
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer flex-col items-start gap-0.5 rounded-lg border border-dashed border-adm-line px-3 py-3 text-sm transition-colors hover:border-adm-accent/60 hover:bg-adm-bg/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-adm-accent/40",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            <span className="font-medium text-adm-ink">
              {uploading
                ? tp.uploading
                : photoUrl
                  ? tp.replace
                  : tp.choose}
            </span>
            <span className="text-xs text-adm-muted">
              {tp.hint}
            </span>
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
        ) : (
          <div className="space-y-1.5">
            <input
              type="url"
              inputMode="url"
              placeholder="https://…"
              defaultValue={
                photoUrl.startsWith("http") ? photoUrl : ""
              }
              onChange={(event) => {
                setPhotoUrl(event.target.value.trim());
                setError("");
              }}
              className="h-10 w-full rounded-lg border border-adm-line bg-white px-3 text-sm text-adm-ink outline-none placeholder:text-adm-muted/60 focus-visible:border-adm-accent focus-visible:ring-3 focus-visible:ring-adm-accent/20"
              aria-label={tp.linkLabel}
            />
            <p className="text-xs text-adm-muted">
              {tp.linkHint}
            </p>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-800"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
