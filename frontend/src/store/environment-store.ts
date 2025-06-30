import { addMqttMessagehandler } from '@/lib/mqtt-client';
import type { EnvironmentState } from '@/types';
import { create } from 'zustand';

const INITIAL_ENVIRONMENT_STATE: EnvironmentState = {
  sensors: {
    temperature: {
      value: '20',
      unit: '°C',
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'sensor-1',
    },
    humidity: {
      value: '50',
      unit: '%',
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'sensor-2',
    },
    motion: {
      value: 'false',
      unit: '',
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'sensor-3',
    },
    pressure: {
      value: '100',
      unit: 'kg',
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'sensor-4',
    },
  },
  actuators: {
    ac: {
      isOn: false,
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'actuator-1',
    },
    ventilation: {
      isOn: false,
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'actuator-2',
    },
    light: {
      isOn: false,
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'actuator-3',
    },
    pressure: {
      isOn: false,
      timestamp: '2023-10-01T12:00:00Z',
      instanceId: 'actuator-4',
    },
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
