import { Lightbulb, Siren, Fan, AirVent } from 'lucide-react';
import StateCard from '@/components/StateCard';

import { useEnvironmentState } from '@/context/EnvironmentStateContext';

const ActuatorStateCards = () => {
  const environmentState = useEnvironmentState();
  const actuatorValues = environmentState!.environmentState.actuators;
  const { acOn, ventilationOn, lightOn, alarmOn } = actuatorValues;

  return (
    <section>
      <h2 className='mt-16 mb-4 text-2xl font-bold'>Actuators</h2>

      <div className='grid grid-cols-4 gap-8'>
        <StateCard
          title='Air Conditioning'
          icon={<AirVent className='mr-2 h-5 w-5' />}
          description='Current State of AC Actuator'
          value={acOn ? 'AC On' : 'AC Off'}
          badge_text='Virtual'
        />

        <StateCard
          title='Ventilation'
          icon={<Fan className='mr-2 h-5 w-5' />}
          description='Current State of Ventilation Actuator'
          value={ventilationOn ? 'Ventilation On' : 'Ventilation Off'}
          badge_text='Virtual'
        />

        <StateCard
          title='Lighting'
          icon={<Lightbulb className='mr-2 h-5 w-5' />}
          description='Current State of Lighting Actuator'
          value={lightOn ? 'Light On' : 'Light Off'}
          badge_text='Physical'
        />

        <StateCard
          title='Alarm'
          icon={<Siren className='mr-2 h-5 w-5' />}
          description='Current State of Alarm Actuator'
          value={alarmOn ? 'Alarm On' : 'Alarm Off'}
          badge_text='Physical'
        />
      </div>
    </section>
  );
};

export default ActuatorStateCards;
