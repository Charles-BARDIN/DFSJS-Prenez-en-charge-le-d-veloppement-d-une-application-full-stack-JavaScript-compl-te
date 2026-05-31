import Link from "next/link";

import { LoginForm } from "@/features/auth/login-form";

// Page de connexion. La mise en forme sera ajoutée avec les maquettes.
const LoginPage = () => {
  return (
    <main>
      <h1>Se connecter</h1>
      <LoginForm />
      <p>
        Pas encore de compte ? <Link href="/register">S&apos;inscrire</Link>
      </p>
    </main>
  );
};

export default LoginPage;
