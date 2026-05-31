import Image from "next/image";

import { BackButton } from "@/components/back-button";

type AuthCardProps = {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

// Mise en page commune aux écrans de connexion et d'inscription :
// flèche de retour, logo, titre, formulaire et pied de page, centrés.
export const AuthCard = ({ title, children, footer }: AuthCardProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <BackButton href="/" className="mb-4" />

        <div className="space-y-6">
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
        </div>
      </div>
    </main>
  );
};
