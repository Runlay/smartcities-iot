import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { capitalize } from '@/lib/utils';

import type { ActuatorData, ActuatorType } from '@/types';
import { Lightbulb, Bell, AirVent, Fan } from 'lucide-react';

interface ActuatorCardProps {
  actuatorType: ActuatorType;
  actuatorData: ActuatorData;
}

const ActuatorCard = ({ actuatorType, actuatorData }: ActuatorCardProps) => {
  const getIcon = () => {
    switch (actuatorType) {
      case 'ac':
        return <AirVent className='h-5 w-5' />;
      case 'ventilation':
        return <Fan className='h-5 w-5' />;
      case 'light':
        return <Lightbulb className='h-5 w-5' />;
      case 'alarm':
        return <Bell className='h-5 w-5' />;
    }
  };

  let title = capitalize(actuatorData.type);
  if (actuatorData.type === 'ac') {
    title = 'AC';
  }

  const timestamp = new Date(actuatorData.timestamp).toLocaleTimeString();

  return (
    <Card className='hover:border-muted-foreground transition-all'>
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
              actuatorData.state === 'OFF' ? 'text-muted-foreground' : undefined
            }`}
          >
            {actuatorData.state}
          </span>
        </div>
      </CardContent>

      <CardFooter className='text-muted-foreground text-sm'>
        Last updated: {timestamp}
      </CardFooter>
    </Card>
  );
};

export default ActuatorCard;
