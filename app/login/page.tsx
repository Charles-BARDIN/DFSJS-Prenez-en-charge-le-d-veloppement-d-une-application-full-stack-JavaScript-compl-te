import Link from "next/link";

import { LoginForm } from "@/features/auth/login-form";
import { AuthCard } from "@/features/auth/auth-card";

const LoginPage = () => {
  return (
    <AuthCard
      title="Se connecter"
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
