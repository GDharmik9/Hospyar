import React, { useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import { usePatient } from "../../context/PatientContext";
import { NavigationTab } from "../templates/MainLayout";
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Binary,
  Receipt,
  Network,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";

export interface HomeTourHeroProps {
  onStartTour: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const HomeTourHero: React.FC<HomeTourHeroProps> = ({
  onStartTour,
  onNavigateTab,
}) => {
  const { isRTL } = useLocale();
  const { patientId, setPatientId } = usePatient();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-gradient-to-r from-[#0B2E33] via-[#0B2E33] to-[#164349] text-white rounded-2xl p-5 shadow-lg border border-[#4F7C82]/40 relative overflow-hidden">
      {/* Decorative Sovereign Glow */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#B8E3E9]/10 via-[#4F7C82]/20 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header Row with Expand/Collapse */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F7C82] flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-[#B8E3E9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {isRTL
                    ? "دليل جولة هوسبيار التفاعلي"
                    : "Welcome to Hospyar Sovereign AI Copilot"}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7C82]/80 text-[#B8E3E9] font-bold">
                  {isRTL ? "نظام الفحص السريري" : "INTERACTIVE TOUR"}
                </span>
              </div>
              <p className="text-xs text-[#B8E3E9]/80 font-medium">
                {isRTL
                  ? "منصة سريرية موحدة لحوكمة الرعاية الصحية في دول مجلس التعاون الخليجي"
                  : "Enterprise Multi-Modal Patient 360 & Sovereign Clinical Copilot"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onStartTour}
              className="px-4 py-2 rounded-xl bg-[#4F7C82] hover:bg-[#B8E3E9] hover:text-[#0B2E33] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>
                {isRTL
                  ? "بدء الجولة التفاعلية (٥ خطوات)"
                  : "Start Guided Tour (5 Steps)"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#B8E3E9] transition-colors cursor-pointer"
              title={isExpanded ? "Collapse Tour Card" : "Expand Tour Card"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Content Body */}
        {isExpanded && (
          <div className="space-y-4 pt-2 border-t border-[#4F7C82]/30">
            {/* 3 Core Architecture Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#061D20]/70 border border-[#4F7C82]/40 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[#B8E3E9] font-bold">
                  <Binary className="w-4 h-4 text-[#4F7C82]" />
                  <span>1. Tri-Fold HybridRAG</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Routes queries across VectorRAG (clinical notes), GraphRAG
                  (SNOMED CT), and Text2SQL (exact Snowflake metrics).
                </p>
              </div>

              <div className="bg-[#061D20]/70 border border-[#4F7C82]/40 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[#B8E3E9] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#4F7C82]" />
                  <span>2. Verbatim Citations</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Every AI assertion links to an immutable anchor{" "}
                  <span className="font-mono text-[#B8E3E9]">[CIT-xxx]</span>{" "}
                  with direct FHIR resource pointers.
                </p>
              </div>

              <div className="bg-[#061D20]/70 border border-[#4F7C82]/40 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[#B8E3E9] font-bold">
                  <Network className="w-4 h-4 text-[#4F7C82]" />
                  <span>3. Zero Data Egress</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Fully compliant with UAE PDPL Law No. 45 & Saudi PDPL. All LLM
                  inferences remain within UAE-CENTRAL-1.
                </p>
              </div>
            </div>

            {/* Quick Interactive Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Patient Toggle Shortcut */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#B8E3E9] font-mono flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#4F7C82]" />
                  Active Demo Patient:
                </span>
                <div className="inline-flex rounded-lg bg-[#061D20] p-1 border border-[#4F7C82]/50">
                  <button
                    type="button"
                    onClick={() => setPatientId("PAT-78921")}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      patientId === "PAT-78921"
                        ? "bg-[#4F7C82] text-white"
                        : "text-[#93B1B5] hover:text-white"
                    }`}
                  >
                    🇦🇪 Tariq (UAE)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientId("PAT-10492")}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      patientId === "PAT-10492"
                        ? "bg-[#4F7C82] text-white"
                        : "text-[#93B1B5] hover:text-white"
                    }`}
                  >
                    🇸🇦 Fatima (KSA)
                  </button>
                </div>
              </div>

              {/* Direct Jump Shortcuts */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab("copilot")}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#B8E3E9] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#B8E3E9]" />
                  <span>Ask AI Copilot</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab("claims")}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#B8E3E9] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Receipt className="w-3 h-3 text-[#B8E3E9]" />
                  <span>Inspect Claims</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab("hie")}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#B8E3E9] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Network className="w-3 h-3 text-[#B8E3E9]" />
                  <span>Check HIE Sync</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
