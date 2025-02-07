import { createContext } from "react";
import { login } from "@/actions/auth";

export type AppError = {
  status?: number;
  message: string;
};

export type AppContextType = {
  // messaging
  errorMsg?: AppError | null;
  clearErrorMsg: () => void;
  handleError: (err: unknown) => void;
  // authentication
  isAuthenticated: boolean;
  login: typeof login;
};

export const AppContext = createContext({} as AppContextType);
