import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import { LanguageSwitcher } from '@hospyar/ui';
import {
  Activity,
  Sparkles,
  Clock,
  Receipt,
  Network,
  ShieldCheck,
  Server
} from 'lucide-react';

export type NavigationTab = 'patient360' | 'copilot' | 'timeline' | 'claims' | 'hie';

export interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  const { locale, setLocale, isRTL } = useLocale();

  const navItems = [
    {
      id: 'patient360',
      label: 'Patient 360',
      labelArabic: 'ملف المريض الشامل',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'copilot',
      label: 'AI Copilot Q&A',
      labelArabic: 'المساعد الذكي',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'timeline',
      label: 'Longitudinal Timeline',
      labelArabic: 'الجدول الزمني التراكمي',
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: 'claims',
      label: 'Claims Scrubber',
      labelArabic: 'تدقيق المطالبات',
      icon: <Receipt className="w-4 h-4" />
    },
    {
      id: 'hie',
      label: 'GCC HIE Interop',
      labelArabic: 'الربط الصحي الخليجي',
      icon: <Network className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Top Sovereign Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">
                  HOSPYAR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                  SOVEREIGN AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                GCC Patient & Member 360 • UAE & KSA PDPL
              </p>
            </div>
          </div>

          {/* Center: In-Country Sovereign Boundary Indicator */}
          <div className="hidden md:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zone: UAE-CENTRAL-1 (Zero Cross-Border Egress)</span>
          </div>

          {/* Right: Controls & Language Switcher */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher
              currentLocale={locale}
              onLocaleChange={(loc) => setLocale(loc)}
            />
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/40 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id as NavigationTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {item.icon}
                <span>{isRTL ? item.labelArabic : item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/90 py-4 text-center text-xs text-slate-500 font-mono">
        Hospyar Sovereign AI Copilot • Built for GCC Health Information Systems (NPHIES, Malaffi, NABIDH, Riayati) • 100% Deterministic Citation Verification
      </footer>
    </div>
  );
};
