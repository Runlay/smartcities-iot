import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { capitalize } from '@/lib/utils';

import type { SensorData } from '@/types';
import { Thermometer, Droplets, Radar, Gauge } from 'lucide-react';

interface StateCardProps {
  sensorData: SensorData;
}

const SensorCard = ({ sensorData }: StateCardProps) => {
  const getIcon = () => {
    switch (sensorData.type) {
      case 'temperature':
        return <Thermometer className='w-5 h-5' />;
      case 'humidity':
        return <Droplets className='w-5 h-5' />;
      case 'motion':
        return <Radar className='w-5 h-5' />;
      case 'pressure':
        return <Gauge className='w-5 h-5' />;
    }
  };

  const timestamp = new Date(sensorData.timestamp).toLocaleTimeString();

  let value = sensorData.value;
  if (sensorData.type === 'motion') {
    value = value === 'true' ? 'Motion Detected' : 'No Motion Detected';
  }

  return (
    <Card className='transition-all hover:border-muted-foreground'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {getIcon()}
          <h3>{capitalize(sensorData.type)}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div>
          <span className='text-2xl font-semibold'>
            {value}
            <span className='text-lg text-muted-foreground ml-1'>
              {sensorData.unit}
            </span>
          </span>
        </div>
      </CardContent>

      <CardFooter className='text-sm text-muted-foreground'>
        {timestamp}
      </CardFooter>
    </Card>
  );
};

export default SensorCard;
