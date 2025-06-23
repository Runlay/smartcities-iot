import { Routes, Route } from 'react-router';
import Overview from '@/pages/Overview';
import EnvironmentState from '@/pages/EnvironmentState';
import PlanExecution from '@/pages/PlanExecution';
import { useEffect, useCallback } from 'react';
import { connectMQTT, disconnectMQTT } from '@/services/mqtt-client';
import { SensorReadingsContext } from './context/SensorReadingsContext';
import { useState } from 'react';
import type {
  SensorReading,
  CurrentSensorValues,
  CurrentActuatorValues,
} from '@/types/types';
import { CurrentSensorValuesContext } from './context/CurrentSensorValuesContext';
import { CurrentActuatorValuesContext } from './context/CurrentActuatorValuesContext';
import Configuration from './pages/Configuration';

const App = () => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [currentSensorValues, setCurrentSensorValues] =
    useState<CurrentSensorValues>({
      temperature: 0,
      humidity: 0,
      motion: false,
      pressure: 0,
    });
  const [currentActuatorValues, setCurrentActuatorValues] =
    useState<CurrentActuatorValues>({
      heating: false,
      ventilation: false,
      lighting: false,
      alarm: false,
    });

  const handleMessage = useCallback(
    (topic: string, message: object) => {
      if (topic.startsWith('sensor/')) {
        const newSensorReading = message as SensorReading;
        setSensorReadings((prev) => [...prev, newSensorReading]);

        // Extract sensor type from topic (e.g., "sensor/temperature" -> "temperature")
        const sensorType = topic.split('/')[1];

        switch (sensorType) {
          case 'temperature': {
            const tempValue = newSensorReading.value['degrees'];
            setCurrentSensorValues((prev) => ({
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
            setCurrentSensorValues((prev) => ({
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
            setCurrentSensorValues((prev) => ({
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
            setCurrentSensorValues((prev) => ({
              ...prev,
              pressure:
                typeof pressureValue === 'string'
                  ? parseFloat(pressureValue)
                  : (pressureValue as number),
            }));
            break;
          }
        }
      } else if (topic.startsWith('actuators/')) {
        console.log(
          'Message handling for actuator messsages is not yet implemented.'
        );
        setCurrentActuatorValues(currentActuatorValues); // TODO: implement
      }
    },
    [currentActuatorValues]
  );

  useEffect(() => {
    connectMQTT(handleMessage);

    return () => {
      disconnectMQTT();
    };
  }, [handleMessage]);

  return (
    <SensorReadingsContext value={sensorReadings}>
      <CurrentSensorValuesContext value={currentSensorValues}>
        <CurrentActuatorValuesContext value={currentActuatorValues}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path='/environment-state' element={<EnvironmentState />} />
            <Route path='/plan-execution' element={<PlanExecution />} />
            <Route path='/configuration' element={<Configuration />} />
          </Routes>
        </CurrentActuatorValuesContext>
      </CurrentSensorValuesContext>
    </SensorReadingsContext>
  );
};

export default App;
