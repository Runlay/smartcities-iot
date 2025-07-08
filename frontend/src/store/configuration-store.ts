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
const VITE_DEFAULT_MOTION_LIGHT_DURATION =
  import.meta.env.VITE_DEFAULT_MOTION_LIGHT_DURATION || '30';
const VITE_DEFAULT_PRESSURE_THRESHOLD =
  import.meta.env.VITE_DEFAULT_PRESSURE_THRESHOLD || '100';

const INITIAL_CONFIGURATION_STATE: EnvironmentConfiguration = {
  temperature: {
    min: parseFloat(VITE_DEFAULT_TEMPERATURE_MIN),
    max: parseFloat(VITE_DEFAULT_TEMPERATURE_MAX),
  },
  humidity: {
    min: parseFloat(VITE_DEFAULT_HUMIDITY_MIN),
    max: parseFloat(VITE_DEFAULT_HUMIDITY_MAX),
  },
  motion: {
    lightDuration: parseInt(VITE_DEFAULT_MOTION_LIGHT_DURATION),
  },
  pressure: {
    threshold: parseInt(VITE_DEFAULT_PRESSURE_THRESHOLD),
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
  const url = 'http://2a00:1e:bb80:9201:c4:5072:2ca5:65f7:8000/api/config';

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
