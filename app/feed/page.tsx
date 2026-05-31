import Link from "next/link";

import { requireUser } from "@/features/auth/current-user";
import { getFeed, type FeedOrder } from "@/features/articles/queries";
import { formatDate } from "@/features/articles/format";

// Server Component : fil d'actualité de l'utilisateur courant.
// Le tri est piloté par le paramètre d'URL `order` (asc | desc), ce qui évite
// tout JavaScript côté client. La mise en forme sera ajoutée avec les maquettes.
const FeedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) => {
  const { order } = await searchParams;
  const feedOrder: FeedOrder = order === "asc" ? "asc" : "desc";

  const user = await requireUser();
  const articles = await getFeed(user.id, feedOrder);

  return (
    <main>
      <h1>Fil d&apos;actualité</h1>

      <nav aria-label="Tri du fil">
        Trier par date :{" "}
        <Link href="/feed?order=desc">Plus récent</Link>
        {" / "}
        <Link href="/feed?order=asc">Plus ancien</Link>
      </nav>

      <p>
        <Link href="/articles/new">Créer un article</Link>
      </p>

      {articles.length === 0 ? (
        <p>
          Aucun article pour le moment. Abonnez-vous à des thèmes pour voir leurs
          articles.
        </p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <h2>
                <Link href={`/articles/${article.id}`}>{article.title}</Link>
              </h2>
              <p>
                {formatDate(article.createdAt)} — {article.author.username} —{" "}
                {article.topic.title}
              </p>
              <p>{article.content}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default FeedPage;
