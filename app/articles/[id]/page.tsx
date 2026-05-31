import { notFound } from "next/navigation";

import { getArticle } from "@/features/articles/queries";
import { formatDate } from "@/features/articles/format";
import { CommentForm } from "@/features/comments/comment-form";
import { BackButton } from "@/components/back-button";

// Détail d'un article : thème, titre, auteur, date, contenu et commentaires.
const ArticlePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) notFound();

  return (
    <main>
      <BackButton href="/feed" />
      <article>
        <h1>{article.title}</h1>
        <p>
          {formatDate(article.createdAt)} — {article.author.username} —{" "}
          {article.topic.title}
        </p>
        <p>{article.content}</p>
      </article>

      <section aria-label="Commentaires">
        <h2>Commentaires</h2>

        <CommentForm articleId={article.id} />

        {article.comments.length === 0 ? (
          <p>Aucun commentaire pour le moment.</p>
        ) : (
          <ul>
            {article.comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.author.username}</strong> : {comment.content}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default ArticlePage;
