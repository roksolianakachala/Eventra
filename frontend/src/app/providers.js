import { createContext, useContext, useMemo, useState } from "react";
import {
  clearStoredAuth,
  demoUser,
  getStoredAuth,
  login,
  normalizeUser,
  register,
  storeAuth,
} from "../services/authService";

const AuthContext = createContext(null);

export function AppProviders({ children }) {
  const storedAuth = getStoredAuth();
  const [authState, setAuthState] = useState({
    token: storedAuth?.token || null,
    user: normalizeUser(storedAuth?.user || demoUser),
    isAuthenticated: Boolean(storedAuth?.isAuthenticated || storedAuth?.token),
  });

  const value = useMemo(
    () => ({
      ...authState,
      isAuthenticated: Boolean(authState.isAuthenticated || authState.token),
      async loginUser(credentials) {
        const nextAuth = await login(credentials);
        storeAuth(nextAuth);
        setAuthState(nextAuth);
        return nextAuth;
      },
      async registerUser(formData) {
        const nextAuth = await register(formData);
        storeAuth(nextAuth);
        setAuthState(nextAuth);
        return nextAuth;
      },
      updateUser(userUpdates) {
        setAuthState((current) => {
          const nextAuth = {
            ...current,
            user: normalizeUser({ ...current.user, ...userUpdates }),
            isAuthenticated: Boolean(current.isAuthenticated || current.token),
          };
          storeAuth(nextAuth);
          return nextAuth;
        });
      },
      logoutUser() {
        clearStoredAuth();
        setAuthState({
          token: null,
          user: normalizeUser(demoUser),
          isAuthenticated: false,
        });
      },
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AppProviders");
  }

  return context;
}
