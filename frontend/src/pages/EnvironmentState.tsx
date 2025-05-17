import { ThemeProvider } from '../components/theme-provider';
import Navbar from '../components/navbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Info, Move3D, Thermometer, Weight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
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
              <CardContent>
                <p>20.5°C</p>
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
              <CardContent>
                <p>45.3%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Move3D className='mr-2 h-5 w-5' />
                  <p>Motion</p>
                </CardTitle>
                <CardDescription>Latest Motion Sensor Reading</CardDescription>
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
        </main>
      </div>
    </ThemeProvider>
  );
};

export default EnvironmentState;
