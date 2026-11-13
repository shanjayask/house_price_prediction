import React, { createContext, useContext, useState } from "react";
import {
  clearDemoSession,
  getGoogleSignInUiNotice,
  loginWithEmailDemo,
  requestPasswordResetDemo,
  restoreDemoSession,
  signUpWithEmailDemo,
  type AuthResult,
  type AuthUser,
} from "../services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<AuthResult>;
  signup: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
  }) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  triggerGoogleUiNotice: () => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => restoreDemoSession());

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const res = await loginWithEmailDemo(email, password, rememberMe);
    if (res.ok && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const signup = async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
  }) => {
    const res = await signUpWithEmailDemo(payload);
    if (res.ok && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const requestPasswordReset = async (email: string) => {
    return requestPasswordResetDemo(email);
  };

  const triggerGoogleUiNotice = () => getGoogleSignInUiNotice();

  const logout = () => {
    clearDemoSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        requestPasswordReset,
        triggerGoogleUiNotice,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
