import { Droplets, Move3D, Thermometer, Weight } from 'lucide-react';
import StateCard from '@/components/StateCard';
import { formatCurrentSensorValue } from '@/lib/utils';

import { useEnvironmentState } from '@/context/EnvironmentStateContext';

const SensorStateCards = () => {
  const environmentState = useEnvironmentState();
  const sensorValues = environmentState!.environmentState.sensors;
  const { temperature, humidity, motionDetected, pressure } = sensorValues;

  return (
    <section>
      <h2 className='mb-4 text-2xl font-bold'>Sensors</h2>

      <div className='grid grid-cols-4 gap-8'>
        <StateCard
          title='Temperature'
          icon={<Thermometer className='mr-2 h-5 w-5' />}
          description='Latest Temperature Sensor Reading'
          value={formatCurrentSensorValue('temperature', temperature)}
        />

        <StateCard
          title='Humidity'
          icon={<Droplets className='mr-2 h-5 w-5' />}
          description='Latest Humidity Sensor Reading'
          value={formatCurrentSensorValue('humidity', humidity)}
        />

        <StateCard
          title='Motion'
          icon={<Move3D className='mr-2 h-5 w-5' />}
          description='Latest Motion Sensor Reading'
          value={formatCurrentSensorValue('motion', motionDetected)}
        />

        <StateCard
          title='Pressure'
          icon={<Weight className='mr-2 h-5 w-5' />}
          description='Latest Pressure Sensor Reading'
          value={formatCurrentSensorValue('pressure', pressure)}
        />
      </div>
    </section>
  );
};

export default SensorStateCards;
