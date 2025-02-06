import { login, logout } from "@/actions/auth";
import { useState } from "react";
import { AuthContext } from "./Auth";

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [isAuthenticated, _setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
