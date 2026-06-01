import { notFound } from "next/navigation";

import { getArticle } from "@/features/articles/queries";
import { formatDate } from "@/features/articles/format";
import { CommentForm } from "@/features/comments/comment-form";
import { CommentItem } from "@/features/comments/comment-item";
import { BackButton } from "@/components/back-button";

/** Détail d'un article : thème, titre, auteur, date, contenu et commentaires. */
const ArticlePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <BackButton href="/" className="mb-4" />

      <article className="space-y-4">
        <h1 className="text-2xl font-bold break-words text-foreground">
          {article.title}
        </h1>
        <p className="text-sm text-foreground">
          {formatDate(article.createdAt)} · {article.author.username} ·{" "}
          {article.topic.title}
        </p>
        <p className="whitespace-pre-line break-words text-foreground">
          {article.content}
        </p>
      </article>

      <section aria-label="Commentaires" className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Commentaires</h2>

        {article.comments.length === 0 ? (
          <p className="text-sm text-foreground">
            Aucun commentaire pour le moment.
          </p>
        ) : (
          <ul className="space-y-3">
            {article.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                username={comment.author.username}
                content={comment.content}
              />
            ))}
          </ul>
        )}

        <CommentForm articleId={article.id} />
      </section>
    </main>
  );
};

export default ArticlePage;
