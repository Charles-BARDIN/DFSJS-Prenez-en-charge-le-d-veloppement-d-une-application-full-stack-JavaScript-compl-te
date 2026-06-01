"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addComment } from "@/features/comments/actions";

/**
 * Client Component : formulaire d'ajout de commentaire.
 * Affiche les erreurs de validation et vide le champ après un envoi réussi.
 */
export const CommentForm = ({ articleId }: { articleId: string }) => {
  const [state, formAction, pending] = useActionState(addComment, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  const error = state && !state.success ? state.fieldErrors?.content : undefined;

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      {/* L'identifiant de l'article est transmis à la Server Action. */}
      <input type="hidden" name="articleId" value={articleId} />
      <Label htmlFor="content" className="sr-only">
        Votre commentaire
      </Label>

      {/* Champ de saisie et icône d'envoi à droite, en dehors du champ. */}
      <div className="flex items-center gap-3">
        <Textarea
          id="content"
          name="content"
          required
          rows={3}
          placeholder="Écrivez ici votre commentaire"
          className="flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Envoyer le commentaire"
          className="shrink-0 text-primary transition-opacity hover:opacity-70 disabled:opacity-50"
        >
          <Send className="size-6" />
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
};
