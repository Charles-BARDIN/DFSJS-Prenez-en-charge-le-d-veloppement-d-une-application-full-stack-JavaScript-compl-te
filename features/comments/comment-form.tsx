"use client";

import { useActionState, useEffect, useRef } from "react";

import { addComment } from "@/features/comments/actions";

// Client Component : formulaire d'ajout de commentaire.
// Affiche les erreurs de validation et vide le champ après un envoi réussi.
export const CommentForm = ({ articleId }: { articleId: string }) => {
  const [state, formAction, pending] = useActionState(addComment, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  const error = state && !state.success ? state.fieldErrors?.content : undefined;

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="articleId" value={articleId} />
      <label>
        Votre commentaire
        <textarea
          name="content"
          required
          placeholder="Écrivez ici votre commentaire"
        />
      </label>
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" disabled={pending}>
        Envoyer
      </button>
    </form>
  );
};
