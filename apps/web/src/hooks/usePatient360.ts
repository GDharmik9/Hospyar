import { useState, useEffect } from "react";
import { Patient360Header } from "@hospyar/shared-types";
import { apiClient } from "../services/api";

export function usePatient360(patientId: string = "PAT-78921") {
  const [patient, setPatient] = useState<Patient360Header | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    async function fetch() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient.getPatient360(patientId);
        if (isSubscribed) {
          setPatient(data);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const message =
            err instanceof Error ? err.message : "Failed to load patient 360";
          setError(message);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }
    fetch();
    return () => {
      isSubscribed = false;
    };
  }, [patientId]);

  return { patient, isLoading, error };
}
