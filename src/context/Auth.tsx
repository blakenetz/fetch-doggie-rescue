import { login, logout } from "@/actions/auth";
import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: typeof login;
  logout: typeof logout;
};

export const AuthContext = createContext({} as AuthContextType);
