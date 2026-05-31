import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

// Mise en page commune aux écrans de connexion et d'inscription :
// flèche de retour, logo, titre, contenu (formulaire) et pied de carte.
export const AuthCard = ({ title, children, footer }: AuthCardProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          aria-label="Retour à l'accueil"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Retour
        </Link>

        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/logo.png"
                alt="MDD"
                width={695}
                height={401}
                priority
                className="h-14 w-auto"
              />
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>

            {children}

            <p className="text-center text-sm text-muted-foreground">{footer}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
