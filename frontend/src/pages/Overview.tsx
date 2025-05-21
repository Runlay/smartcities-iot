import { ThemeProvider } from '@/components/ThemeProvider';
import SensorReadingsTable from '@/components/SensorReadingsTable';
import Navbar from '@/components/Navbar';
import InfoAlert from '@/components/InfoAlert';

const Overview = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <InfoAlert description='This page provides live monitoring of the raw sensor readings.' />

          <SensorReadingsTable />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Overview;
