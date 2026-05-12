import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearStoredAuth,
  demoUser,
  getTokenExpiresAt,
  getValidStoredAuth,
  isTokenExpired,
  login,
  normalizeUser,
  register,
  storeAuth,
} from "../services/authService";

const AuthContext = createContext(null);

export function AppProviders({ children }) {
  const storedAuth = getValidStoredAuth();
  const [authState, setAuthState] = useState({
    token: storedAuth?.token || null,
    user: normalizeUser(storedAuth?.user || demoUser),
    isAuthenticated: Boolean(storedAuth?.isAuthenticated || storedAuth?.token),
  });

  const resetAuthState = useCallback(() => {
    clearStoredAuth();
    setAuthState({
      token: null,
      user: normalizeUser(demoUser),
      isAuthenticated: false,
    });
  }, []);

  const completeOAuthLogin = useCallback((auth) => {
    const nextAuth = {
      token: auth?.token || null,
      user: normalizeUser(auth?.user),
      isAuthenticated: true,
    };
    storeAuth(nextAuth);
    setAuthState(nextAuth);
    return nextAuth;
  }, []);

  useEffect(() => {
    if (!authState.token) return undefined;

    if (isTokenExpired(authState.token)) {
      resetAuthState();
      return undefined;
    }

    const expiresInMs = Math.max(getTokenExpiresAt(authState.token) - Date.now() - 30000, 0);
    const timeoutId = window.setTimeout(resetAuthState, expiresInMs);

    return () => window.clearTimeout(timeoutId);
  }, [authState.token, resetAuthState]);

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
      completeOAuthLogin,
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
        resetAuthState();
      },
    }),
    [authState, completeOAuthLogin, resetAuthState]
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
