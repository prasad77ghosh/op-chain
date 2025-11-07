import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/api/axiosInstance";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (data: RegisterPayload) => Promise<boolean>;
  login: (data: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}

/** ✅ Clean backend error message extractor */
const getErrorMessage = (err: unknown): string => {
  const error = err as {
    response?: { data?: { msg?: string; message?: string; error?: { message?: string } } };
    message?: string;
  };

  return (
    error.response?.data?.msg ||
    error.response?.data?.message ||
    error.response?.data?.error?.message ||
    error.message ||
    "Something went wrong"
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      register: async (data) => {
        try {
          set({ loading: true, error: null });
          await axiosInstance.post("/auth/register", data);
          return true;
        } catch (err) {
          set({ error: getErrorMessage(err) });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      login: async (data) => {
        try {
          set({ loading: true, error: null });
          await axiosInstance.post("/auth/login", data);
          await useAuthStore.getState().getProfile();
          return true;
        } catch (err) {
          set({ error: getErrorMessage(err) });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ user: null });
        } catch {
          set({ user: null });
        }
      },

      getProfile: async () => {
        try {
          const res = await axiosInstance.get<{ data: User }>("/auth/profile");
          set({ user: res.data.data });
        } catch {
          set({ user: null });
        }
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
);
