export type SensorReading = {
  'type-id': string;
  'instance-id': string;
  timestamp: string;
  value: {
    [key: string]: string;
  };
};

export type CurrentSensorValues = {
  temperature: number;
  humidity: number;
  motion: boolean;
  pressure: number;
};

export type CurrentActuatorValues = {
  heating: boolean;
  ventilation: boolean;
  lighting: boolean;
  alarm: boolean;
};
