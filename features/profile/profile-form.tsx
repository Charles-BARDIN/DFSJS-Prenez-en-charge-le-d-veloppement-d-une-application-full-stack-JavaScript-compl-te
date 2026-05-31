"use client";

import { useActionState } from "react";

import { updateProfile } from "@/features/profile/actions";

type ProfileFormProps = {
  email: string;
  username: string;
};

// Client Component : formulaire de modification du profil.
// Le mot de passe est laissé vide par défaut et n'est modifié que s'il est saisi.
export const ProfileForm = ({ email, username }: ProfileFormProps) => {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const globalError =
    state && !state.success && !state.fieldErrors ? state.error : undefined;
  const success = state?.success ?? false;

  return (
    <form action={formAction}>
      <label>
        Nom d&apos;utilisateur
        <input name="username" type="text" defaultValue={username} required />
      </label>
      {fieldErrors?.username ? <p role="alert">{fieldErrors.username}</p> : null}

      <label>
        Adresse e-mail
        <input name="email" type="email" defaultValue={email} required />
      </label>
      {fieldErrors?.email ? <p role="alert">{fieldErrors.email}</p> : null}

      <label>
        Nouveau mot de passe (laisser vide pour ne pas le changer)
        <input name="password" type="password" />
      </label>
      {fieldErrors?.password ? <p role="alert">{fieldErrors.password}</p> : null}

      {globalError ? <p role="alert">{globalError}</p> : null}
      {success ? <p role="status">Profil mis à jour.</p> : null}

      <button type="submit" disabled={pending}>
        Sauvegarder
      </button>
    </form>
  );
};
