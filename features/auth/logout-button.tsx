import { logout } from "@/features/auth/actions";

// Bouton de déconnexion : un simple formulaire appelant la Server Action logout.
export const LogoutButton = () => {
  return (
    <form action={logout}>
      <button type="submit">Se déconnecter</button>
    </form>
  );
};
