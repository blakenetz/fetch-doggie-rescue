import { login, logout } from "@/actions/auth";
import { useState } from "react";
import { AppContext, AppError } from "./App";

export default function AppProvider({ children }: React.PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    process.env.NODE_ENV === "development"
  );
  const [errorMsg, setErrorMsg] = useState<AppError | null>(null);

  const handleLogin: typeof login = async (formData) => {
    const res = await login(formData);
    setIsAuthenticated(res.ok);
    return res;
  };

  const handleError = (err: unknown) => {
    if (err instanceof Response) {
      if (err.status === 401) {
        setIsAuthenticated(false);
        logout();
      } else {
        setErrorMsg({
          status: err.status,
          message: err.statusText,
        });
      }
      return;
    }

    if (err instanceof Error) return setErrorMsg({ message: err.message });

    setErrorMsg({ message: "An unknown error occurred" });
  };

  return (
    <AppContext.Provider
      value={{
        errorMsg,
        clearErrorMsg: () => setErrorMsg(null),
        isAuthenticated,
        login: handleLogin,
        handleError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
