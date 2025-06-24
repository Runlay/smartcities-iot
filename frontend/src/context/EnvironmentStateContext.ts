import type { EnvironmentState } from '@/types/types';
import React, { createContext, useContext } from 'react';

type EnvironmentStateContextType = {
  environmentState: EnvironmentState;
  setEnvironmentState: React.Dispatch<React.SetStateAction<EnvironmentState>>;
};

export const EnvironmentStateContext =
  createContext<EnvironmentStateContextType | null>(null);

export const useEnvironmentState = () => {
  const context = useContext(EnvironmentStateContext);
  if (!context) {
    throw new Error('EnvironmentStateContext not provided.');
  }
  return context;
};
