import { notFound } from "next/navigation";

import { getCurrentUser } from "@/features/auth/current-user";
import { getProfile } from "@/features/profile/queries";
import { ProfileForm } from "@/features/profile/profile-form";
import { unsubscribe } from "@/features/themes/actions";

// Page de profil : informations modifiables + liste des abonnements avec
// possibilité de se désabonner. La mise en forme sera ajoutée avec les maquettes.
const ProfilePage = async () => {
  const currentUser = await getCurrentUser();
  const profile = await getProfile(currentUser.id);

  if (!profile) notFound();

  return (
    <main>
      <h1>Profil utilisateur</h1>

      <ProfileForm email={profile.email} username={profile.username} />

      <section aria-label="Abonnements">
        <h2>Abonnements</h2>
        {profile.subscriptions.length === 0 ? (
          <p>Vous n&apos;êtes abonné à aucun thème.</p>
        ) : (
          <ul>
            {profile.subscriptions.map(({ topic }) => (
              <li key={topic.id}>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <form
                  action={async () => {
                    "use server";
                    await unsubscribe(topic.id);
                  }}
                >
                  <button type="submit">Se désabonner</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
