"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// Lien vers la page de profil affichant l'icône utilisateur (public/user.svg).
// L'icône est colorée via un masque CSS : couleur normale, et couleur de marque
// lorsque l'utilisateur se trouve sur la page profil.
export const AvatarLink = () => {
  const pathname = usePathname();
  const isActive = pathname === "/profile";

  return (
    <Link
      href="/profile"
      aria-label="Profil"
      className="flex size-9 items-center justify-center rounded-full bg-muted"
    >
      <span
        aria-hidden
        className={cn("size-5", isActive ? "bg-primary" : "bg-foreground")}
        style={{
          maskImage: "url(/user.svg)",
          WebkitMaskImage: "url(/user.svg)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    </Link>
  );
};
