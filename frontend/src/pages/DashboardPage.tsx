import ActuatorCard from '@/components/Dashboard/ActuatorCard';
import SensorCard from '@/components/Dashboard/SensorCard';
import PageInfo from '@/components/PageInfo';
import PageSection from '@/components/PageSection';
import type { SensorData, ActuatorData } from '@/types';
import { useEnvironmentStore } from '@/store/environment-store';

const DashboardPage = () => {
  const { environmentState } = useEnvironmentStore();

  // Convert sensor object to array with type information
  const sensorData: SensorData[] = Object.entries(environmentState.sensors).map(
    ([type, data]) => ({
      type: type as SensorData['type'],
      ...data,
    })
  );

  // Convert actuator object to array with type information
  const actuatorData: ActuatorData[] = Object.entries(
    environmentState.actuators
  ).map(([type, data]) => ({
    type: type as ActuatorData['type'],
    ...data,
  }));

  return (
    <>
      <PageInfo
        heading='Dashboard'
        text='This is the dashboard of SmartStore. Here you can see the current state of the sensors and actuators.'
      />

      <PageSection title='Sensors'>
        <div className='grid grid-cols-4 gap-4'>
          {sensorData.map((sensor) => (
            <SensorCard key={sensor.instanceId} sensorData={sensor} />
          ))}
        </div>
      </PageSection>

      <PageSection title='Actuators'>
        {' '}
        <div className='grid grid-cols-4 gap-4'>
          {actuatorData.map((actuator) => (
            <ActuatorCard key={actuator.instanceId} actuatorData={actuator} />
          ))}
        </div>
      </PageSection>
    </>
  );
};

export default DashboardPage;
