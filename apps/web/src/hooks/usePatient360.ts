import { useState, useEffect } from 'react';
import { Patient360Header } from '@hospyar/shared-types';
import { apiClient } from '../services/api';

export function usePatient360(patientId: string = 'PAT-78921') {
  const [patient, setPatient] = useState<Patient360Header | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient.getPatient360(patientId);
        setPatient(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load patient 360');
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [patientId]);

  return { patient, isLoading, error };
}
