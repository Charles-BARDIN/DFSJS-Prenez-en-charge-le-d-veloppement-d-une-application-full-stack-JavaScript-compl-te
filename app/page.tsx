import { getCurrentUser } from "@/features/auth/current-user";
import { Home } from "@/features/layout/home";
import { Feed } from "@/features/articles/feed";

/**
 * Page d'accueil : présente l'accueil public au visiteur non connecté, et le
 * fil d'actualité à l'utilisateur connecté (cf. spécifications fonctionnelles).
 */
const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) => {
  const user = await getCurrentUser();
  if (!user) return <Home />;

  return <Feed userId={user.id} searchParams={searchParams} />;
};

export default HomePage;
