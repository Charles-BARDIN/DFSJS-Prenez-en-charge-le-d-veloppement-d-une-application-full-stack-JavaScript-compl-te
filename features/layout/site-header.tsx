import Link from "next/link";

import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/features/auth/logout-button";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";

// En-tête du site, affiché uniquement lorsqu'un utilisateur est connecté.
// Navigation complète sur desktop, menu « burger » sur mobile.
export const SiteHeader = async () => {
  const session = await auth();
  if (!session?.user) return null;

  const username = session.user.username;
  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Logo />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <LogoutButton />
          <NavLinks />
          <Link href="/profile" aria-label="Profil">
            <Avatar className="size-9">
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </Link>
        </nav>

        {/* Navigation mobile */}
        <div className="md:hidden">
          <MobileNav username={username} />
        </div>
      </div>
    </header>
  );
};
