import { auth } from "@/auth";
import { LogoutButton } from "@/features/auth/logout-button";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { AvatarLink } from "./avatar-link";

// En-tête du site, affiché uniquement lorsqu'un utilisateur est connecté.
// Navigation complète sur desktop, menu « burger » sur mobile.
export const SiteHeader = async () => {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Logo />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <LogoutButton />
          <NavLinks className="text-sm" />
          <AvatarLink />
        </nav>

        {/* Navigation mobile */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
