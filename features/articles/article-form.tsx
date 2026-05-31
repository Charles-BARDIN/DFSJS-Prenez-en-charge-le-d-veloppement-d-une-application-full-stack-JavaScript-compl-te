"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createArticle } from "@/features/articles/actions";

type TopicOption = { id: string; title: string };

// Client Component : gère l'état du formulaire et l'affichage des erreurs de
// validation renvoyées par la Server Action via useActionState.
export const ArticleForm = ({ topics }: { topics: TopicOption[] }) => {
  const [state, formAction, pending] = useActionState(createArticle, null);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="topicId">Thème</Label>
        {/* Le Select Radix soumet sa valeur via la prop `name` (champ natif caché). */}
        <Select name="topicId" required>
          <SelectTrigger id="topicId" className="w-full">
            <SelectValue placeholder="Sélectionner un thème" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors?.topicId ? (
          <p role="alert" className="text-sm text-destructive">
            {fieldErrors.topicId}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Titre de l&apos;article</Label>
        <Input id="title" name="title" type="text" required />
        {fieldErrors?.title ? (
          <p role="alert" className="text-sm text-destructive">
            {fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Contenu de l&apos;article</Label>
        <Textarea id="content" name="content" rows={8} required />
        {fieldErrors?.content ? (
          <p role="alert" className="text-sm text-destructive">
            {fieldErrors.content}
          </p>
        ) : null}
      </div>

      <div className="flex justify-center">
        <Button type="submit" disabled={pending}>
          Créer
        </Button>
      </div>
    </form>
  );
};
