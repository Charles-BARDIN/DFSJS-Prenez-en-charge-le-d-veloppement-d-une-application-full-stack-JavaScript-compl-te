import { notFound } from "next/navigation";

import { requireUser } from "@/features/auth/current-user";
import { getProfile } from "@/features/profile/queries";
import { ProfileForm } from "@/features/profile/profile-form";
import { TopicCard } from "@/features/themes/topic-card";
import { unsubscribe } from "@/features/themes/actions";
import { Button } from "@/components/ui/button";

// Page de profil : informations modifiables + liste des abonnements avec
// possibilité de se désabonner.
const ProfilePage = async () => {
  const currentUser = await requireUser();
  const profile = await getProfile(currentUser.id);

  if (!profile) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-bold">Profil utilisateur</h1>

      <ProfileForm email={profile.email} username={profile.username} />

      <section aria-label="Abonnements" className="mt-12">
        <h2 className="mb-6 text-center text-xl font-semibold">Abonnements</h2>

        {profile.subscriptions.length === 0 ? (
          <p className="text-center text-foreground">
            Vous n&apos;êtes abonné à aucun thème.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.subscriptions.map(({ topic }) => (
              <TopicCard
                key={topic.id}
                title={topic.title}
                description={topic.description}
                action={
                  // Le formulaire appelle la Server Action (fonctionne sans JS).
                  <form
                    action={async () => {
                      "use server";
                      await unsubscribe(topic.id);
                    }}
                  >
                    <Button type="submit" className="w-full">
                      Se désabonner
                    </Button>
                  </form>
                }
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
