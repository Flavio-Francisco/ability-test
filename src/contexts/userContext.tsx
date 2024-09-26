"use client";
import React, { useEffect, createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { auth } from "@/fetch/auth";

interface UserData {
  user: User | null;
  getUser: (values: { email: string; password: string }) => void;
  logOut: () => void;
}

const UserContext = createContext({} as UserData);

export const useSession = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  async function restoreUserFromCache() {
    const cachedUserData = localStorage.getItem("userData");
    if (cachedUserData && cachedUserData !== "undefined") {
      setUser(JSON.parse(cachedUserData));
    }
  }
  useEffect(() => {
    console.log("Estado do usuário atualizado:", user);
  }, [user]);
  useEffect(() => {
    restoreUserFromCache();
  }, []);
  async function getUser(values: { email: string; password: string }) {
    try {
      const data = await auth(values.email, values.password);
      if (data) {
        setUser(data);
        localStorage.setItem("userData", JSON.stringify(data));
        console.log("Usuário autenticado:", data);
      } else {
        console.error("Dados do usuário não retornados:", data);
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
    }
  }

  function logOut() {
    setUser(null);
    router.push("/");
    localStorage.setItem("userData", JSON.stringify(null));
  }

  return (
    <UserContext.Provider value={{ getUser, user, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
