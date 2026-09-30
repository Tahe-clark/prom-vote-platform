"use client";

import { useId } from "react";
import { Crown } from "lucide-react";

import CandidatePhotoField from "@/components/CandidatePhotoField";
import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface CandidateFieldsProps {
  defaults?: {
    name?: string;
    category?: string;
    photo_url?: string | null;
    description?: string | null;
  };
  onLocked?: () => void;
}

export const fieldClass =
  "w-full rounded-lg border border-adm-line bg-white px-3 text-sm text-adm-ink outline-none transition-colors placeholder:text-adm-muted/60 focus-visible:border-adm-accent focus-visible:ring-3 focus-visible:ring-adm-accent/20";

export const labelClass =
  "mb-1.5 block text-sm font-medium text-adm-ink";

export default function CandidateFields({
  defaults,
  onLocked,
}: CandidateFieldsProps) {
  const id = useId();
  const { t } = useI18n();
  const tf = t.admin.fields;

  const categories = [
    {
      value: "reine",
      label: tf.queen,
      tone: "has-[:checked]:border-adm-reine has-[:checked]:bg-adm-reine/8 has-[:checked]:text-adm-reine",
    },
    {
      value: "roi",
      label: tf.king,
      tone: "has-[:checked]:border-adm-roi has-[:checked]:bg-adm-roi/8 has-[:checked]:text-adm-roi",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${id}-name`} className={labelClass}>
          {tf.name}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          required
          autoComplete="off"
          defaultValue={defaults?.name}
          placeholder={tf.namePlaceholder}
          className={cn(fieldClass, "h-10")}
        />
      </div>

      <fieldset>
        <legend className={labelClass}>{tf.title}</legend>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <label
              key={category.value}
              className={cn(
                "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-adm-line text-sm font-medium text-adm-muted transition-colors hover:border-adm-muted/40 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-adm-accent/20",
                category.tone
              )}
            >
              <input
                type="radio"
                name="category"
                value={category.value}
                required
                defaultChecked={
                  (defaults?.category ?? "reine") === category.value
                }
                className="sr-only"
              />
              <Crown className="size-4" aria-hidden />
              {category.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className={labelClass}>{tf.photo}</p>
        <CandidatePhotoField
          defaultUrl={defaults?.photo_url}
          onLocked={onLocked}
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-description`}
          className={labelClass}
        >
          {tf.description}{" "}
          <span className="font-normal text-adm-muted">
            {tf.optional}
          </span>
        </label>
        <textarea
          id={`${id}-description`}
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ""}
          placeholder={tf.descriptionPlaceholder}
          className={cn(fieldClass, "resize-y py-2.5 leading-relaxed")}
        />
      </div>
    </div>
  );
}
