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
  actuatorData?: ActuatorData;
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

  if (!actuatorData) {
    return (
      <Card className='hover:border-muted-foreground transition-all'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {getIcon()}
            <h3>{actuatorType === 'ac' ? 'AC' : capitalize(actuatorType)}</h3>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <span className='text-muted-foreground'>No data available yet</span>
        </CardContent>

        <CardFooter className='text-muted-foreground text-sm'>
          Last updated: -
        </CardFooter>
      </Card>
    );
  }

  let title = capitalize(actuatorData.type);
  if (actuatorData.type === 'ac') {
    title = 'AC';
  }

  const value = actuatorData.isOn ? 'On' : 'Off';

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
              !actuatorData.isOn ? 'text-muted-foreground' : undefined
            }`}
          >
            {value}
          </span>
        </div>
      </CardContent>

      <CardFooter className='text-muted-foreground text-sm'>
        {timestamp}
      </CardFooter>
    </Card>
  );
};

export default ActuatorCard;
