import React from "react";
import { useLocale } from "../../context/LocaleContext";
import { usePatient } from "../../context/PatientContext";
import { LanguageSwitcher } from "@hospyar/ui";
import {
  Activity,
  Sparkles,
  Clock,
  Receipt,
  Network,
  Server,
  Compass,
  Users,
} from "lucide-react";

export type NavigationTab =
  "patient360" | "copilot" | "timeline" | "claims" | "hie";

export interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenTour?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onOpenTour = () => {},
}) => {
  const { patientId, setPatientId } = usePatient();
  const { locale, setLocale, isRTL } = useLocale();

  const navItems = [
    {
      id: "patient360",
      label: "Patient 360",
      labelArabic: "ملف المريض الشامل",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: "copilot",
      label: "AI Copilot Q&A",
      labelArabic: "المساعد الذكي",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "timeline",
      label: "Longitudinal Timeline",
      labelArabic: "الجدول الزمني التراكمي",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "claims",
      label: "Claims Scrubber",
      labelArabic: "تدقيق المطالبات",
      icon: <Receipt className="w-4 h-4" />,
    },
    {
      id: "hie",
      label: "GCC HIE Interop",
      labelArabic: "الربط الصحي الخليجي",
      icon: <Network className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FCFD] text-[#0B2E33] flex flex-col font-sans">
      {/* Top Sovereign Header Bar in Deep Teal Navy (#0B2E33) */}
      <header className="border-b border-[#061D20] bg-[#0B2E33] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand with official icon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
              <img
                src="/images/4.png"
                alt="Hospyar Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">
                  HOSPYAR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7C82]/40 text-[#B8E3E9] border border-[#6B8B99]/40 font-semibold">
                  SOVEREIGN AI
                </span>
              </div>
              <p className="text-[10px] text-[#B8E3E9]/80 font-medium">
                GCC Patient & Member 360 • UAE & KSA PDPL
              </p>
            </div>
          </div>

          {/* Center: In-Country Sovereign Boundary Indicator */}
          <div className="hidden lg:flex items-center gap-2 bg-[#061D20]/90 border border-[#4F7C82]/50 px-3 py-1.5 rounded-lg text-xs font-mono text-[#B8E3E9]">
            <Server className="w-3.5 h-3.5 text-[#B8E3E9]" />
            <span>Zone: UAE-CENTRAL-1 (Zero Cross-Border Egress)</span>
          </div>

          {/* Right: Patient Selector, System Tour & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Patient Selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#061D20]/80 border border-[#4F7C82]/50 px-2 py-1 rounded-xl text-xs">
              <Users className="w-3.5 h-3.5 text-[#4F7C82]" />
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
                title="Select Demo Patient"
              >
                <option value="PAT-78921" className="bg-[#0B2E33] text-white">
                  🇦🇪 Tariq Al-Hashemi (UAE Malaffi)
                </option>
                <option value="PAT-10492" className="bg-[#0B2E33] text-white">
                  🇸🇦 Fatima Al-Otaibi (KSA NPHIES)
                </option>
              </select>
            </div>

            {/* System Tour Launcher Button */}
            <button
              type="button"
              onClick={onOpenTour}
              className="px-3 py-1.5 rounded-xl bg-[#4F7C82]/80 hover:bg-[#4F7C82] text-[#B8E3E9] hover:text-white border border-[#6B8B99]/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Open Interactive System Tour"
            >
              <Compass className="w-3.5 h-3.5 text-[#B8E3E9]" />
              <span>{isRTL ? "جولة تفاعلية" : "System Tour"}</span>
            </button>

            <LanguageSwitcher
              currentLocale={locale}
              onLocaleChange={(loc) => setLocale(loc)}
            />
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#4F7C82]/30 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id as NavigationTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#B8E3E9] text-white bg-[#4F7C82]/40"
                    : "border-transparent text-[#93B1B5] hover:text-white hover:bg-[#4F7C82]/20"
                }`}
              >
                {item.icon}
                <span>{isRTL ? item.labelArabic : item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area in Clean Clinical Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#93B1B5]/30 bg-white py-4 text-center text-xs text-[#6B8B99] font-mono">
        Hospyar Sovereign AI Copilot • Built for GCC Health Information Systems
        (NPHIES, Malaffi, NABIDH, Riayati) • 100% Deterministic Citation
        Verification
      </footer>
    </div>
  );
};
