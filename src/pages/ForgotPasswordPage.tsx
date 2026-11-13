import React, { useState } from "react";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import AuthSplitShell from "../components/auth/AuthSplitShell";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { DESIGN_IMAGE_ASSETS } from "../data/designPresets";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const { setView } = useProject();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await requestPasswordReset(email);
    setLoading(false);

    if (!res.ok) {
      setError(res.error || "Please enter a valid email address.");
      return;
    }

    setSuccess(
      res.message ||
        "Demo reset requested. Connect Firebase or Supabase Auth to send real recovery emails."
    );
  };

  return (
    <AuthSplitShell
      eyebrow="SquareFootIQ · Account Recovery"
      title="Reset Your Password"
      subtitle="Enter the email address associated with your SquareFootIQ profile to request a password reset link."
      imageSrc={DESIGN_IMAGE_ASSETS.scandinavianHouse}
      imageCaption="SquareFootIQ Scandinavian Residence · Reference Architectural Visualization"
    >
      <div className="rounded-xl border border-[#CDC4DC] bg-[#F3EEF8] p-3.5 text-xs text-[#4A3D5C] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#6E5A88] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#261E31]">Demo Recovery Flow:</strong> No outbound email is sent
          until Firebase or Supabase Authentication is connected.
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
          className="rounded-xl border border-[#6E5A88] bg-[#F3EEF8] px-4 py-3 text-xs text-[#6E5A88] flex items-start gap-2 leading-relaxed"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="reset-email" className="block text-xs font-bold text-[#6E5A88] mb-1.5">
            Registered Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#CDC4DC] px-4 py-3 text-sm bg-[#F3EEF8]/40 text-[#261E31] focus:outline-none focus:ring-2 focus:ring-[#6E5A88]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6E5A88] text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? "Preparing Recovery Request..." : "Send Reset Link"}</span>
        </button>
      </form>

      <button
        type="button"
        onClick={() => setView("login")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E5A88] hover:underline pt-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Login</span>
      </button>
    </AuthSplitShell>
  );
}
