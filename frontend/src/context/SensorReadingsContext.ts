import type { SensorReading } from '@/types/types';
import { createContext, useContext } from 'react';

export const SensorReadingsContext = createContext<SensorReading[] | null>(
  null
);

export const useSensorReadings = () => {
  const context = useContext(SensorReadingsContext);
  if (!context) {
    throw new Error('SensorReadingsContext not provided.');
  }
  return context;
};
