"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/feed", label: "Articles", match: ["/feed", "/articles"] },
  { href: "/themes", label: "Thèmes", match: ["/themes"] },
];

// Liens de navigation principaux, avec mise en évidence de la page active.
// `className` permet d'ajuster la taille selon le contexte (header / menu mobile).
// `onNavigate` est appelé au clic (ex. fermer le menu mobile).
export const NavLinks = ({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <>
      {LINKS.map((link) => {
        const isActive = link.match.some(
          (m) => pathname === m || pathname.startsWith(`${m}/`),
        );
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-foreground",
              className,
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
};
