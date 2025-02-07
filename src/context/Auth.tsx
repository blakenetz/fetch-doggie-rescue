import { login } from "@/actions/auth";
import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: typeof login;
  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextType);
