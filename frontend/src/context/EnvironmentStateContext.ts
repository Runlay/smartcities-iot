import type { EnvironmentState } from '@/types/types';
import { createContext, useContext } from 'react';

export const EnvironmentStateContext = createContext<EnvironmentState | null>(
  null
);

export const useEnvironmentState = () => {
  const context = useContext(EnvironmentStateContext);
  if (!context) {
    throw new Error('EnvironmentStateContext not provided.');
  }
  return context;
};
