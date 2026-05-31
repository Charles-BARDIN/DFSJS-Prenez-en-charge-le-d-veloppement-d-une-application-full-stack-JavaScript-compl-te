"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import { NavLinks } from "./nav-links";

// Menu de navigation mobile : un panneau latéral ouvert via un bouton « burger ».
export const MobileNav = ({ username }: { username: string }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le panneau à chaque changement de page (clic sur un lien).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <SheetTitle>Menu</SheetTitle>
        <nav className="mt-6 flex flex-col items-start gap-4">
          <NavLinks />
          <Link
            href="/profile"
            className="text-sm font-medium hover:text-primary"
          >
            Profil ({username})
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-destructive hover:underline"
            >
              Se déconnecter
            </button>
          </form>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
