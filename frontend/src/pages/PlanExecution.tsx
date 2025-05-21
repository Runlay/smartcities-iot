import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import InfoAlert from '@/components/InfoAlert';

const PlanExecution = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <InfoAlert description='This page shows the latest plan (being) executed.' />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default PlanExecution;
