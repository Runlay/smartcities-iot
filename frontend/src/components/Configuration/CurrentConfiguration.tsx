import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, Droplets, Gauge, Thermometer } from 'lucide-react';
import { useConfigurationStore } from '@/store/configuration-store';

const CurrentConfiguration = () => {
  const { configuration } = useConfigurationStore();
  const { temperature, humidity, motion, pressure } = configuration;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>
          Current Configuration
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-4 gap-4'>
          <Card className='bg-muted transition-all hover:border-muted-foreground'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Thermometer className='w-4 h-4' />
                <h3 className='text-sm font-medium '>Temperature</h3>
              </CardTitle>
              <CardDescription>
                <p className='text-2xl font-semibold text-foreground'>
                  {temperature.min}{' '}
                  <span className='text-lg text-muted-foreground ml-1'>°C</span>{' '}
                  - {temperature.max}{' '}
                  <span className='text-lg text-muted-foreground ml-1'>°C</span>
                </p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='bg-muted transition-all hover:border-muted-foreground'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Droplets className='w-4 h-4' />
                <h3 className='text-sm font-medium '>Humidity</h3>
              </CardTitle>
              <CardDescription>
                <p className='text-2xl font-semibold text-foreground'>
                  {humidity.min}{' '}
                  <span className='text-lg text-muted-foreground ml-1'>%</span>{' '}
                  - {humidity.max}{' '}
                  <span className='text-lg text-muted-foreground ml-1'>%</span>
                </p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='bg-muted transition-all hover:border-muted-foreground'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <h3 className='text-sm font-medium '>Motion Light Duration</h3>
              </CardTitle>
              <CardDescription>
                <p className='text-2xl font-semibold text-foreground'>
                  {motion.lightDuration}{' '}
                  <span className='text-lg text-muted-foreground ml-1'>
                    seconds
                  </span>
                </p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='bg-muted transition-all hover:border-muted-foreground'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Gauge className='w-4 h-4' />
                <h3 className='text-sm font-medium '>Pressure Threshold</h3>
              </CardTitle>
              <CardDescription>
                <p className='text-2xl font-semibold text-foreground'>
                  {pressure.threshold}{' '}
                  <span className='text-lg text-muted-foreground ml-1'>kg</span>
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentConfiguration;
