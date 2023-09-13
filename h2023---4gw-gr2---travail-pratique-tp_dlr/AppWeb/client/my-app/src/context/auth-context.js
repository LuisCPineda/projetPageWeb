import React, { createContext, useContext } from "react";
import useAuth from "../hooks/auth-hook";

const AuthContext = createContext();

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return context;
}

const AuthContextProvider = ({ children }) => {
  const { utilisateur, login, logout } = useAuth();

  //on passe les fonctions login et logout au context
  const authState = { utilisateur, login, logout };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider, useAuthContext };
