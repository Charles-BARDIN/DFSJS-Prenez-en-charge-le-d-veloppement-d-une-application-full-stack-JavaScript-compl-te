import Link from "next/link";

import { LoginForm } from "@/features/auth/login-form";
import { AuthCard } from "@/features/auth/auth-card";

const LoginPage = () => {
  return (
    <AuthCard title="Se connecter">
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
