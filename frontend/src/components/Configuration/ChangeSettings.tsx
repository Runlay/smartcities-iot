import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Delete, Droplets, Save, Thermometer, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useConfigurationStore } from '@/store/configuration-store';
import { useRef, useState, useEffect } from 'react';

const ChangeSettings = () => {
  const { configuration, setConfiguration } = useConfigurationStore();
  const { temperature, humidity } = configuration;

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
    };

    // Update store
    setConfiguration(newConfiguration);

    // Save config to backend
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: newConfiguration }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('✅ Config saved to backend successfully');
          setShowSuccess(true);
          // Clear all inputs
          clearAllInputs();
        } else {
          console.error('❌ Failed to save config:', data.message);
        }
      })
      .catch((err) => {
        console.error('❌ Error saving config to backend:', err);
      });
  };

  const clearAllInputs = () => {
    if (tempMinRef.current) tempMinRef.current.value = '';
    if (tempMaxRef.current) tempMaxRef.current.value = '';
    if (humidityMinRef.current) humidityMinRef.current.value = '';
    if (humidityMaxRef.current) humidityMaxRef.current.value = '';
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
