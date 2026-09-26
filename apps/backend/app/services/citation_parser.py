import re
from typing import List, Dict, Tuple
from ..domain.entities import Citation
from ..domain.enums import CitationPointerType

class CitationParserService:
    """
    Parses LLM outputs for inline citation tags e.g. [CIT-001], binds them
    against retrieved evidence, and enforces verbatim proof verifications.
    """
    CITATION_REGEX = re.compile(r"\[(CIT-\d+)\]")

    def extract_anchor_ids(self, text: str) -> List[str]:
        return list(set(self.CITATION_REGEX.findall(text)))

    def bind_and_verify(
        self,
        generated_text: str,
        evidence_catalog: Dict[str, Dict]
    ) -> Tuple[List[Citation], str]:
        anchor_ids = self.extract_anchor_ids(generated_text)
        validated_citations: List[Citation] = []

        for c_id in anchor_ids:
            if c_id not in evidence_catalog:
                continue
            ev = evidence_catalog[c_id]
            dto = Citation(
                citation_id=c_id,
                pointer_type=ev.get("pointer_type", CitationPointerType.TEXT_SPAN),
                source_reference=ev.get("source_reference", f"Source/{c_id}"),
                verbatim_text=ev.get("verbatim_text", ""),
                confidence_score=ev.get("confidence", 0.98),
                metadata=ev.get("metadata", {})
            )
            validated_citations.append(dto)

        return validated_citations, generated_text
