import { ThemeProvider } from '../components/theme-provider';
import SensorReadingsTable from '../components/sensor-readings-table';
import Navbar from '../components/navbar';

const Overview = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main className='mt-8'>
          <SensorReadingsTable />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Overview;
