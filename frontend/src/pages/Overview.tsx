import { ThemeProvider } from '@/components/ThemeProvider';
import SensorReadingsTable from '@/components/SensorReadingsTable';
import Navbar from '@/components/Navbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Overview = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <Alert className='mt-2 mb-10'>
            <Info className='h-4 w-4' />
            <AlertDescription>
              This page provides live monitoring of the raw sensor readings.
            </AlertDescription>
          </Alert>

          <SensorReadingsTable />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Overview;
