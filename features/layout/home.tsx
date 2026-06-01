import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

// Accueil public (visiteur non connecté) : logo MDD et accès à la connexion
// ou à l'inscription.
export const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-4">
      <Image
        src="/logo.png"
        alt="MDD"
        width={695}
        height={401}
        priority
        className="h-28 w-auto"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Se connecter</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/register">S&apos;inscrire</Link>
        </Button>
      </div>
    </main>
  );
};
