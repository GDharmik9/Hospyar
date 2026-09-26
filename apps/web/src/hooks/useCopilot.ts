import { useState } from 'react';
import { QueryResponseDTO, QueryRequestDTO } from '@hospyar/shared-types';
import { apiClient } from '../services/api';

export function useCopilot() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<QueryResponseDTO | null>(null);

  const query = async (req: QueryRequestDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.queryCopilot(req);
      setLastResponse(res);
      return res;
    } catch (err: any) {
      setError(err.message || 'Copilot query failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { query, isLoading, error, lastResponse };
}
