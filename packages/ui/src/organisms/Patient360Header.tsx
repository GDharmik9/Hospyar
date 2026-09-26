import React from 'react';
import { Patient360Header as PatientHeaderType } from '@hospyar/shared-types';
import { ShieldCheck, Building2 } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { cn } from '../lib/utils';

export interface Patient360HeaderProps {
  patient: PatientHeaderType;
  locale?: string;
  className?: string;
}

export const Patient360Header: React.FC<Patient360HeaderProps> = ({
  patient,
  locale = 'en-US',
  className
}) => {
  const isRTL = locale.startsWith('ar');
  const displayName = isRTL && patient.full_name_ar ? patient.full_name_ar : patient.full_name;

  return (
    <div
      className={cn(
        'bg-white border border-[#93B1B5] rounded-2xl p-6 shadow-sm relative overflow-hidden',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-l from-[#B8E3E9]/30 via-[#B8E3E9]/10 to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Patient Avatar & Demographics */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B2E33] flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-[#0B2E33]/20">
            {displayName.charAt(0)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#0B2E33] tracking-tight">
                {displayName}
              </h1>
              <Badge variant="success" size="sm">
                Active Encounter: {patient.active_encounter_id || 'ENC-40291'}
              </Badge>
              <Badge variant="default" size="sm">
                {patient.gender} • {patient.age} yrs
              </Badge>
              <Badge variant="purple" size="sm">
                Blood {patient.blood_type}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#6B8B99]">
              <span className="font-mono flex items-center gap-1 text-[#0B2E33]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F7C82]" />
                ID: {patient.national_id_hash}
              </span>
              <span className="flex items-center gap-1 font-mono text-[#0B2E33]">
                <Building2 className="w-3.5 h-3.5 text-[#4F7C82]" />
                HIE: {patient.regional_hie_id}
              </span>
              <span className="text-[#6B8B99] font-medium">
                {patient.insurance_provider} ({patient.policy_number})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Risk Trajectory & Scores */}
        <div className="flex items-center gap-4 bg-[#F8FCFD] p-3.5 rounded-xl border border-[#93B1B5]">
          <div className="text-center px-3 border-r border-[#93B1B5]/40">
            <span className="text-[10px] uppercase tracking-wider text-[#6B8B99] font-semibold block">
              30d Readmission
            </span>
            <span className="text-lg font-bold font-mono text-amber-600">
              {(patient.risk_score.readmission_30d * 100).toFixed(0)}%
            </span>
          </div>

          <div className="text-center px-3 border-r border-[#93B1B5]/40">
            <span className="text-[10px] uppercase tracking-wider text-[#6B8B99] font-semibold block">
              Mortality Risk
            </span>
            <span className="text-lg font-bold font-mono text-emerald-600">
              {(patient.risk_score.mortality_risk * 100).toFixed(0)}%
            </span>
          </div>

          <div className="text-center px-3">
            <span className="text-[10px] uppercase tracking-wider text-[#6B8B99] font-semibold block">
              Claim Denial
            </span>
            <span className="text-lg font-bold font-mono text-[#4F7C82]">
              {(patient.risk_score.claim_denial_probability * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
