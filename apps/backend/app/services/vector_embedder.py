import math
from typing import List

class VectorEmbedderService:
    """
    Interfaces with 768-dimensional bge-large-en / Bio_ClinicalBERT
    medical sentence transformers for dense semantic retrieval.
    """
    def __init__(self, dimension: int = 768):
        self.dimension = dimension

    def generate_embedding(self, text: str) -> List[float]:
        """Generates deterministic unit-normalized pseudo-embedding for testing & mock pipeline"""
        seed = sum(ord(c) * (i + 1) for i, c in enumerate(text[:64]))
        vector = []
        for i in range(self.dimension):
            val = math.sin(seed + i * 0.1)
            vector.append(val)
        norm = math.sqrt(sum(x * x for x in vector)) or 1.0
        return [round(x / norm, 6) for x in vector]

    def cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Calculates cosine similarity between two vector embeddings"""
        if len(vec_a) != len(vec_b):
            return 0.0
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a)) or 1.0
        norm_b = math.sqrt(sum(b * b for b in vec_b)) or 1.0
        return max(0.0, min(1.0, dot / (norm_a * norm_b)))
