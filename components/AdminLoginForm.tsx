"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = {
  error: "",
};

export default function AdminLoginForm() {
  const [state, formAction, pending] =
    useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Adresse email
        </label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Mot de passe
        </label>

        <Input
          id="password"
          name="password"
          type="password"
          required
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending
          ? "Connexion..."
          : "Se connecter"}
      </Button>
    </form>
  );
}