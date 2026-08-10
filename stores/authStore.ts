import { create } from "zustand";

type AuthState = {
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLogged: true,

  setIsLogged: (isLogged) => set({ isLogged }),
}));
