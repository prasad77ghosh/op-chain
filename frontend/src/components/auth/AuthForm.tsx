import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthFormProps {
  type: "login" | "register";
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { register, login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (type === "register") {
      success = await register(formData);
      if (success) {
        toast.success("You have registered successfully!");
        navigate("/login");
      }
    } else {
      success = await login(formData);
      if (success) {
        toast.success("You are logged in successfully!");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Helper for label with required asterisk
  const RequiredLabel = ({
    htmlFor,
    label,
  }: {
    htmlFor: string;
    label: string;
  }) => (
    <Label htmlFor={htmlFor} className="flex items-center gap-1">
      {label}
      <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <div className="w-full p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        {type === "register" ? "Create Account" : "Welcome Back"}
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm">
        {type === "register"
          ? "Sign up to get started"
          : "Login to continue to your account"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name (only for register) */}
        {type === "register" && (
          <div className="flex flex-col space-y-1">
            <RequiredLabel htmlFor="name" label="Full Name" />
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <RequiredLabel htmlFor="email" label="Email Address" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-1 relative">
          <RequiredLabel htmlFor="password" label="Password" />
          <div className="relative">
            <Input
              id="password"
              name="password"
              required
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password (only for register) */}
        {type === "register" && (
          <div className="flex flex-col space-y-1 relative">
            <RequiredLabel htmlFor="confirmPassword" label="Confirm Password" />
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                required
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full mt-2 cursor-pointer"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : type === "register"
            ? "Register"
            : "Login"}
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          {type === "register" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Register
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};
