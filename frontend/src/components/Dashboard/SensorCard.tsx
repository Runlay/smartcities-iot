import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { capitalize } from '@/lib/utils';

import type { SensorData, SensorType } from '@/types';
import { Thermometer, Droplets, Radar, Gauge } from 'lucide-react';

interface StateCardProps {
  sensorType: SensorType;
  sensorData?: SensorData;
}

const SensorCard = ({ sensorType, sensorData }: StateCardProps) => {
  const getIcon = () => {
    switch (sensorType) {
      case 'temperature':
        return <Thermometer className='h-5 w-5' />;
      case 'humidity':
        return <Droplets className='h-5 w-5' />;
      case 'motion':
        return <Radar className='h-5 w-5' />;
      case 'pressure':
        return <Gauge className='h-5 w-5' />;
    }
  };

  if (!sensorData) {
    return (
      <Card className='hover:border-muted-foreground transition-all'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {getIcon()}
            <h3>{capitalize(sensorType)}</h3>
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

  const timestamp = new Date(sensorData.timestamp).toLocaleTimeString();

  let value = sensorData.value;
  if (sensorData.type === 'motion') {
    value = value === '1' ? 'Motion Detected' : 'No Motion Detected';
  }
  if (sensorData.type === 'pressure') {
    value = value === '1' ? 'Pressure High' : 'Pressure Normal';
  }

  return (
    <Card className='hover:border-muted-foreground transition-all'>
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
            <span className='text-muted-foreground ml-1 text-lg'>
              {sensorData.unit}
            </span>
          </span>
        </div>
      </CardContent>

      <CardFooter className='text-muted-foreground text-sm'>
        Last updated: {timestamp}
      </CardFooter>
    </Card>
  );
};

export default SensorCard;
