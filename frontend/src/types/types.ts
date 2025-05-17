export interface SensorReading {
  typeId: string;
  instanceId: string;
  timestamp: string;
  value: {
    [key: string]: number;
  };
}
