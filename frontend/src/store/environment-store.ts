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
  timestamp?: string;
  instanceId?: string;
}

// Subscribe to individual actuator state topics
const ACTUATOR_TYPES: ActuatorType[] = ['ac', 'ventilation', 'light', 'alarm'];
ACTUATOR_TYPES.forEach((type) => {
  addMqttMessagehandler(
    `actuator/${type}/state`,
    (_: string, message: object) => {
      const actuatorMessage = message as ActuatorMqttMessage;
      const initial = INITIAL_ENVIRONMENT_STATE.actuators[type];
      const transformedData = {
        type,
        isOn: actuatorMessage.state as 'ON' | 'OFF', // Transform "state" to "isOn"
        timestamp: actuatorMessage.timestamp || initial.timestamp,
        instanceId: actuatorMessage.instanceId || initial.instanceId,
      };
      useEnvironmentStore.getState().setActuatorState(type, transformedData);
    }
  );
});
