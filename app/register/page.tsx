import Link from "next/link";

import { RegisterForm } from "@/features/auth/register-form";
import { AuthCard } from "@/features/auth/auth-card";

const RegisterPage = () => {
  return (
    <AuthCard title="Inscription">
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
