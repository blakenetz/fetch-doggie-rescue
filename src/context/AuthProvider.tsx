import { login, logout } from "@/actions/auth";
import { useState } from "react";
import { AuthContext } from "./Auth";

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      {children}
    </AuthContext.Provider>
  );
}
