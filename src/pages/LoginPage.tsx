import React, { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import AuthSplitShell from "../components/auth/AuthSplitShell";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { DEMO_ACCOUNT_HINT } from "../services/authService";
import { DESIGN_IMAGE_ASSETS } from "../data/designPresets";

export default function LoginPage() {
  const { login, triggerGoogleUiNotice } = useAuth();
  const { setView } = useProject();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [googleNotice, setGoogleNotice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setGoogleNotice("");
    setLoading(true);

    const res = await login(email, password, rememberMe);
    setLoading(false);

    if (!res.ok) {
      setError(res.error || "Unable to sign in. Please verify your details.");
      return;
    }

    setSuccess(res.message || "Signed in. Redirecting to your SquareFootIQ dashboard...");
    setTimeout(() => {
      setView("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 550);
  };

  const handleGoogleClick = () => {
    setError("");
    const res = triggerGoogleUiNotice();
    setGoogleNotice(res.message || "");
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_ACCOUNT_HINT.email);
    setPassword(DEMO_ACCOUNT_HINT.password);
    setError("");
    setGoogleNotice("");
  };

  return (
    <AuthSplitShell
      eyebrow="SquareFootIQ · Member Access"
      title="Welcome Back"
      subtitle="Sign in to access your SquareFootIQ architectural dashboard, saved floor layouts, and construction estimates."
      imageSrc={DESIGN_IMAGE_ASSETS.luxuryVilla}
      imageCaption="SquareFootIQ Twilight Courtyard Villa · Reference Architectural Concept"
    >
      {/* Honest Frontend Demo Auth Banner */}
      <div className="rounded-xl border border-[#CDC4DC] bg-[#F3EEF8] p-3.5 text-xs text-[#4A3D5C] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#6E5A88] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#261E31]">Frontend Demo Authentication</p>
          <p className="leading-relaxed">
            Accounts run locally in your browser session only (not securely persisted on a server)
            and are modularly structured for Firebase or Supabase Auth integration.
          </p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-[#6E5A88] font-bold underline hover:opacity-80"
          >
            Fill Demo Account ({DEMO_ACCOUNT_HINT.email})
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#6E5A88] bg-[#CDC4DC]/30 px-4 py-3 text-xs text-[#261E31] flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-[#6E5A88] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-[#6E5A88] bg-[#F3EEF8] px-4 py-3 text-xs font-bold text-[#6E5A88] flex items-start gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {googleNotice && (
        <div
          role="status"
          className="rounded-xl border border-[#CDC4DC] bg-[#F3EEF8] px-4 py-3 text-xs text-[#4A3D5C] flex items-start gap-2"
        >
          <Info className="w-4 h-4 text-[#6E5A88] shrink-0 mt-0.5" />
          <span>{googleNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold text-[#6E5A88] mb-1.5">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#CDC4DC] px-4 py-3 text-sm bg-[#F3EEF8]/40 text-[#261E31] focus:outline-none focus:ring-2 focus:ring-[#6E5A88]"
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-bold text-[#6E5A88] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#CDC4DC] pl-4 pr-11 py-3 text-sm bg-[#F3EEF8]/40 text-[#261E31] focus:outline-none focus:ring-2 focus:ring-[#6E5A88]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4A3D5C] hover:text-[#6E5A88]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <label className="inline-flex items-center gap-2 text-[#261E31] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#6E5A88] rounded"
            />
            <span>Remember me (demo session)</span>
          </label>

          <button
            type="button"
            onClick={() => setView("forgot-password")}
            className="font-bold text-[#6E5A88] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6E5A88] text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? "Signing in to SquareFootIQ..." : "Login"}</span>
        </button>
      </form>

      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-[#CDC4DC]" />
        <span className="shrink mx-3 text-[11px] text-[#4A3D5C]">or</span>
        <div className="flex-grow border-t border-[#CDC4DC]" />
      </div>

      {/* Google Sign-In Button (UI Only until Auth Integration) */}
      <button
        type="button"
        onClick={handleGoogleClick}
        className="w-full py-3 px-4 rounded-xl border border-[#CDC4DC] bg-white hover:bg-[#F3EEF8] text-xs font-bold text-[#261E31] transition-colors flex items-center justify-center gap-2.5"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#6E5A88"
            d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.24-.92 2.29-1.97 2.99v2.48h3.18c1.86-1.71 2.69-4.24 2.69-7.24 0-.39-.04-.78-.1-1.15z"
          />
          <path
            fill="#4A3D5C"
            d="M12.18 21c2.66 0 4.9-.88 6.53-2.39l-3.18-2.48c-.88.59-2.01.95-3.35.95-2.57 0-4.75-1.74-5.53-4.08H3.38v2.56C5 18.78 8.33 21 12.18 21z"
          />
          <path
            fill="#907AA9"
            d="M6.65 13a5.88 5.88 0 0 1 0-3.77V6.67H3.38a9.82 9.82 0 0 0 0 8.89l3.27-2.56z"
          />
          <path
            fill="#261E31"
            d="M12.18 6.92c1.45 0 2.75.5 3.77 1.48l2.83-2.83C17.07 3.99 14.84 3 12.18 3 8.33 3 5 5.22 3.38 8.44l3.27 2.56c.78-2.34 2.96-4.08 5.53-4.08z"
          />
        </svg>
        <span>Continue with Google (UI Preview)</span>
      </button>

      <p className="text-center text-xs text-[#4A3D5C] pt-1">
        New to SquareFootIQ?{" "}
        <button
          type="button"
          onClick={() => setView("signup")}
          className="font-bold text-[#6E5A88] hover:underline"
        >
          Create an Account
        </button>
      </p>
    </AuthSplitShell>
  );
}
