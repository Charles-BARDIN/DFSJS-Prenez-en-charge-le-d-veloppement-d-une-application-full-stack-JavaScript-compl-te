import { notFound } from "next/navigation";

import { getArticle } from "@/features/articles/queries";
import { formatDate } from "@/features/articles/format";

// Détail d'un article : thème, titre, auteur, date, contenu et commentaires.
// Le formulaire d'ajout de commentaire sera ajouté avec la fonctionnalité dédiée.
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
