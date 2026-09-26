import React, { useState } from 'react';
import { LocaleProvider } from './context/LocaleContext';
import { PatientProvider } from './context/PatientContext';
import { MainLayout, NavigationTab } from './components/templates/MainLayout';
import { Patient360Page } from './pages/Patient360Page';
import { CopilotChatPage } from './pages/CopilotChatPage';
import { LongitudinalTimelinePage } from './pages/LongitudinalTimelinePage';
import { ClaimsAuditPage } from './pages/ClaimsAuditPage';
import { HIESyncPage } from './pages/HIESyncPage';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('patient360');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'patient360':
        return <Patient360Page />;
      case 'copilot':
        return <CopilotChatPage />;
      case 'timeline':
        return <LongitudinalTimelinePage />;
      case 'claims':
        return <ClaimsAuditPage />;
      case 'hie':
        return <HIESyncPage />;
      default:
        return <Patient360Page />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActivePage()}
    </MainLayout>
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
