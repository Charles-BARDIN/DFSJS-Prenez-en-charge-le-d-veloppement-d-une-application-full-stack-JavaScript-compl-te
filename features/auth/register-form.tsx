"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/features/auth/actions";

// Client Component : formulaire d'inscription.
// En cas de succès, l'utilisateur est déjà connecté : on le redirige vers le fil.
export const RegisterForm = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerUser, null);
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
        Nom d&apos;utilisateur
        <input name="username" type="text" required />
      </label>
      {fieldErrors?.username ? <p role="alert">{fieldErrors.username}</p> : null}

      <label>
        Adresse e-mail
        <input name="email" type="email" required />
      </label>
      {fieldErrors?.email ? <p role="alert">{fieldErrors.email}</p> : null}

      <label>
        Mot de passe
        <input name="password" type="password" required />
      </label>
      {fieldErrors?.password ? <p role="alert">{fieldErrors.password}</p> : null}

      {globalError ? <p role="alert">{globalError}</p> : null}

      <button type="submit" disabled={pending}>
        S&apos;inscrire
      </button>
    </form>
  );
};
