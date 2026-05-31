import Link from "next/link";

import { requireUser } from "@/features/auth/current-user";
import { getFeed, type FeedOrder } from "@/features/articles/queries";
import { ArticleCard } from "@/features/articles/article-card";
import { Button } from "@/components/ui/button";

// Server Component : fil d'actualité de l'utilisateur courant.
// Le tri est piloté par le paramètre d'URL `order` (asc | desc), ce qui évite
// tout JavaScript côté client.
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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Button asChild>
          <Link href="/articles/new">Créer un article</Link>
        </Button>

        <nav aria-label="Tri du fil" className="flex items-center gap-3 text-sm">
          <span className="text-foreground">Trier par</span>
          <Link
            href="/feed?order=desc"
            className={
              feedOrder === "desc"
                ? "font-semibold text-primary"
                : "text-foreground hover:text-primary"
            }
          >
            Plus récent
          </Link>
          <Link
            href="/feed?order=asc"
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

export default FeedPage;
