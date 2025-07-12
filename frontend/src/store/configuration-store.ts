import { create } from 'zustand';
import type { EnvironmentConfiguration } from '@/types';

const VITE_DEFAULT_TEMPERATURE_MIN =
  import.meta.env.VITE_DEFAULT_TEMPERATURE_MIN || '18';
const VITE_DEFAULT_TEMPERATURE_MAX =
  import.meta.env.VITE_DEFAULT_TEMPERATURE_MAX || '20';
const VITE_DEFAULT_HUMIDITY_MIN =
  import.meta.env.VITE_DEFAULT_HUMIDITY_MIN || '40';
const VITE_DEFAULT_HUMIDITY_MAX =
  import.meta.env.VITE_DEFAULT_HUMIDITY_MAX || '50';

const INITIAL_CONFIGURATION_STATE: EnvironmentConfiguration = {
  temperature: {
    min: parseFloat(VITE_DEFAULT_TEMPERATURE_MIN),
    max: parseFloat(VITE_DEFAULT_TEMPERATURE_MAX),
  },
  humidity: {
    min: parseFloat(VITE_DEFAULT_HUMIDITY_MIN),
    max: parseFloat(VITE_DEFAULT_HUMIDITY_MAX),
  },
};

interface ConfigurationStore {
  configuration: EnvironmentConfiguration;
  setConfiguration: (config: EnvironmentConfiguration) => void;
}

export const useConfigurationStore = create<ConfigurationStore>((set) => ({
  configuration: INITIAL_CONFIGURATION_STATE,
  setConfiguration: (config) =>
    set({
      configuration: {
        ...config,
      },
    }),
}));

export async function fetchLatestConfig() {
  // Wrap IPv6 address in brackets for proper URL formatting
  const url = '/api/config';

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.config) {
      useConfigurationStore.getState().setConfiguration(data.config);
    }
  } catch (error) {
    console.error('Error fetching latest configuration:', error);
  }
}
