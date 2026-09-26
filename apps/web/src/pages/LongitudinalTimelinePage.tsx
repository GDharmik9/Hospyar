import React, { useEffect, useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { useLocale } from '../context/LocaleContext';
import { apiClient } from '../services/api';
import { LongitudinalTimeline, Spinner } from '@hospyar/ui';
import { TimelineEvent } from '@hospyar/shared-types';

export const LongitudinalTimelinePage: React.FC = () => {
  const { patientId } = usePatient();
  const { locale } = useLocale();

  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      setIsLoading(true);
      try {
        const data = await apiClient.getTimeline(patientId);
        setEvents(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadTimeline();
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Spinner size="lg" />
        <span>Synchronizing multi-modal timeline events (Delta t relative offset)...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LongitudinalTimeline events={events} locale={locale} />
    </div>
  );
};
