import Link from "next/link";

import { RegisterForm } from "@/features/auth/register-form";

// Page d'inscription. La mise en forme sera ajoutée avec les maquettes.
const RegisterPage = () => {
  return (
    <main>
      <h1>Inscription</h1>
      <RegisterForm />
      <p>
        Déjà un compte ? <Link href="/login">Se connecter</Link>
      </p>
    </main>
  );
};

export default RegisterPage;
