import type { CurrentSensorValues } from '@/types/types';
import { createContext, useContext } from 'react';

export const CurrentSensorValuesContext =
  createContext<CurrentSensorValues | null>(null);

export const useCurrentSensorValues = () => {
  const context = useContext(CurrentSensorValuesContext);
  if (!context) {
    throw new Error('CurrentSensorValuesContex not provided');
  }
  return context;
};
