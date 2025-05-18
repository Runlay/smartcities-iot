import { ThemeProvider } from '../components/theme-provider';
import Navbar from '../components/navbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import {
  Droplets,
  Info,
  Move3D,
  Thermometer,
  Weight,
  Lightbulb,
  Siren,
  Fan,
  Heater,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const EnvironmentState = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <Alert className='mt-2 mb-10'>
            <Info className='h-4 w-4' />
            <AlertDescription>
              This page displays the current state of the environment.
            </AlertDescription>
          </Alert>

          <section>
            <h2 className='mb-4 text-2xl font-bold'>Sensors</h2>

            <div className='grid grid-cols-4 gap-8'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Thermometer className='mr-2 h-5 w-5' />
                    <p>Temperature</p>
                  </CardTitle>
                  <CardDescription>
                    Latest Temperature Sensor Reading
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex items-center'>
                  <p>24.5°C</p>
                  <ArrowDownRight className='ml-2 h-5 w-5' />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Droplets className='mr-2 h-5 w-5' />
                    <p>Humidity</p>
                  </CardTitle>
                  <CardDescription>
                    Latest Humidity Sensor Reading
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex items-center'>
                  <p>45.3%</p>
                  <ArrowUpRight className='ml-2 h-5 w-5' />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Move3D className='mr-2 h-5 w-5' />
                    <p>Motion</p>
                  </CardTitle>
                  <CardDescription>
                    Latest Motion Sensor Reading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>No Motion Detected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Weight className='mr-2 h-5 w-5' />
                    <p>Pressure</p>
                  </CardTitle>
                  <CardDescription>
                    Latest Pressure Sensor Reading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Pressure Below Threshold</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className='mt-16 mb-4 text-2xl font-bold'>Actuators</h2>

            <div className='grid grid-cols-4 gap-8'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Heater className='mr-2 h-5 w-5' />
                    <p>Heating / Air Conditioning</p>
                  </CardTitle>
                  <CardDescription>
                    Current State of Heating / AC Actuator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Air Conditioning On</p>
                </CardContent>
                <CardFooter>
                  <Badge>Virtual</Badge>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Fan className='mr-2 h-5 w-5' />
                    <p>Ventilation</p>
                  </CardTitle>
                  <CardDescription>
                    Current State of Ventilation Actuator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Off</p>
                </CardContent>
                <CardFooter>
                  <Badge>Virtual</Badge>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Lightbulb className='mr-2 h-5 w-5' />
                    <p>Lighting</p>
                  </CardTitle>
                  <CardDescription>
                    Current State of Lighting Actuator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Off</p>
                </CardContent>
                <CardFooter>
                  <Badge>Physical</Badge>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Siren className='mr-2 h-5 w-5' />
                    <p>Alarm</p>
                  </CardTitle>
                  <CardDescription>
                    Current State of Alarm Actuator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Off</p>
                </CardContent>
                <CardFooter>
                  <Badge>Physical</Badge>
                </CardFooter>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default EnvironmentState;
