import { create } from 'zustand';

import type { RawSensorData, SensorData } from '@/types';
import { addMqttMessagehandler } from '@/lib/mqtt-client';

const INITIAL_DATA_STATE: RawSensorData[] = [];

interface DataStore {
  sensorData: RawSensorData[];
  addData: (data: RawSensorData) => void;
  clearData: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  sensorData: INITIAL_DATA_STATE,
  addData: (data) =>
    set((state) => ({
      sensorData: [...state.sensorData.slice(-49), data],
    })),
  clearData: () => set({ sensorData: INITIAL_DATA_STATE }),
}));

const handleDataMessage = (topic: string, message: object) => {
  console.log('Received raw sensor data:', message);

  const sensorData = message as SensorData;
  const jsonPayload = JSON.stringify(sensorData);
  const rawSensorData: RawSensorData = {
    sensorData,
    jsonPayload,
  };

  if (topic.startsWith('sensor/')) {
    useDataStore.getState().addData(rawSensorData);
  }
};

addMqttMessagehandler('sensor/', handleDataMessage);
