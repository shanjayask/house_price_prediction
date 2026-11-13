import React, { useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Info, Check } from "lucide-react";
import AuthSplitShell from "../components/auth/AuthSplitShell";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { evaluatePasswordStrength } from "../services/authService";
import { DESIGN_IMAGE_ASSETS } from "../data/designPresets";

export default function SignUpPage() {
  const { signup } = useAuth();
  const { setView } = useProject();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await signup({
      fullName,
      email,
      password,
      confirmPassword,
      acceptedTerms,
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.error || "Unable to create your demo account.");
      return;
    }

    setSuccess(res.message || "Account created. Redirecting to your SquareFootIQ dashboard...");
    setTimeout(() => {
      setView("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  return (
    <AuthSplitShell
      eyebrow="SquareFootIQ · Create Account"
      title="Begin Your Architectural Plan"
      subtitle="Register a SquareFootIQ demo profile to personalize your project dashboard, floor plans, and downloadable cost reports."
      imageSrc={DESIGN_IMAGE_ASSETS.heroVilla}
      imageCaption="SquareFootIQ Modern Courtyard Residence · Reference Visualization"
    >
      {/* Honest Frontend Demo Notice */}
      <div className="rounded-xl border border-[#CDC4DC] bg-[#F3EEF8] p-3.5 text-xs text-[#4A3D5C] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#6E5A88] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#261E31]">Demo Registration:</strong> Accounts created here work
          within this frontend browser session only and are not stored in a live backend database.
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="signup-name" className="block text-xs font-bold text-[#6E5A88] mb-1.5">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="e.g., Priya Nair"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-[#CDC4DC] px-4 py-3 text-sm bg-[#F3EEF8]/40 text-[#261E31] focus:outline-none focus:ring-2 focus:ring-[#6E5A88]"
            required
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-xs font-bold text-[#6E5A88] mb-1.5">
            Email Address
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="block text-xs font-bold text-[#6E5A88] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
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

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#4A3D5C]">Password Strength</span>
                <span className="font-bold text-[#6E5A88]">{strength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    key={segment}
                    className={`h-1.5 rounded-full transition-colors ${
                      strength.score >= segment ? "bg-[#6E5A88]" : "bg-[#CDC4DC]/60"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[#4A3D5C]">
                <span className="inline-flex items-center gap-1">
                  <Check
                    className={`w-3 h-3 ${
                      strength.checks.minLength ? "text-[#6E5A88]" : "text-[#CDC4DC]"
                    }`}
                  />
                  <span>8+ characters</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check
                    className={`w-3 h-3 ${
                      strength.checks.hasUpper && strength.checks.hasLower
                        ? "text-[#6E5A88]"
                        : "text-[#CDC4DC]"
                    }`}
                  />
                  <span>Upper &amp; lowercase</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check
                    className={`w-3 h-3 ${
                      strength.checks.hasNumber ? "text-[#6E5A88]" : "text-[#CDC4DC]"
                    }`}
                  />
                  <span>Contains a number</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check
                    className={`w-3 h-3 ${
                      strength.checks.hasSymbol ? "text-[#6E5A88]" : "text-[#CDC4DC]"
                    }`}
                  />
                  <span>Special symbol</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-confirm-password"
            className="block text-xs font-bold text-[#6E5A88] mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-[#CDC4DC] pl-4 pr-11 py-3 text-sm bg-[#F3EEF8]/40 text-[#261E31] focus:outline-none focus:ring-2 focus:ring-[#6E5A88]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4A3D5C] hover:text-[#6E5A88]"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-[#4A3D5C] cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#6E5A88] rounded shrink-0"
          />
          <span className="leading-relaxed">
            I understand that SquareFootIQ currently runs in frontend demo mode and accept the{" "}
            <span className="font-bold text-[#261E31]">Terms &amp; Conditions</span> for sample
            architectural and budget planning estimates.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6E5A88] text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? "Creating SquareFootIQ Account..." : "Create Account"}</span>
        </button>
      </form>

      <p className="text-center text-xs text-[#4A3D5C] pt-1">
        Already have a SquareFootIQ account?{" "}
        <button
          type="button"
          onClick={() => setView("login")}
          className="font-bold text-[#6E5A88] hover:underline"
        >
          Login
        </button>
      </p>
    </AuthSplitShell>
  );
}
