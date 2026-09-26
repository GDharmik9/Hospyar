import networkx as nx
from typing import List, Dict, Any

class GraphTraverserService:
    """
    NetworkX-based Ontological Knowledge Graph engine.
    Traverses parent-child hierarchies in SNOMED CT, LOINC, and ICD-10 ontologies
    to prevent semantic drift and enable exact hierarchical queries.
    """
    def __init__(self):
        self.graph = nx.DiGraph()
        self._initialize_seed_ontologies()

    def _initialize_seed_ontologies(self):
        # Diabetes Mellitus hierarchy (SNOMED CT)
        self.graph.add_node("73211009", label="Diabetes mellitus", code="73211009", vocabulary="SNOMED-CT")
        self.graph.add_node("44054006", label="Type 2 diabetes mellitus", code="44054006", vocabulary="SNOMED-CT")
        self.graph.add_node("46635009", label="Type 1 diabetes mellitus", code="46635009", vocabulary="SNOMED-CT")
        self.graph.add_node("90708001", label="Kidney disease due to diabetes", code="90708001", vocabulary="SNOMED-CT")
        
        self.graph.add_edge("73211009", "44054006", relation="IS_A")
        self.graph.add_edge("73211009", "46635009", relation="IS_A")
        self.graph.add_edge("44054006", "90708001", relation="HAS_COMPLICATION")

        # Hypertension & Cardiovascular
        self.graph.add_node("38341003", label="Hypertensive disorder", code="38341003", vocabulary="SNOMED-CT")
        self.graph.add_node("1201005", label="Benign essential hypertension", code="1201005", vocabulary="SNOMED-CT")
        self.graph.add_edge("38341003", "1201005", relation="IS_A")

        # LOINC Laboratory hierarchy
        self.graph.add_node("4548-4", label="Hemoglobin A1c", code="4548-4", vocabulary="LOINC")
        self.graph.add_node("1558-6", label="Fasting Blood Glucose", code="1558-6", vocabulary="LOINC")
        self.graph.add_edge("73211009", "4548-4", relation="MONITORED_BY_LAB")
        self.graph.add_edge("73211009", "1558-6", relation="MONITORED_BY_LAB")

    def get_related_concepts(self, code_or_label: str) -> List[Dict[str, Any]]:
        target_node = None
        for n, data in self.graph.nodes(data=True):
            if n == code_or_label or data.get("label", "").lower() == code_or_label.lower():
                target_node = n
                break

        if not target_node:
            return []

        results = []
        for successor in self.graph.successors(target_node):
            edge_data = self.graph.get_edge_data(target_node, successor) or {}
            node_data = self.graph.nodes[successor]
            results.append({
                "code": successor,
                "label": node_data.get("label"),
                "relation": edge_data.get("relation", "ASSOCIATED_WITH"),
                "vocabulary": node_data.get("vocabulary")
            })
        return results

    def expand_query_terms(self, query_text: str) -> List[str]:
        expanded = []
        q_lower = query_text.lower()
        for node, data in self.graph.nodes(data=True):
            label = data.get("label", "").lower()
            if label in q_lower or data.get("code") in query_text:
                for sub in self.graph.successors(node):
                    expanded.append(self.graph.nodes[sub].get("label", ""))
        return list(set(filter(None, expanded)))
