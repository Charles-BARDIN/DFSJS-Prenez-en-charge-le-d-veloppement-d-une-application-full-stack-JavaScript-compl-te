"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/features/auth/actions";

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
    <form action={formAction}>
      <label>
        E-mail ou nom d&apos;utilisateur
        <input name="identifier" type="text" required />
      </label>
      {fieldErrors?.identifier ? (
        <p role="alert">{fieldErrors.identifier}</p>
      ) : null}

      <label>
        Mot de passe
        <input name="password" type="password" required />
      </label>
      {fieldErrors?.password ? <p role="alert">{fieldErrors.password}</p> : null}

      {globalError ? <p role="alert">{globalError}</p> : null}

      <button type="submit" disabled={pending}>
        Se connecter
      </button>
    </form>
  );
};
