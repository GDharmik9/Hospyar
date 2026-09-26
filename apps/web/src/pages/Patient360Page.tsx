import React from 'react';
import { usePatient } from '../context/PatientContext';
import { useLocale } from '../context/LocaleContext';
import {
  Patient360Header,
  VitalMetricCard,
  Spinner,
  Badge
} from '@hospyar/ui';
import { HeartPulse, Stethoscope, CheckCircle2 } from 'lucide-react';

export const Patient360Page: React.FC = () => {
  const { patient, isLoading } = usePatient();
  const { locale, isRTL } = useLocale();

  if (isLoading || !patient) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Spinner size="lg" />
        <span>Loading unified Patient 360 profile from Snowflake Relational Tables...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Header Organism */}
      <Patient360Header patient={patient} locale={locale} />

      {/* Real-time Vitals & Lab Trends */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              {isRTL ? 'المؤشرات الحيوية والتحاليل المخبرية الفورية' : 'Real-Time Vitals & Laboratory Trends'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {patient.vitals.length} Tracked LOINC Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {patient.vitals.map((metric) => (
            <VitalMetricCard
              key={metric.id}
              metric={metric}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Chronic Conditions & Ontological Diagnoses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Stethoscope className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white">
              {isRTL ? 'الحالات المزمنة وتشخيصات سنوميد (SNOMED CT)' : 'Active Chronic Conditions (SNOMED CT Spine)'}
            </h3>
          </div>

          <div className="space-y-2.5">
            {patient.conditions.map((c) => (
              <div
                key={c.id}
                className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    {isRTL && c.display_ar ? c.display_ar : c.display}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                    <span>SNOMED: {c.snomed_code}</span>
                    <span>•</span>
                    <span>Onset: {c.onset_date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    {c.clinical_status}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-500">
                    {c.verification_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance & Residency Audit Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {isRTL ? 'الامتثال السيادي وحوكمة البيانات' : 'GCC Sovereign Data Governance & Residency'}
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                UAE Federal Decree-Law No. 45 & KSA PDPL
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All patient identifiers are cryptographically hashed and isolated within in-country availability zones. Zero patient information is transferred across regional borders.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-semibold text-cyan-400 block mb-0.5">
                HIE Gateway Interoperability
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Seamless synchronization with Abu Dhabi Malaffi, Saudi NPHIES, Dubai NABIDH, and UAE Federal Riayati over mTLS and HL7 FHIR R4 REST APIs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
