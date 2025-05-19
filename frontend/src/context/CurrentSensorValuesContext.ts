import type { CurrentSensorValues } from '@/types/types';
import { createContext } from 'react';

export const CurrentSensorValuesContext = createContext<CurrentSensorValues>({
  temperature: 0,
  humidity: 0,
  motion: false,
  pressure: 0,
});
