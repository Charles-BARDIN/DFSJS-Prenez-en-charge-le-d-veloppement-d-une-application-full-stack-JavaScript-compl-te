"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/features/auth/logout-button";
import { usePathname } from "next/navigation";
import { NavLinks } from "./nav-links";
import { AvatarLink } from "./avatar-link";

// Menu de navigation mobile : un panneau latéral ouvert via un bouton « burger ».
export const MobileNav = () => {
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
      <SheetContent className="flex flex-col p-6">
        {/* Titre requis pour l'accessibilité, masqué visuellement. */}
        <SheetTitle className="sr-only">Menu</SheetTitle>

        <nav className="flex flex-col items-start gap-6">
          <LogoutButton />
          <NavLinks className="text-xl" />
        </nav>

        {/* L'accès au profil se fait via l'avatar, en bas à droite. */}
        <div className="mt-auto flex justify-end">
          <AvatarLink />
        </div>
      </SheetContent>
    </Sheet>
  );
};
