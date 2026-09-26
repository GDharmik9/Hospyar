import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { useLocale } from '../context/LocaleContext';
import { apiClient } from '../services/api';
import {
  CopilotChatPanel,
  TriFoldRetrievalInspector,
  EvidenceCitationDrawer
} from '@hospyar/ui';
import { CitationAnchor, RetrievalEvidenceItem } from '@hospyar/shared-types';

export const CopilotChatPage: React.FC = () => {
  const { patientId } = usePatient();
  const { locale } = useLocale();

  const [activeEvidence, setActiveEvidence] = useState<RetrievalEvidenceItem[]>([
    {
      id: 'CIT-001',
      route: 'Text2SQL',
      source_type: 'FHIR_OBSERVATION',
      reference: 'Observation/obs-89104#valueQuantity',
      excerpt: 'Exact Database Record: Fasting Blood Glucose: 142 mg/dL',
      relevance_score: 1.0
    },
    {
      id: 'CIT-002',
      route: 'Text2SQL',
      source_type: 'FHIR_OBSERVATION',
      reference: 'Observation/obs-89105#valueQuantity',
      excerpt: 'Exact Database Record: Hemoglobin A1c: 7.4%',
      relevance_score: 1.0
    },
    {
      id: 'CIT-003',
      route: 'VectorRAG',
      source_type: 'CLINICAL_NOTE',
      reference: 'Discharge_Summary/note-22104#span_120-145',
      excerpt: 'Patient Tariq Al-Hashemi presented with elevated fasting blood glucose (142 mg/dL)...',
      relevance_score: 0.94
    },
    {
      id: 'CIT-004',
      route: 'VectorRAG',
      source_type: 'CLINICAL_NOTE',
      reference: 'Consult_Note/note-33109#span_45-88',
      excerpt: 'Echocardiogram indicates normal left ventricular ejection fraction (LVEF 58%)...',
      relevance_score: 0.92
    }
  ]);

  const [selectedCitation, setSelectedCitation] = useState<CitationAnchor | null>(null);

  const handleQuery = async (queryText: string) => {
    const res = await apiClient.queryCopilot({
      patient_id: patientId,
      query_text: queryText,
      user_role: 'CLINICIAN',
      locale: locale as 'en-US' | 'ar-SA'
    });

    if (res.evidence_items && res.evidence_items.length > 0) {
      setActiveEvidence(res.evidence_items);
    }

    return res;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Copilot Chat Panel */}
        <div className="lg:col-span-8">
          <CopilotChatPanel
            onQuery={handleQuery}
            onSelectCitation={(cit) => setSelectedCitation(cit)}
            activeCitationId={selectedCitation?.citation_id}
            locale={locale}
          />
        </div>

        {/* Right Column: Tri-Fold Route Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <TriFoldRetrievalInspector
            evidenceItems={activeEvidence}
            onSelectCitation={(cit) => setSelectedCitation(cit)}
          />
        </div>
      </div>

      {/* Verbatim Proof Drawer */}
      <EvidenceCitationDrawer
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  );
};
