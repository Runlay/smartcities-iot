export interface SensorReading {
  typeId: string;
  instanceId: string;
  timestamp: string;
  value: {
    [key: string]: number;
  };
}

export interface CurrentSensorValues {
  temperature: number;
  humidity: number;
  motion: boolean;
  pressure: number;
}

export interface CurrentActuatorValues {
  heating: boolean;
  ventilation: boolean;
  lighting: boolean;
  alarm: boolean;
}
