import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 border rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <Button onClick={handleLogout} className="mt-4 w-full">Logout</Button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
