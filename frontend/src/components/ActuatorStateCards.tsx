import { Lightbulb, Siren, Fan, Heater } from 'lucide-react';
import StateCard from '@/components/StateCard';

const ActuatorStateCards = () => {
  return (
    <section>
      <h2 className='mt-16 mb-4 text-2xl font-bold'>Actuators</h2>

      <div className='grid grid-cols-4 gap-8'>
        <StateCard
          title='Heating / Air Conditioning'
          icon={<Heater className='mr-2 h-5 w-5' />}
          description='Current State of Heating / AC Actuator'
          value='Heating Off / AC Off'
          badge_text='Virtual'
        />

        <StateCard
          title='Ventilation'
          icon={<Fan className='mr-2 h-5 w-5' />}
          description='Current State of Ventilation Actuator'
          value='Ventilation Off'
          badge_text='Virtual'
        />

        <StateCard
          title='Lighting'
          icon={<Lightbulb className='mr-2 h-5 w-5' />}
          description='Current State of Lighting Actuator'
          value='Lighting Off'
          badge_text='Physical'
        />

        <StateCard
          title='Alarm'
          icon={<Siren className='mr-2 h-5 w-5' />}
          description='Current State of Alarm Actuator'
          value='Alarm Off'
          badge_text='Physical'
        />
      </div>
    </section>
  );
};

export default ActuatorStateCards;
