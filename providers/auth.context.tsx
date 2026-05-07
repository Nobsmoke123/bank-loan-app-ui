import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
} from "react";
import type { AuthenticatedUser } from "@/lib/definitions";

export type AuthContextValue = {
  authUser: AuthenticatedUser | null;
  setAuthUser: Dispatch<SetStateAction<AuthenticatedUser | null>>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
