"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  accId: string;
  ethBalance: string;
  pts: string;
  isLoggedIn: boolean;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

const defaultUser: User = {
  accId: "",
  ethBalance: "0 ETH",
  pts: "0 PTS",
  isLoggedIn: false,
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(defaultUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);