import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useProject, type AppView } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "../common/BrandLogo";

export default function TopNav() {
  const { view, setView, startNewProjectAtStep } = useProject();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links: { id: AppView; label: string }[] = [
    { id: "landing", label: "Home" },
    { id: "explore", label: "Explore Designs" },
    { id: "assistant", label: "AI Assistant" },
    { id: "price-check", label: "Price Predictor" },
    { id: "result", label: "Project Dashboard" },
  ];

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleNav = (id: AppView) => {
    setView(id);
    setMobileOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("")
    : "SQ";

  return (
    <header className="sticky top-0 z-40 bg-[#F3EEF8]/95 backdrop-blur-sm border-b border-[#CDC4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: SquareFootIQ architectural brand mark + wordmark */}
        <button
          type="button"
          onClick={() => handleNav("landing")}
          aria-label="SquareFootIQ Home"
          className="whitespace-nowrap shrink-0 text-left hover:opacity-90 transition-opacity"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: Clean single-line text links */}
        <nav
          className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm"
          aria-label="Primary Navigation"
        >
          {links.map((l) => {
            const active = view === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => handleNav(l.id)}
                className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
                  active
                    ? "text-[#6E5A88] font-bold border-b border-[#6E5A88]"
                    : "text-[#4A3D5C] hover:text-[#261E31]"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Auth Links / Profile Menu + Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav("login")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  view === "login"
                    ? "text-[#6E5A88] bg-[#CDC4DC]/40"
                    : "text-[#4A3D5C] hover:text-[#261E31]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNav("signup")}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  view === "signup"
                    ? "border-[#6E5A88] bg-[#CDC4DC]/35 text-[#6E5A88]"
                    : "border-[#CDC4DC] bg-white text-[#6E5A88] hover:bg-[#CDC4DC]/30"
                }`}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#CDC4DC] bg-white hover:bg-[#F3EEF8] transition-colors text-xs"
              >
                <span className="w-6 h-6 rounded-full bg-[#6E5A88] text-white font-bold flex items-center justify-center text-[11px]">
                  {initials}
                </span>
                <span className="font-bold text-[#261E31] max-w-[110px] truncate">
                  {user?.fullName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E5A88]" />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#CDC4DC] bg-white shadow-lg p-3 space-y-2 z-50"
                >
                  <div className="px-2 py-1.5 border-b border-[#CDC4DC]">
                    <p className="text-xs font-bold text-[#261E31] truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-[#4A3D5C] truncate">{user?.email}</p>
                    <p className="text-[10px] text-[#6E5A88] mt-0.5">Demo Session Active</p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNav("result")}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold text-[#261E31] hover:bg-[#F3EEF8] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#6E5A88]" />
                    <span>Project Dashboard</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold text-[#6E5A88] hover:bg-[#CDC4DC]/30 flex items-center gap-2 border-t border-[#CDC4DC]/60 pt-2.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
              startNewProjectAtStep(1);
            }}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-white bg-[#6E5A88] rounded-lg hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
          >
            Start Your Project
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg border border-[#CDC4DC] bg-white text-[#6E5A88] min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#CDC4DC] bg-[#F3EEF8] px-4 py-3 space-y-2">
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => handleNav(l.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm ${
                view === l.id
                  ? "bg-[#6E5A88] text-white font-bold"
                  : "bg-white text-[#261E31] border border-[#CDC4DC]"
              }`}
            >
              {l.label}
            </button>
          ))}

          {!isAuthenticated ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleNav("login")}
                className="py-2.5 px-4 rounded-lg border border-[#CDC4DC] bg-white text-[#261E31] text-sm font-bold"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNav("signup")}
                className="py-2.5 px-4 rounded-lg border border-[#6E5A88] bg-white text-[#6E5A88] text-sm font-bold"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-[#CDC4DC] bg-white p-3 space-y-2">
              <div className="text-xs">
                <p className="font-bold text-[#261E31]">{user?.fullName}</p>
                <p className="text-[#4A3D5C]">{user?.email} · Demo Session</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 px-3 rounded-lg bg-[#CDC4DC]/35 text-[#6E5A88] text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              startNewProjectAtStep(1);
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[#6E5A88] text-white text-sm font-bold"
          >
            Start Your Project
          </button>
        </div>
      )}
    </header>
  );
}

