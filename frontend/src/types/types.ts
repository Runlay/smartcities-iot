export type SensorReading = {
  typeId: string;
  instanceId: string;
  timestamp: string;
  value: {
    degrees?: number; // Temperature in degrees Celsius
    percent?: number; // Humidity in percentage
    detected?: boolean; // Motion detected (boolean)
    kg?: number; // Pressure in kilograms
  };
};

export type ConfigKey = 'temperature' | 'humidity' | 'pressure' | 'motion';

export type EnvironmentState = {
  sensors: {
    temperature: number;
    humidity: number;
    motionDetected: boolean;
    pressure: number;
  };
  actuators: {
    acOn: boolean;
    ventilationOn: boolean;
    lightOn: boolean;
    alarmOn: boolean;
  };
  configuration: {
    temperature: {
      targetValue: number;
      targetThreshold: number;
    };
    humidity: {
      targetValue: number;
      targetThreshold: number;
    };
    pressure: {
      targetThreshold: number;
    };
    motion: {
      targetThreshold: number;
    };
  };
};
