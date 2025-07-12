import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Droplets, Thermometer } from 'lucide-react';
import { useConfigurationStore } from '@/store/configuration-store';

const CurrentConfiguration = () => {
  const { configuration } = useConfigurationStore();
  const { temperature, humidity } = configuration;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>
          Current Configuration
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <Card className='bg-muted hover:border-muted-foreground transition-all'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Thermometer className='h-4 w-4' />
                <h3 className='text-sm font-medium'>Temperature</h3>
              </CardTitle>
              <CardDescription>
                <p className='text-foreground text-2xl font-semibold'>
                  {temperature.min}{' '}
                  <span className='text-muted-foreground ml-1 text-lg'>°C</span>{' '}
                  - {temperature.max}{' '}
                  <span className='text-muted-foreground ml-1 text-lg'>°C</span>
                </p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='bg-muted hover:border-muted-foreground transition-all'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Droplets className='h-4 w-4' />
                <h3 className='text-sm font-medium'>Humidity</h3>
              </CardTitle>
              <CardDescription>
                <p className='text-foreground text-2xl font-semibold'>
                  {humidity.min}{' '}
                  <span className='text-muted-foreground ml-1 text-lg'>%</span>{' '}
                  - {humidity.max}{' '}
                  <span className='text-muted-foreground ml-1 text-lg'>%</span>
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
