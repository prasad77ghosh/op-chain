import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import { Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/auth/ProtectedRoutes";
import { Toaster } from "./components/ui/sonner";
import MathTreeApp from "./pages/HomePage";
import { Navbar } from "./components/layout/Navbar";

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-14">
        <Routes>
          <Route path="/" element={<MathTreeApp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MathTreeApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster position="top-right" richColors closeButton={true} />
    </div>
  );
}
