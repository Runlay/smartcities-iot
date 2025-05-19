import type { currentActuatorValues } from '@/types/types';
import { createContext } from 'react';

export const CurrentActuatorValuesContext =
  createContext<currentActuatorValues>({
    heating: false,
    ventilation: false,
    lighting: false,
    alarm: false,
  });
