import { Droplets, Move3D, Thermometer, Weight } from 'lucide-react';
import StateCard from '@/components/StateCard';

const SensorStateCards = () => {
  return (
    <section>
      <h2 className='mb-4 text-2xl font-bold'>Sensors</h2>

      <div className='grid grid-cols-4 gap-8'>
        <StateCard
          title='Temperature'
          icon={<Thermometer className='mr-2 h-5 w-5' />}
          description='Latest Temperature Sensor Reading'
          value={0}
        />

        <StateCard
          title='Humidity'
          icon={<Droplets className='mr-2 h-5 w-5' />}
          description='Latest Humidity Sensor Reading'
          value={0}
        />

        <StateCard
          title='Motion'
          icon={<Move3D className='mr-2 h-5 w-5' />}
          description='Latest Motion Sensor Reading'
          value='No Motion Detected'
        />

        <StateCard
          title='Pressure'
          icon={<Weight className='mr-2 h-5 w-5' />}
          description='Latest Pressure Sensor Reading'
          value='Pressure Below Threshold'
        />
      </div>
    </section>
  );
};

export default SensorStateCards;
