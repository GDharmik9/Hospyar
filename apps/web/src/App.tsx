import React, { useState } from "react";
import { LocaleProvider } from "./context/LocaleContext";
import { PatientProvider } from "./context/PatientContext";
import { MainLayout, NavigationTab } from "./components/templates/MainLayout";
import { Patient360Page } from "./pages/Patient360Page";
import { CopilotChatPage } from "./pages/CopilotChatPage";
import { LongitudinalTimelinePage } from "./pages/LongitudinalTimelinePage";
import { ClaimsAuditPage } from "./pages/ClaimsAuditPage";
import { HIESyncPage } from "./pages/HIESyncPage";
import { SystemTourModal } from "./components/organisms/SystemTourModal";

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>("patient360");
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case "patient360":
        return (
          <Patient360Page
            onOpenTour={() => setIsTourOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case "copilot":
        return <CopilotChatPage />;
      case "timeline":
        return <LongitudinalTimelinePage />;
      case "claims":
        return <ClaimsAuditPage />;
      case "hie":
        return <HIESyncPage />;
      default:
        return (
          <Patient360Page
            onOpenTour={() => setIsTourOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <>
      <MainLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenTour={() => setIsTourOpen(true)}
      >
        {renderActivePage()}
      </MainLayout>

      <SystemTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <LocaleProvider>
      <PatientProvider>
        <AppContent />
      </PatientProvider>
    </LocaleProvider>
  );
};

export default App;
