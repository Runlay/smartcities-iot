import { Routes, Route } from 'react-router';
import Overview from './pages/Overview';
import EnvironmentState from './pages/EnvironmentState';
import PlanExecution from './pages/PlanExecution';
import { useEffect, useState } from 'react';
import { connectMQTT, disconnectMQTT } from './services/mqtt-client';
import type { SensorReading } from './types/types';
import { SensorReadingsContext } from './context/SensorReadingsContext';

const App = () => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  // const [currentSensorValues, setCurrentSensorValues] =
  //   useState<CurrentSensorValues>({
  //     temperature: 0,
  //     humidity: 0,
  //     motion: false,
  //     pressure: 0,
  //   });
  // const [currentActuatorValues, setCurrentActuatorValues] =
  //   useState<CurrentActuatorValues>({
  //     heating: false,
  //     ventilation: false,
  //     lighting: false,
  //     alarm: false,
  //   });

  useEffect(() => {
    connectMQTT((newSensorReading) =>
      setSensorReadings([...sensorReadings, newSensorReading])
    );

    return () => {
      disconnectMQTT();
    };
  }, []);

  return (
    <SensorReadingsContext value={sensorReadings}>
      {/* <CurrentSensorValuesContext value={currentSensorValues}>
        <CurrentActuatorValuesContext value={currentActuatorValues}> */}
      <Routes>
        <Route path='/' element={<Overview />} />
        <Route path='/environment-state' element={<EnvironmentState />} />
        <Route path='/plan-execution' element={<PlanExecution />} />
      </Routes>
      {/* </CurrentActuatorValuesContext>
      </CurrentSensorValuesContext> */}
    </SensorReadingsContext>
  );
};

export default App;
