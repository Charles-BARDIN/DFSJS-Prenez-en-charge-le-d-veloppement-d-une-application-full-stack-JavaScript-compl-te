import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

// Bouton de retour commun à l'application : une flèche noire seule (sans texte).
// Le libellé reste accessible aux lecteurs d'écran via aria-label.
export const BackButton = ({
  href,
  className,
}: {
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      aria-label="Retour"
      className={cn(
        "inline-flex text-foreground transition-opacity hover:opacity-70",
        className,
      )}
    >
      <ArrowLeft className="size-6" />
    </Link>
  );
};
