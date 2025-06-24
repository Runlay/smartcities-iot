import { Routes, Route } from 'react-router';
import Overview from '@/pages/Overview';
import EnvironmentStatePage from '@/pages/EnvironmentStatePage';
import PlanExecution from '@/pages/PlanExecution';
import { useEffect, useCallback } from 'react';
import { connectMQTT, disconnectMQTT } from '@/services/mqtt-client';
import { SensorReadingsContext } from './context/SensorReadingsContext';
import { useState } from 'react';
import type { EnvironmentState, SensorReading } from '@/types/types';

import Configuration from './pages/Configuration';
import { EnvironmentStateContext } from './context/EnvironmentStateContext';

const INITIAL_ENVIRONMENT_STATE = {
  sensors: {
    temperature: 0,
    humidity: 0,
    motionDetected: false,
    pressure: 0,
  },
  actuators: {
    acOn: false,
    ventilationOn: false,
    lightOn: false,
    alarmOn: false,
  },
  configuration: {
    temperature: {
      targetValue: 20, // degrees Celsius
      targetThreshold: 2,
    },
    humidity: {
      targetValue: 50, // percent
      targetThreshold: 5,
    },
    pressure: {
      targetThreshold: 500, // kg
    },
    motion: {
      targetThreshold: 60, // seconds
    },
  },
};

const App = () => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [environmentState, setEnvironmentState] = useState<EnvironmentState>(
    INITIAL_ENVIRONMENT_STATE
  );

  const handleMessage = useCallback((topic: string, message: object) => {
    if (topic.startsWith('sensor/')) {
      const newSensorReading = message as SensorReading;
      setSensorReadings((prevSensorReading) => [
        ...prevSensorReading,
        newSensorReading,
      ]);

      // Extract sensor type from topic (e.g., "sensor/temperature" -> "temperature")
      const sensorType = topic.split('/')[1];

      switch (sensorType) {
        case 'temperature': {
          const tempValue = newSensorReading.value['degrees'];
          setEnvironmentState((prev) => ({
            ...prev,
            temperature:
              typeof tempValue === 'string'
                ? parseFloat(tempValue)
                : (tempValue as number),
          }));
          break;
        }
        case 'humidity': {
          const humidityValue = newSensorReading.value['percent'];
          setEnvironmentState((prev) => ({
            ...prev,
            humidity:
              typeof humidityValue === 'string'
                ? parseFloat(humidityValue)
                : (humidityValue as number),
          }));
          break;
        }
        case 'motion': {
          const motionValue = newSensorReading.value['detected'];
          setEnvironmentState((prev) => ({
            ...prev,
            motion:
              typeof motionValue === 'string'
                ? motionValue === '1'
                : (motionValue as boolean),
          }));
          break;
        }
        case 'pressure': {
          const pressureValue = newSensorReading.value['kg'];
          setEnvironmentState((prev) => ({
            ...prev,
            pressure:
              typeof pressureValue === 'string'
                ? parseFloat(pressureValue)
                : (pressureValue as number),
          }));
          break;
        }
      }
    } else if (topic.startsWith('actuator/')) {
      console.log(
        'Message handling for actuator messsages is not yet implemented.'
      );
    }
  }, []);

  useEffect(() => {
    connectMQTT(handleMessage);

    return () => {
      disconnectMQTT();
    };
  }, [handleMessage]);

  return (
    <SensorReadingsContext value={sensorReadings}>
      <EnvironmentStateContext
        value={{ environmentState, setEnvironmentState }}
      >
        <Routes>
          <Route index element={<Overview />} />
          <Route path='/environment-state' element={<EnvironmentStatePage />} />
          <Route path='/plan-execution' element={<PlanExecution />} />
          <Route path='/configuration' element={<Configuration />} />
        </Routes>
      </EnvironmentStateContext>
    </SensorReadingsContext>
  );
};

export default App;
