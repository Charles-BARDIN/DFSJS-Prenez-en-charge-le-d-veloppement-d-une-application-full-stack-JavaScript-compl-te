import { getTopicList } from "@/features/themes/queries";
import { ArticleForm } from "@/features/articles/article-form";
import { BackButton } from "@/components/back-button";

// Création d'un article. L'auteur et la date sont définis automatiquement
// côté serveur ; le formulaire ne fournit que le thème, le titre et le contenu.
const NewArticlePage = async () => {
  const topics = await getTopicList();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <BackButton href="/" className="mb-4" />
      <h1 className="mb-6 text-center text-2xl font-bold">
        Créer un nouvel article
      </h1>
      <ArticleForm topics={topics} />
    </main>
  );
};

export default NewArticlePage;
