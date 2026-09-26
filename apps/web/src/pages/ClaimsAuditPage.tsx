import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import {
  ClaimsScrubberTable,
  EvidenceCitationDrawer,
  Spinner
} from '@hospyar/ui';
import { ClaimAuditRecord, CitationAnchor } from '@hospyar/shared-types';

export const ClaimsAuditPage: React.FC = () => {
  const [claim, setClaim] = useState<ClaimAuditRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCitation, setSelectedCitation] = useState<CitationAnchor | null>(null);

  useEffect(() => {
    async function loadClaim() {
      setIsLoading(true);
      try {
        const data = await apiClient.getClaimAudit();
        setClaim(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadClaim();
  }, []);

  if (isLoading || !claim) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Spinner size="lg" />
        <span>Scrubbing prior-authorization claims against clinical documentation...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClaimsScrubberTable
        claim={claim}
        onSelectCitation={(cit) => setSelectedCitation(cit)}
      />

      <EvidenceCitationDrawer
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  );
};
