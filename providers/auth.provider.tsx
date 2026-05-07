"use client";

import { useEffect, useState } from "react";
import type { AuthenticatedUser } from "@/lib/definitions";
import { AuthContext } from "./auth.context";

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser: AuthenticatedUser | null;
};

export default function AuthProvider({
  children,
  initialUser,
}: AuthProviderProps) {
  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(
    initialUser,
  );

  useEffect(() => {
    setAuthUser(initialUser);
  }, [initialUser]);

  return (
    <AuthContext.Provider
      value={{ authUser, isLoading: false, setAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
