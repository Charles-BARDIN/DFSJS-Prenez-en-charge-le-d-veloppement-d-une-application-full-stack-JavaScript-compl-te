"use client";

import { useActionState } from "react";

import { createArticle } from "@/features/articles/actions";

type TopicOption = { id: string; title: string };

// Client Component : gère l'état du formulaire et l'affichage des erreurs de
// validation renvoyées par la Server Action via useActionState.
export const ArticleForm = ({ topics }: { topics: TopicOption[] }) => {
  const [state, formAction, pending] = useActionState(createArticle, null);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction}>
      <label>
        Thème
        <select name="topicId" defaultValue="" required>
          <option value="" disabled>
            Sélectionner un thème
          </option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
      </label>
      {fieldErrors?.topicId ? <p role="alert">{fieldErrors.topicId}</p> : null}

      <label>
        Titre
        <input name="title" type="text" required />
      </label>
      {fieldErrors?.title ? <p role="alert">{fieldErrors.title}</p> : null}

      <label>
        Contenu
        <textarea name="content" required />
      </label>
      {fieldErrors?.content ? <p role="alert">{fieldErrors.content}</p> : null}

      <button type="submit" disabled={pending}>
        Créer
      </button>
    </form>
  );
};
