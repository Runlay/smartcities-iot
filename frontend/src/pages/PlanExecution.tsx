import { ThemeProvider } from '../components/theme-provider';
import Navbar from '../components/navbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const PlanExecution = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <Alert className='mt-2 mb-10'>
            <Info className='h-4 w-4' />
            <AlertDescription>
              This page shows the latest plan (being) executed.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default PlanExecution;
