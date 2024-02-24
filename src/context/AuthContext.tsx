"use client";

import React, { createContext, useContext, useState } from "react";

interface IAuthContext {
  email: string;
  login: (userEmail: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  email: "",
  logout: () => {},
  login: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [email, setEmail] = useState("");

  const login = (userEmail: string) => {
    setEmail(userEmail);
  };

  const logout = () => {
    setEmail("");
  };

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
