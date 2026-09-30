"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: "primary" | "danger" | "light";
  className?: string;
}

const variants = {
  primary:
    "bg-adm-accent text-white hover:bg-[#a9461f] focus-visible:ring-adm-accent/40",
  danger:
    "bg-[#b3261e] text-white hover:bg-[#921d17] focus-visible:ring-[#b3261e]/40",
  light:
    "bg-adm-cream text-adm-wine hover:bg-white focus-visible:ring-adm-cream/50",
};

export default function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-4 disabled:cursor-wait disabled:opacity-70",
        variants[variant],
        className
      )}
    >
      {pending && (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}
