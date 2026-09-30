"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { login } from "@/actions/auth";
import { useI18n } from "@/lib/i18n/client";

const initialState = {
  error: "",
};

const fieldClass =
  "h-11 w-full rounded-lg border border-adm-line bg-white px-3 text-sm text-adm-ink outline-none transition-colors placeholder:text-adm-muted/60 focus-visible:border-adm-accent focus-visible:ring-3 focus-visible:ring-adm-accent/20";

export default function AdminLoginForm() {
  const { t } = useI18n();
  const tl = t.login;
  const [state, formAction, pending] = useActionState(
    login,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium"
        >
          {tl.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={tl.emailPlaceholder}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium"
        >
          {tl.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {tl.errors[state.error] ?? state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-adm-wine text-sm font-medium text-white outline-none transition-colors hover:bg-adm-wine-2 focus-visible:ring-4 focus-visible:ring-adm-wine/30 disabled:cursor-wait disabled:opacity-70"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? tl.pending : tl.submit}
      </button>
    </form>
  );
}
