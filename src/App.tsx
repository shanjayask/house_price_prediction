import React from "react";
import { ProjectProvider, useProject } from "./context/ProjectContext";
import TopNav from "./components/Layout/TopNav";
import LandingPage from "./pages/LandingPage";
import ProjectWizard from "./pages/ProjectWizard";
import ProjectSummary from "./pages/ProjectSummary";
import AIAssistantPage from "./pages/AIAssistantPage";
import FinalProjectResult from "./pages/FinalProjectResult";
import ExploreDesignsPage from "./pages/ExploreDesignsPage";
import HousePricePrediction from "./pages/HousePricePrediction";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import BrandLogo from "./components/common/BrandLogo";
import { AuthProvider } from "./context/AuthContext";

function MainWorkspace() {
  const { view, setView } = useProject();

  const renderView = () => {
    switch (view) {
      case "landing":
        return <LandingPage />;
      case "wizard":
        return <ProjectWizard />;
      case "summary":
        return <ProjectSummary />;
      case "assistant":
        return <AIAssistantPage />;
      case "result":
        return <FinalProjectResult />;
      case "explore":
        return <ExploreDesignsPage />;
      case "price-check":
        return <HousePricePrediction />;
      case "login":
        return <LoginPage />;
      case "signup":
        return <SignUpPage />;
      case "forgot-password":
        return <ForgotPasswordPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen blueprint-grid text-[#261E31] flex flex-col">
      <TopNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {renderView()}
      </main>
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 border-t border-[#CDC4DC] text-xs text-[#4A3D5C] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setView("landing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="hover:opacity-90 transition-opacity"
          >
            <BrandLogo size="sm" />
          </button>
          <span className="text-[#CDC4DC]">|</span>
          <span>Measure Your Land. Imagine Your Home. Build Your Future.</span>
        </div>
        <span>
          SquareFootIQ · Sample regional rates &amp; reference architectural visuals are clearly
          labelled.
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MainWorkspace />
      </ProjectProvider>
    </AuthProvider>
  );
}
