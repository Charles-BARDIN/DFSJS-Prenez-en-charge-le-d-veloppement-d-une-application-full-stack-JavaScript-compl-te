"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { login } from "@/features/auth/actions";
import { FormField } from "./form-field";

// Client Component : formulaire de connexion (e-mail ou nom d'utilisateur).
// En cas de succès, redirige vers le fil d'actualité.
export const LoginForm = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(login, null);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const globalError =
    state && !state.success && !state.fieldErrors ? state.error : undefined;

  useEffect(() => {
    if (state?.success) {
      router.push("/feed");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="E-mail ou nom d'utilisateur"
        name="identifier"
        type="text"
        required
        error={fieldErrors?.identifier}
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
        Se connecter
      </Button>
    </form>
  );
};
