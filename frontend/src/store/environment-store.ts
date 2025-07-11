import { addMqttMessagehandler } from '@/lib/mqtt-client';
import type {
  EnvironmentState,
  SensorType,
  ActuatorType,
  SensorData,
  ActuatorData,
} from '@/types';
import { create } from 'zustand';

const timestamp = new Date().toISOString();

const INITIAL_ENVIRONMENT_STATE: EnvironmentState = {
  sensors: {},
  actuators: {
    ac: { type: 'ac', state: 'OFF', timestamp: timestamp },
    ventilation: {
      type: 'ventilation',
      state: 'OFF',
      timestamp: timestamp,
    },
    light: { type: 'light', state: 'OFF', timestamp: timestamp },
    alarm: { type: 'alarm', state: 'OFF', timestamp: timestamp },
  },
};

interface EnvironmentStore {
  environmentState: EnvironmentState;
  setSensorState: (sensorType: SensorType, data: SensorData) => void;
  setActuatorState: (actuatorType: ActuatorType, data: ActuatorData) => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environmentState: INITIAL_ENVIRONMENT_STATE,
  setSensorState: (sensorType, data) =>
    set((state) => ({
      environmentState: {
        ...state.environmentState,
        sensors: {
          ...state.environmentState.sensors,
          [sensorType]: data, // Replace the whole sensor data
        },
      },
    })),
  setActuatorState: (actuatorType, data) =>
    set((state) => ({
      environmentState: {
        ...state.environmentState,
        actuators: {
          ...state.environmentState.actuators,
          [actuatorType]: data, // Replace the whole actuator data
        },
      },
    })),
}));

// Subscribe to individual sensor topics
const SENSOR_TYPES: SensorType[] = [
  'temperature',
  'humidity',
  'motion',
  'pressure',
];
SENSOR_TYPES.forEach((type) => {
  addMqttMessagehandler(`sensor/${type}`, (_: string, message) => {
    useEnvironmentStore.getState().setSensorState(type, message as SensorData);
  });
});

interface ActuatorMqttMessage {
  state: string;
  timestamp: string;
}

// Subscribe to individual actuator state topics
const ACTUATOR_TYPES: ActuatorType[] = ['ac', 'ventilation', 'light', 'alarm'];
ACTUATOR_TYPES.forEach((type) => {
  addMqttMessagehandler(
    `actuator/${type}/state`,
    (_: string, message: object) => {
      const actuatorMessage = message as ActuatorMqttMessage;
      const transformedData: ActuatorData = {
        type,
        state: actuatorMessage.state as 'ON' | 'OFF',
        timestamp: actuatorMessage.timestamp,
      };
      useEnvironmentStore.getState().setActuatorState(type, transformedData);
    }
  );
});
