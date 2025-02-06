import { login, logout } from "@/actions/auth";
import { useState } from "react";
import { AppContext } from "./App";
import { AuthContext } from "./Auth";

export default function AppProvider({ children }: React.PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin: typeof login = async (formData) => {
    const res = await login(formData);
    setIsAuthenticated(res.ok);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: handleLogin,
        logout,
      }}
    >
      <AppContext.Provider
        value={{
          errorMsg,
          setErrorMsg,
        }}
      >
        {children}
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}
