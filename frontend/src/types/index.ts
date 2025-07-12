export type SensorType = 'temperature' | 'humidity' | 'motion' | 'pressure';

export type SensorData = {
  type: SensorType;
  value: string;
  unit: string;
  timestamp: string;
};

export type RawSensorData = {
  sensorData: SensorData;
  jsonPayload: string;
};

export type ActuatorType = 'ac' | 'ventilation' | 'light' | 'alarm';

export type ActuatorData = {
  type: ActuatorType;
  state: 'ON' | 'OFF';
  timestamp: string;
};

export type EnvironmentState = {
  sensors: {
    temperature?: SensorData;
    humidity?: SensorData;
    motion?: SensorData;
    pressure?: SensorData;
  };
  actuators: {
    ac: ActuatorData;
    ventilation: ActuatorData;
    light: ActuatorData;
    alarm: ActuatorData;
  };
};

export type EnvironmentConfiguration = {
  temperature: {
    min: number;
    max: number;
  };
  humidity: {
    min: number;
    max: number;
  };
};

export type PlanStep = {
  actuator: string;
  action: string;
  timestamp: string;
};

export type Plan = {
  id: string;
  steps: PlanStep[];
  createdAt: string;
};
