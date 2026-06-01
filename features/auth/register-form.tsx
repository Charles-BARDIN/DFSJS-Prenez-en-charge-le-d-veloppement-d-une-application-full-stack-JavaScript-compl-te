"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { registerUser } from "@/features/auth/actions";
import { FormField } from "./form-field";

/**
 * Client Component : formulaire d'inscription.
 * En cas de succès, l'utilisateur est déjà connecté : on le redirige vers
 * la page d'accueil (le fil d'actualité).
 */
export const RegisterForm = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerUser, null);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const globalError =
    state && !state.success && !state.fieldErrors ? state.error : undefined;

  useEffect(() => {
    if (state?.success) {
      router.push("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="Nom d'utilisateur"
        name="username"
        type="text"
        required
        error={fieldErrors?.username}
      />
      <FormField
        label="Adresse e-mail"
        name="email"
        type="email"
        required
        error={fieldErrors?.email}
      />
      <FormField
        label="Mot de passe"
        name="password"
        type="password"
        required
        error={fieldErrors?.password}
      />

      {globalError ? (
        <p role="alert" className="text-sm text-destructive">
          {globalError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        S&apos;inscrire
      </Button>
    </form>
  );
};
