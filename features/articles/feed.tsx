import Link from "next/link";

import { getFeed, type FeedOrder } from "@/features/articles/queries";
import { ArticleCard } from "@/features/articles/article-card";
import { Button } from "@/components/ui/button";

/**
 * Fil d'actualité de l'utilisateur connecté, affiché sur la page d'accueil.
 * Le tri est piloté par le paramètre d'URL `order` (asc | desc), lu ici même,
 * ce qui évite tout JavaScript côté client.
 */
export const Feed = async ({
  userId,
  searchParams,
}: {
  userId: string;
  searchParams: Promise<{ order?: string }>;
}) => {
  const { order } = await searchParams;
  const feedOrder: FeedOrder = order === "asc" ? "asc" : "desc";
  const articles = await getFeed(userId, feedOrder);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Button asChild>
          <Link href="/articles/new">Créer un article</Link>
        </Button>

        <nav aria-label="Tri du fil" className="flex items-center gap-3 text-sm">
          <span className="text-foreground">Trier par</span>
          <Link
            href="/?order=desc"
            className={
              feedOrder === "desc"
                ? "font-semibold text-primary"
                : "text-foreground hover:text-primary"
            }
          >
            Plus récent
          </Link>
          <Link
            href="/?order=asc"
            className={
              feedOrder === "asc"
                ? "font-semibold text-primary"
                : "text-foreground hover:text-primary"
            }
          >
            Plus ancien
          </Link>
        </nav>
      </div>

      {articles.length === 0 ? (
        <p className="text-foreground">
          Aucun article pour le moment. Abonnez-vous à des thèmes pour voir leurs
          articles.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              authorName={article.author.username}
              topicTitle={article.topic.title}
              createdAt={article.createdAt}
            />
          ))}
        </div>
      )}
    </main>
  );
};
