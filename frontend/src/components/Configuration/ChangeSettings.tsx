import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Clock,
  Delete,
  Droplets,
  Gauge,
  Save,
  Thermometer,
  CheckCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useConfigurationStore } from '@/store/configuration-store';
import { publishMqttMessage } from '@/lib/mqtt-client';
import { useRef, useState, useEffect } from 'react';

const ChangeSettings = () => {
  const { configuration, setConfiguration } = useConfigurationStore();
  const { temperature, humidity, motion, pressure } = configuration;

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const tempMinRef = useRef<HTMLInputElement>(null);
  const tempMaxRef = useRef<HTMLInputElement>(null);
  const humidityMinRef = useRef<HTMLInputElement>(null);
  const humidityMaxRef = useRef<HTMLInputElement>(null);
  const lightDurationRef = useRef<HTMLInputElement>(null);
  const pressureThresholdRef = useRef<HTMLInputElement>(null);

  const handleSaveConfiguration = () => {
    // Get values from refs, fallback to current config if empty
    const newConfiguration = {
      temperature: {
        min: tempMinRef.current?.value
          ? parseFloat(tempMinRef.current.value)
          : temperature.min,
        max: tempMaxRef.current?.value
          ? parseFloat(tempMaxRef.current.value)
          : temperature.max,
      },
      humidity: {
        min: humidityMinRef.current?.value
          ? parseFloat(humidityMinRef.current.value)
          : humidity.min,
        max: humidityMaxRef.current?.value
          ? parseFloat(humidityMaxRef.current.value)
          : humidity.max,
      },
      motion: {
        lightDuration: lightDurationRef.current?.value
          ? parseFloat(lightDurationRef.current.value)
          : motion.lightDuration,
      },
      pressure: {
        threshold: pressureThresholdRef.current?.value
          ? parseFloat(pressureThresholdRef.current.value)
          : pressure.threshold,
      },
    };

    // Update store
    setConfiguration(newConfiguration);

    // Publish config update to MQTT
    publishMqttMessage('env/config', newConfiguration);
    console.log('📤 Published config update to env/config:', newConfiguration);

    setShowSuccess(true);

    // Clear all inputs
    clearAllInputs();
  };

  const clearAllInputs = () => {
    if (tempMinRef.current) tempMinRef.current.value = '';
    if (tempMaxRef.current) tempMaxRef.current.value = '';
    if (humidityMinRef.current) humidityMinRef.current.value = '';
    if (humidityMaxRef.current) humidityMaxRef.current.value = '';
    if (lightDurationRef.current) lightDurationRef.current.value = '';
    if (pressureThresholdRef.current) pressureThresholdRef.current.value = '';
  };

  return (
    <Card className='bg-background'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>
          Change System Settings
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form className='flex flex-col gap-8'>
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Thermometer className='text-muted-foreground h-5 w-5' />
              <h3 className='font-medium'>Temperature Range</h3>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='temperatureMin'>Minimum Temperature (°C)</Label>
                <Input
                  id='temperatureMin'
                  type='number'
                  step={0.5}
                  placeholder={temperature.min.toString()}
                  ref={tempMinRef}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor='temperatureMax'>Maximum Temperature (°C)</Label>
                <Input
                  id='temperatureMax'
                  type='number'
                  step={0.5}
                  placeholder={temperature.max.toString()}
                  ref={tempMaxRef}
                />
              </div>
            </div>
          </div>

          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Droplets className='text-muted-foreground h-5 w-5' />
              <h3 className='font-medium'>Humidity Range</h3>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='humidityMin'>Minimum Humidity (%)</Label>
                <Input
                  id='humidityMin'
                  type='number'
                  step={1}
                  min={0}
                  max={100}
                  placeholder={humidity.min.toString()}
                  ref={humidityMinRef}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor='humidityMax'>Maximum Humidity (%)</Label>
                <Input
                  id='humidityMax'
                  type='number'
                  step={1}
                  min={0}
                  max={100}
                  placeholder={humidity.max.toString()}
                  ref={humidityMaxRef}
                />
              </div>
            </div>
          </div>

          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Clock className='text-muted-foreground h-5 w-5' />
              <h3 className='font-medium'>Motion Light Duration</h3>
            </div>

            <div className='flex max-w-2xs flex-col gap-2'>
              <Label htmlFor='duration'>Duration (seconds)</Label>
              <Input
                id='duration'
                type='number'
                min={0}
                step={1}
                placeholder={motion.lightDuration.toString()}
                ref={lightDurationRef}
              />
            </div>
          </div>

          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Gauge className='text-muted-foreground h-5 w-5' />
              <h3 className='font-medium'>Pressure Threshold</h3>
            </div>

            <div className='flex max-w-2xs flex-col gap-2'>
              <Label htmlFor='threshold'>Threshold (kg)</Label>
              <Input
                id='threshold'
                type='number'
                min={0}
                step={1}
                placeholder={pressure.threshold.toString()}
                ref={pressureThresholdRef}
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className='mt-8 flex items-center justify-start gap-4'>
        <Button onClick={handleSaveConfiguration}>
          <Save className='h-5 w-5' />
          Save
        </Button>

        <Button variant='secondary' onClick={clearAllInputs}>
          <Delete className='h-5 w-5' />
          Clear All
        </Button>

        {showSuccess && (
          <Alert className='bg-background flex h-8 items-center border-0'>
            <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-600' />
            <AlertDescription>
              Configuration updated successfully!
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChangeSettings;
