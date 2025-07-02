import ActuatorCard from '@/components/Dashboard/ActuatorCard';
import SensorCard from '@/components/Dashboard/SensorCard';
import PageInfo from '@/components/PageInfo';
import PageSection from '@/components/PageSection';
import type { SensorType, ActuatorType } from '@/types';
import { useEnvironmentStore } from '@/store/environment-store';

const SENSOR_TYPES: SensorType[] = [
  'temperature',
  'humidity',
  'motion',
  'pressure',
];
const ACTUATOR_TYPES: ActuatorType[] = ['ac', 'ventilation', 'light', 'alarm'];

const DashboardPage = () => {
  const { environmentState } = useEnvironmentStore();

  return (
    <>
      <PageInfo
        heading='Dashboard'
        text='This is the dashboard of SmartStore. Here you can see the current state of the sensors and actuators.'
      />

      <PageSection title='Sensors'>
        <div className='grid grid-cols-4 gap-4'>
          {SENSOR_TYPES.map((type) => {
            const data = environmentState.sensors[type];

            return (
              <SensorCard
                key={type}
                sensorType={type}
                sensorData={data ? { type, ...data } : undefined}
              />
            );
          })}
        </div>
      </PageSection>

      <PageSection title='Actuators'>
        <div className='grid grid-cols-4 gap-4'>
          {ACTUATOR_TYPES.map((type) => {
            const data = environmentState.actuators[type];

            return (
              <ActuatorCard
                key={type}
                actuatorType={type}
                actuatorData={data ? { type, ...data } : undefined}
              />
            );
          })}
        </div>
      </PageSection>
    </>
  );
};

export default DashboardPage;
