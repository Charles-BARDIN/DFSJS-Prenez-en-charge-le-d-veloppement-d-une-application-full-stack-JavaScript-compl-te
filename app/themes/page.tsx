import { requireUser } from "@/features/auth/current-user";
import { getTopicsWithSubscription } from "@/features/themes/queries";
import { subscribe } from "@/features/themes/actions";
import { TopicCard } from "@/features/themes/topic-card";
import { Button } from "@/components/ui/button";

// Server Component : lecture des thèmes côté serveur, avec l'état d'abonnement
// de l'utilisateur courant.
const ThemesPage = async () => {
  const user = await requireUser();
  const topics = await getTopicsWithSubscription(user.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Thèmes</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            title={topic.title}
            description={topic.description}
            action={
              topic.isSubscribed ? (
                // L'état désactivé applique automatiquement le style gris (cf. Button).
                <Button disabled className="w-full">
                  Déjà abonné
                </Button>
              ) : (
                // Le formulaire appelle la Server Action : fonctionne même sans
                // JavaScript (progressive enhancement).
                <form
                  action={async () => {
                    "use server";
                    await subscribe(topic.id);
                  }}
                >
                  <Button type="submit" className="w-full">
                    S&apos;abonner
                  </Button>
                </form>
              )
            }
          />
        ))}
      </div>
    </main>
  );
};

export default ThemesPage;
