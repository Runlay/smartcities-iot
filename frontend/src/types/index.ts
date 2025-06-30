export type EnvironmentState = {
  sensors: {
    temperature: {
      value: string;
      unit: string;
      timestamp: string;
      instanceId: string;
    };
    humidity: {
      value: string;
      unit: string;
      timestamp: string;
      instanceId: string;
    };
    motion: {
      value: string;
      unit: string;
      timestamp: string;
      instanceId: string;
    };
    pressure: {
      value: string;
      unit: string;
      timestamp: string;
      instanceId: string;
    };
  };
  actuators: {
    ac: {
      isOn: boolean;
      timestamp: string;
      instanceId: string;
    };
    ventilation: {
      isOn: boolean;
      timestamp: string;
      instanceId: string;
    };
    light: {
      isOn: boolean;
      timestamp: string;
      instanceId: string;
    };
    pressure: {
      isOn: boolean;
      timestamp: string;
      instanceId: string;
    };
  };
};

export type SensorData = {
  type: 'temperature' | 'humidity' | 'motion' | 'pressure';
  value: string;
  unit: string;
  timestamp: string;
  instanceId: string;
};

export type RawSensorData = {
  sensorData: SensorData;
  jsonPayload: string;
};

export type ActuatorData = {
  type: 'ac' | 'ventilation' | 'light' | 'alarm';
  isOn: boolean;
  timestamp: string;
  instanceId: string;
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
  motion: {
    lightDuration: number; // in seconds
  };
  pressure: {
    threshold: number;
  };
};

export type PlanStep = {
  actuator: string;
  action: string;
  timestamp: string;
};

export type Plan = {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: PlanStep[];
  createdAt: string;
};
