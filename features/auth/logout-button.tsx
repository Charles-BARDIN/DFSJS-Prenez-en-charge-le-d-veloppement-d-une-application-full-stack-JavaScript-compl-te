import { logout } from "@/features/auth/actions";

// Bouton de déconnexion : un simple formulaire appelant la Server Action logout.
export const LogoutButton = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm font-medium text-destructive hover:underline"
      >
        Se déconnecter
      </button>
    </form>
  );
};
