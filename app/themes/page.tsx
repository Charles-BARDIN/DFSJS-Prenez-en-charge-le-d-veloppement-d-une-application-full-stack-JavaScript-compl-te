import { getCurrentUser } from "@/features/auth/current-user";
import { getTopicsWithSubscription } from "@/features/themes/queries";
import { subscribe } from "@/features/themes/actions";

// Server Component : lecture des thèmes côté serveur, avec l'état d'abonnement
// de l'utilisateur courant. La mise en forme sera ajoutée avec les maquettes.
const ThemesPage = async () => {
  const user = await getCurrentUser();
  const topics = await getTopicsWithSubscription(user.id);

  return (
    <main>
      <h1>Thèmes</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            {topic.isSubscribed ? (
              <button type="button" disabled>
                Déjà abonné
              </button>
            ) : (
              // Le bouton soumet un formulaire appelant la Server Action :
              // fonctionne même sans JavaScript (progressive enhancement).
              <form
                action={async () => {
                  "use server";
                  await subscribe(topic.id);
                }}
              >
                <button type="submit">S&apos;abonner</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ThemesPage;
