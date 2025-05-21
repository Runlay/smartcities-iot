import type { CurrentActuatorValues } from '@/types/types';
import { createContext, useContext } from 'react';

export const CurrentActuatorValuesContext =
  createContext<CurrentActuatorValues | null>(null);

export const useCurrentActuatorValues = () => {
  const context = useContext(CurrentActuatorValuesContext);
  if (!context) {
    throw new Error('CurrentActuatorValuesContex not provided');
  }
  return context;
};
