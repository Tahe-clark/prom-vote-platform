"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CandidatePhotoField() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Format non accepté. Utilisez JPG, PNG ou WebP."
      );
      event.target.value = "";
      return;
    }

    const maxSize = 50 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "L'image dépasse la taille maximale de 50 Mo."
      );
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const filePath =
        `candidates/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("candidate-photos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

      if (uploadError) {
        console.error(
          "Erreur upload:",
          uploadError
        );

        setError(
          "Impossible de téléverser l'image."
        );

        return;
      }

      const { data } = supabase.storage
        .from("candidate-photos")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      setPhotoUrl(publicUrl);
      setPreview(publicUrl);
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        "Une erreur est survenue pendant l'envoi de l'image."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleExternalUrl(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const url = event.target.value;

    setPhotoUrl(url);
    setPreview(url);
    setError("");
  }

  return (
    <div className="space-y-5">

      {/* Valeur réellement envoyée au serveur */}
      <input
        type="hidden"
        name="photo_url"
        value={photoUrl}
      />

      {/* OPTION 1 */}
      <div className="rounded-lg border p-4">
        <p className="font-medium">
          📁 Depuis votre appareil
        </p>

        <p className="mt-1 text-xs text-neutral-500">
          JPG, PNG ou WebP.
        </p>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileUpload}
          disabled={uploading}
          className="mt-3 block w-full text-sm"
        />

        {uploading && (
          <p className="mt-2 text-sm text-neutral-500">
            Téléversement en cours...
          </p>
        )}
      </div>

      <div className="text-center text-sm font-medium text-neutral-400">
        OU
      </div>

      {/* OPTION 2 */}
      <div className="rounded-lg border p-4">
        <label
          htmlFor="external_photo_url"
          className="font-medium"
        >
          🔗 URL externe
        </label>

        <input
          id="external_photo_url"
          type="url"
          placeholder="https://..."
          onChange={handleExternalUrl}
          className="mt-3 h-10 w-full rounded-md border px-3 text-sm"
        />

        <p className="mt-2 text-xs text-neutral-500">
          Vous pouvez par exemple téléverser
          l'image sur ImgBB puis coller son lien ici.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* PREVIEW */}
      {preview && (
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">
            Aperçu
          </p>

          <img
            src={preview}
            alt="Aperçu de la photo du candidat"
            className="h-48 w-40 rounded-lg object-cover"
            onError={() =>
              setError(
                "Impossible de charger cette image. Vérifiez le lien."
              )
            }
          />
        </div>
      )}
    </div>
  );
}