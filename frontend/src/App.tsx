import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import { Navigate, Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/auth/ProtectedRoutes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors closeButton={true} />
    </>
  );
}
