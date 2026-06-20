"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  accId: string;
  usdtBalance: string;
  pts: string;
  isLoggedIn: boolean;
  inviteCode: string;
  inviteLink: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

const defaultUser: User = {
  accId: "",
  usdtBalance: "0 USDT",
  pts: "0 PTS",
  isLoggedIn: false,
  inviteCode: "",
  inviteLink: "",
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(defaultUser);
  };

  // api.ts dispatches sf:auth-expired on 401 — reset state here
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("sf:auth-expired", handler);
    return () => window.removeEventListener("sf:auth-expired", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
