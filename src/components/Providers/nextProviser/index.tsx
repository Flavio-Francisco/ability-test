"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
  );
};
