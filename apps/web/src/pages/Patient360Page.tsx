import React from "react";
import { usePatient } from "../context/PatientContext";
import { useLocale } from "../context/LocaleContext";
import { Patient360Header, VitalMetricCard, Spinner, Badge } from "@hospyar/ui";
import { HeartPulse, Stethoscope, CheckCircle2 } from "lucide-react";
import { HomeTourHero } from "../components/molecules/HomeTourHero";
import { NavigationTab } from "../components/templates/MainLayout";

export interface Patient360PageProps {
  onOpenTour?: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const Patient360Page: React.FC<Patient360PageProps> = ({
  onOpenTour = () => {},
  onNavigateTab = () => {},
}) => {
  const { patient, isLoading } = usePatient();
  const { locale, isRTL } = useLocale();

  if (isLoading || !patient) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-[#6B8B99] font-mono text-xs">
        <Spinner size="lg" />
        <span>
          Loading unified Patient 360 profile from Snowflake Relational
          Tables...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive Home Tour Banner */}
      <HomeTourHero onStartTour={onOpenTour} onNavigateTab={onNavigateTab} />

      {/* Patient Header Organism */}
      <Patient360Header patient={patient} locale={locale} />

      {/* Real-time Vitals & Lab Trends */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#4F7C82]" />
            <h2 className="text-base font-bold text-[#0B2E33]">
              {isRTL
                ? "المؤشرات الحيوية والتحاليل المخبرية الفورية"
                : "Real-Time Vitals & Laboratory Trends"}
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6B8B99]">
            {patient.vitals.length} Tracked LOINC Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {patient.vitals.map((metric) => (
            <VitalMetricCard key={metric.id} metric={metric} locale={locale} />
          ))}
        </div>
      </div>

      {/* Chronic Conditions & Ontological Diagnoses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#93B1B5] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#93B1B5]/30">
            <Stethoscope className="w-5 h-5 text-[#4F7C82]" />
            <h3 className="text-sm font-bold text-[#0B2E33]">
              {isRTL
                ? "الحالات المزمنة وتشخيصات سنوميد (SNOMED CT)"
                : "Active Chronic Conditions (SNOMED CT Spine)"}
            </h3>
          </div>

          <div className="space-y-2.5">
            {patient.conditions.map((c) => (
              <div
                key={c.id}
                className="bg-[#F8FCFD] border border-[#93B1B5] hover:border-[#4F7C82] p-3.5 rounded-xl flex items-center justify-between gap-4 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#0B2E33]">
                    {isRTL && c.display_ar ? c.display_ar : c.display}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#6B8B99]">
                    <span>SNOMED: {c.snomed_code}</span>
                    <span>•</span>
                    <span>Onset: {c.onset_date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    {c.clinical_status}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#6B8B99]">
                    {c.verification_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance & Residency Audit Box */}
        <div className="bg-white border border-[#93B1B5] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#93B1B5]/30">
            <CheckCircle2 className="w-5 h-5 text-[#4F7C82]" />
            <h3 className="text-sm font-bold text-[#0B2E33]">
              {isRTL
                ? "الامتثال السيادي وحوكمة البيانات"
                : "GCC Sovereign Data Governance & Residency"}
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#0B2E33]">
            <div className="p-3 rounded-xl bg-[#F8FCFD] border border-[#93B1B5]">
              <span className="font-semibold text-[#0B2E33] block mb-0.5">
                UAE Federal Decree-Law No. 45 & KSA PDPL
              </span>
              <p className="text-[11px] text-[#6B8B99] leading-relaxed">
                All patient identifiers are cryptographically hashed and
                isolated within in-country availability zones. Zero patient
                information is transferred across regional borders.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FCFD] border border-[#93B1B5]">
              <span className="font-semibold text-[#0B2E33] block mb-0.5">
                HIE Gateway Interoperability
              </span>
              <p className="text-[11px] text-[#6B8B99] leading-relaxed">
                Seamless synchronization with Abu Dhabi Malaffi, Saudi NPHIES,
                Dubai NABIDH, and UAE Federal Riayati over mTLS and HL7 FHIR R4
                REST APIs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
