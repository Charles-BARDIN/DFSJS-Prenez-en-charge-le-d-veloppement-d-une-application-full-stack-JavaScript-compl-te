import Link from "next/link";

import { RegisterForm } from "@/features/auth/register-form";
import { AuthCard } from "@/features/auth/auth-card";

const RegisterPage = () => {
  return (
    <AuthCard
      title="Inscription"
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
