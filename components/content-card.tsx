import { cn } from "@/lib/utils";

// Carte de contenu commune à l'application (thèmes, articles, abonnements).
// Style partagé : fond gris clair, coins arrondis, espacement régulier.
export const ContentCard = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-muted p-6",
        className,
      )}
      {...props}
    />
  );
};

// Titre de carte : gras, 16px.
export const ContentCardTitle = ({
  className,
  ...props
}: React.ComponentProps<"h2">) => {
  return (
    <h2
      className={cn("text-base font-bold text-foreground", className)}
      {...props}
    />
  );
};

// Texte de carte : 14px, couleur de texte standard.
export const ContentCardText = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return <p className={cn("text-sm text-foreground", className)} {...props} />;
};
