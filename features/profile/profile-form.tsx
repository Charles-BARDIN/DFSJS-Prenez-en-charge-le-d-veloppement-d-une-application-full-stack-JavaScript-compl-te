"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { updateProfile } from "@/features/profile/actions";
import { FormField } from "@/features/auth/form-field";

type ProfileFormProps = {
  email: string;
  username: string;
};

/**
 * Client Component : formulaire de modification du profil.
 * Le mot de passe est laissé vide par défaut et n'est modifié que s'il est saisi.
 */
export const ProfileForm = ({ email, username }: ProfileFormProps) => {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const globalError =
    state && !state.success && !state.fieldErrors ? state.error : undefined;
  const success = state?.success ?? false;

  return (
    <form action={formAction} className="mx-auto max-w-sm space-y-4">
      <FormField
        label="Nom d'utilisateur"
        name="username"
        type="text"
        defaultValue={username}
        required
        error={fieldErrors?.username}
      />
      <FormField
        label="Adresse e-mail"
        name="email"
        type="email"
        defaultValue={email}
        required
        error={fieldErrors?.email}
      />
      <FormField
        label="Nouveau mot de passe"
        name="password"
        type="password"
        error={fieldErrors?.password}
      />

      {globalError ? (
        <p role="alert" className="text-sm text-destructive">
          {globalError}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-sm text-primary">
          Profil mis à jour.
        </p>
      ) : null}

      <div className="flex justify-center">
        <Button type="submit" disabled={pending}>
          Sauvegarder
        </Button>
      </div>
    </form>
  );
};
