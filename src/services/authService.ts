/**
 * Modular Frontend Demo Authentication Service for SquareFootIQ.
 *
 * Clearly labelled frontend-only demo authentication. Does NOT claim secure
 * server-side credential storage. Designed with a clean AuthAdapter interface
 * so Firebase Auth or Supabase Auth can replace this module cleanly later.
 */

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  provider: "demo";
  createdAt: string;
}

export interface AuthResult {
  ok: boolean;
  user?: AuthUser;
  error?: string;
  message?: string;
  isUiOnly?: boolean;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Too Short" | "Weak" | "Fair" | "Good" | "Strong";
  checks: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
}

interface DemoAccountRecord {
  id: string;
  fullName: string;
  email: string;
  passwordCheck: string; // Stored strictly in volatile memory for demo session only
  createdAt: string;
}

const SESSION_KEY = "squarefootiq_demo_auth_session_v1";

// In-memory demo registry (volatile; never writes passwords to browser storage)
const inMemoryDemoUsers = new Map<string, DemoAccountRecord>([
  [
    "demo@squarefootiq.app",
    {
      id: "demo-user-01",
      fullName: "Aarav Mehta",
      email: "demo@squarefootiq.app",
      passwordCheck: "SquareFoot2026!",
      createdAt: "2026-11-01",
    },
  ],
]);

export const DEMO_ACCOUNT_HINT = {
  email: "demo@squarefootiq.app",
  password: "SquareFoot2026!",
};

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  if (password.length < 6) {
    return { score: 0, label: "Too Short", checks };
  }

  let points = 0;
  if (checks.minLength) points += 1;
  if (checks.hasUpper && checks.hasLower) points += 1;
  if (checks.hasNumber) points += 1;
  if (checks.hasSymbol) points += 1;

  const score = Math.min(4, Math.max(1, points)) as 1 | 2 | 3 | 4;
  const labels: Record<1 | 2 | 3 | 4, PasswordStrength["label"]> = {
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  return { score, label: labels[score], checks };
}

export function restoreDemoSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && parsed.email && parsed.fullName) {
      return parsed;
    }
  } catch {
    // Ignore browser storage errors
  }
  return null;
}

function persistDemoSession(user: AuthUser, rememberMe: boolean) {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    const serialized = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, serialized);
    } else {
      sessionStorage.setItem(SESSION_KEY, serialized);
    }
  } catch {
    // Ignore browser storage errors
  }
}

export function clearDemoSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore browser storage errors
  }
}

export async function loginWithEmailDemo(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 450));

  const normalizedEmail = email.trim().toLowerCase();
  if (!validateEmail(normalizedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!password) {
    return { ok: false, error: "Please enter your password." };
  }

  const record = inMemoryDemoUsers.get(normalizedEmail);
  if (!record || record.passwordCheck !== password) {
    return {
      ok: false,
      error:
        "Invalid email or password for this demo session. Try demo@squarefootiq.app / SquareFoot2026! or create a new demo account.",
    };
  }

  const user: AuthUser = {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    provider: "demo",
    createdAt: record.createdAt,
  };

  persistDemoSession(user, rememberMe);
  return {
    ok: true,
    user,
    message: `Welcome back, ${user.fullName}. Redirecting to your SquareFootIQ dashboard...`,
  };
}

export async function signUpWithEmailDemo(payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 500));

  const trimmedName = payload.fullName.trim();
  const normalizedEmail = payload.email.trim().toLowerCase();

  if (trimmedName.length < 2) {
    return { ok: false, error: "Please enter your full name (at least 2 characters)." };
  }
  if (!validateEmail(normalizedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (payload.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters long." };
  }
  if (payload.password !== payload.confirmPassword) {
    return { ok: false, error: "Passwords do not match. Please re-enter carefully." };
  }
  if (!payload.acceptedTerms) {
    return { ok: false, error: "Please accept the Terms and Conditions to continue." };
  }
  if (inMemoryDemoUsers.has(normalizedEmail)) {
    return {
      ok: false,
      error: "An account with this email already exists in the demo registry. Please log in instead.",
    };
  }

  const newRecord: DemoAccountRecord = {
    id: `demo-user-${Date.now()}`,
    fullName: trimmedName,
    email: normalizedEmail,
    passwordCheck: payload.password,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  inMemoryDemoUsers.set(normalizedEmail, newRecord);

  const user: AuthUser = {
    id: newRecord.id,
    fullName: newRecord.fullName,
    email: newRecord.email,
    provider: "demo",
    createdAt: newRecord.createdAt,
  };

  persistDemoSession(user, false);
  return {
    ok: true,
    user,
    message: `Demo account created for ${user.fullName}. Redirecting to your SquareFootIQ dashboard...`,
  };
}

export async function requestPasswordResetDemo(email: string): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 420));

  const normalizedEmail = email.trim().toLowerCase();
  if (!validateEmail(normalizedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  return {
    ok: true,
    message: `Frontend Demo Notice: No real email was sent to ${normalizedEmail}. Once Firebase or Supabase Auth is connected, a secure password reset link will be emailed here.`,
  };
}

export function getGoogleSignInUiNotice(): AuthResult {
  return {
    ok: false,
    isUiOnly: true,
    message:
      "Google Sign-In is UI-ready only in this frontend demo. Connect Firebase Authentication or Supabase Auth to enable live Google OAuth.",
  };
}
