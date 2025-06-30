import { create } from 'zustand';
import type { EnvironmentConfiguration } from '@/types';
import { addMqttMessagehandler } from '@/lib/mqtt-client';

const INITIAL_CONFIGURATION_STATE: EnvironmentConfiguration = {
  temperature: {
    min: 18,
    max: 20,
  },
  humidity: {
    min: 40,
    max: 50,
  },
  motion: {
    lightDuration: 30,
  },
  pressure: {
    threshold: 100,
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

const handleConfigurationStateMessage = (topic: string, message: object) => {
  console.log('Reveived configuration state update:', message);

  if (topic === 'env/config') {
    useConfigurationStore
      .getState()
      .setConfiguration(message as EnvironmentConfiguration);
  }
};

addMqttMessagehandler('env/config', handleConfigurationStateMessage);
