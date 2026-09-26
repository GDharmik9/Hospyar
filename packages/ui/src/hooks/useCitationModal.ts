import { useState } from 'react';
import { CitationAnchor } from '@hospyar/shared-types';

export function useCitationModal() {
  const [selectedCitation, setSelectedCitation] = useState<CitationAnchor | null>(null);

  const openCitation = (citation: CitationAnchor) => {
    setSelectedCitation(citation);
  };

  const closeCitation = () => {
    setSelectedCitation(null);
  };

  return {
    selectedCitation,
    openCitation,
    closeCitation,
    isOpen: selectedCitation !== null
  };
}
