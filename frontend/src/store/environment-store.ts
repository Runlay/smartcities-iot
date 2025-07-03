import { addMqttMessagehandler } from '@/lib/mqtt-client';
import type { EnvironmentState } from '@/types';
import { create } from 'zustand';

const timestamp = new Date().toISOString();

const INITIAL_ENVIRONMENT_STATE: EnvironmentState = {
  sensors: {},
  actuators: {
    ac: { isOn: 'OFF', timestamp: timestamp, instanceId: 'default-ac' },
    ventilation: {
      isOn: 'OFF',
      timestamp: timestamp,
      instanceId: 'default-ventilation',
    },
    light: { isOn: 'OFF', timestamp: timestamp, instanceId: 'default-light' },
    alarm: { isOn: 'OFF', timestamp: timestamp, instanceId: 'default-alarm' },
  },
};

interface EnvironmentStore {
  environmentState: EnvironmentState;
  setEnvironmentState: (newState: EnvironmentState) => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environmentState: INITIAL_ENVIRONMENT_STATE,
  setEnvironmentState: (newState: EnvironmentState) =>
    set({ environmentState: newState }),
}));

const handleEnvironmentStateMessage = (topic: string, message: object) => {
  console.log('Reveived environment state update:', message);

  if (topic === 'env/state') {
    useEnvironmentStore
      .getState()
      .setEnvironmentState(message as EnvironmentState);
  }
};

addMqttMessagehandler('env/state', handleEnvironmentStateMessage);
