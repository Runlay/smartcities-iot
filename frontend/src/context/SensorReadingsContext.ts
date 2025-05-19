import type { SensorReading } from '@/types/types';
import { createContext } from 'react';

export const SensorReadingsContext = createContext<SensorReading[]>([]);
