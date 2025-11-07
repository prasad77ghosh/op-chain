import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-6">
        <AuthForm type="register" />
      </div>
    </div>
  );
}
