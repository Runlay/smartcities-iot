import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { capitalize } from '@/lib/utils';

import type { ActuatorData } from '@/types';
import { Lightbulb, Bell, AirVent, Fan } from 'lucide-react';

interface ActuatorCardProps {
  actuatorData: ActuatorData;
}

const ActuatorCard = ({ actuatorData }: ActuatorCardProps) => {
  const getIcon = () => {
    switch (actuatorData.type) {
      case 'ac':
        return <AirVent className='w-5 h-5' />;
      case 'ventilation':
        return <Fan className='w-5 h-5' />;
      case 'light':
        return <Lightbulb className='w-5 h-5' />;
      case 'alarm':
        return <Bell className='w-5 h-5' />;
    }
  };

  let title = capitalize(actuatorData.type);
  if (actuatorData.type === 'ac') {
    title = 'AC';
  }

  const value = actuatorData.isOn ? 'On' : 'Off';

  const timestamp = new Date(actuatorData.timestamp).toLocaleTimeString();

  return (
    <Card className='transition-all hover:border-muted-foreground'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {getIcon()}
          <h3>{title}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div>
          <span
            className={`text-2xl font-semibold uppercase ${
              !actuatorData.isOn ? 'text-muted-foreground' : undefined
            }`}
          >
            {value}
          </span>
        </div>
      </CardContent>

      <CardFooter className='text-sm text-muted-foreground'>
        {timestamp}
      </CardFooter>
    </Card>
  );
};

export default ActuatorCard;
