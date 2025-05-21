import { Routes, Route } from 'react-router';
import Overview from '@/pages/Overview';
import EnvironmentState from '@/pages/EnvironmentState';
import PlanExecution from '@/pages/PlanExecution';
import { useEffect } from 'react';
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

const SENSOR_TYPE_IDS = {
  TEMPERATURE: 'de.uni-stuttgart.sciot.group08.aeon/temperature',
  HUMIDITY: 'humidity',
  MOTION: 'motion',
  PRESSURE: 'pressure',
};

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

  const handleMessage = (topic: string, message: object) => {
    if (topic.startsWith('sensors/')) {
      const newSensorReading = message as SensorReading;
      setSensorReadings((prev) => [...prev, newSensorReading]);

      switch (newSensorReading.typeId) {
        case SENSOR_TYPE_IDS.TEMPERATURE:
          setCurrentSensorValues((prev) => ({
            ...prev,
            temperature: newSensorReading.value['randomValue'] as number, // TODO: adjust to actual key
          }));

          break;
        case SENSOR_TYPE_IDS.HUMIDITY:
          setCurrentSensorValues((prev) => ({
            ...prev,
            humidity: newSensorReading.value.value as number,
          }));
          break;
        case SENSOR_TYPE_IDS.MOTION:
          setCurrentSensorValues((prev) => ({
            ...prev,
            motion: newSensorReading.value.value as boolean,
          }));
          break;
        case SENSOR_TYPE_IDS.PRESSURE:
          setCurrentSensorValues((prev) => ({
            ...prev,
            pressure: newSensorReading.value.value as number,
          }));
          break;
      }
    } else if (topic.startsWith('actuators/')) {
      console.log(
        'Message handling for actuator messsages is not yet implemented.'
      );
      setCurrentActuatorValues(currentActuatorValues); // TODO: implement
    }
  };

  useEffect(() => {
    connectMQTT(handleMessage);

    return () => {
      disconnectMQTT();
    };
  }, []);

  return (
    <SensorReadingsContext value={sensorReadings}>
      <CurrentSensorValuesContext value={currentSensorValues}>
        <CurrentActuatorValuesContext value={currentActuatorValues}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path='/environment-state' element={<EnvironmentState />} />
            <Route path='/plan-execution' element={<PlanExecution />} />
          </Routes>
        </CurrentActuatorValuesContext>
      </CurrentSensorValuesContext>
    </SensorReadingsContext>
  );
};

export default App;
