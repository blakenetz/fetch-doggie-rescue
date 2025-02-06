import { createContext } from "react";

export type AppContextType = {
  errorMsg?: string;
  setErrorMsg: (msg: string) => void;
};

export const AppContext = createContext({} as AppContextType);
