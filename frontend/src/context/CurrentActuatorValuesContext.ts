import type { CurrentActuatorValues } from '@/types/types';
import { createContext } from 'react';

export const CurrentActuatorValuesContext =
  createContext<CurrentActuatorValues>({
    heating: false,
    ventilation: false,
    lighting: false,
    alarm: false,
  });
