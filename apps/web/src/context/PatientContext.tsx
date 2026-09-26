import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Patient360Header } from "@hospyar/shared-types";
import { apiClient } from "../services/api";

interface PatientContextType {
  patient: Patient360Header | null;
  patientId: string;
  setPatientId: (id: string) => void;
  isLoading: boolean;
  reloadPatient: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [patientId, setPatientId] = useState<string>("PAT-78921");
  const [patient, setPatient] = useState<Patient360Header | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPatient = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getPatient360(patientId);
      setPatient(data);
    } catch {
      setPatient(null);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    let isSubscribed = true;
    const load = async () => {
      try {
        const data = await apiClient.getPatient360(patientId);
        if (isSubscribed) {
          setPatient(data);
        }
      } catch {
        if (isSubscribed) {
          setPatient(null);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      isSubscribed = false;
    };
  }, [patientId]);

  return (
    <PatientContext.Provider
      value={{
        patient,
        patientId,
        setPatientId,
        isLoading,
        reloadPatient: fetchPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};
