import math
import re
from typing import List, Dict, Tuple

class BM25RankerService:
    """
    Lexical BM25 ranker for clinical narrative chunks (MIMIC-IV / progress notes).
    Combines with dense vector embeddings for hybrid retrieval.
    """
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b

    def tokenize(self, text: str) -> List[str]:
        return re.findall(r"\b[a-zA-Z0-9_-]+\b", text.lower())

    def score_documents(self, query: str, documents: List[Dict[str, str]]) -> List[Tuple[Dict[str, str], float]]:
        query_tokens = self.tokenize(query)
        if not query_tokens or not documents:
            return [(doc, 0.0) for doc in documents]

        doc_tokens_list = [self.tokenize(doc.get("text", "")) for doc in documents]
        doc_lengths = [len(tokens) for tokens in doc_tokens_list]
        avg_doc_len = sum(doc_lengths) / (len(doc_lengths) or 1)
        num_docs = len(documents)

        # Calculate Doc Frequencies
        df: Dict[str, int] = {}
        for tokens in doc_tokens_list:
            seen = set(tokens)
            for token in seen:
                df[token] = df.get(token, 0) + 1

        scored = []
        for i, doc in enumerate(documents):
            score = 0.0
            tokens = doc_tokens_list[i]
            d_len = doc_lengths[i]
            tf_dict: Dict[str, int] = {}
            for t in tokens:
                tf_dict[t] = tf_dict.get(t, 0) + 1

            for q in query_tokens:
                if q in tf_dict:
                    freq = tf_dict[q]
                    doc_freq = df.get(q, 0)
                    idf = math.log((num_docs - doc_freq + 0.5) / (doc_freq + 0.5) + 1.0)
                    tf_component = (freq * (self.k1 + 1)) / (freq + self.k1 * (1 - self.b + self.b * (d_len / (avg_doc_len or 1))))
                    score += idf * tf_component

            scored.append((doc, round(score, 4)))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored
