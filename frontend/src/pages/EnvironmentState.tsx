import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';

import SensorStateCards from '@/components/SensorStateCards';
import ActuatorStateCards from '@/components/ActuatorStateCards';
import InfoAlert from '@/components/InfoAlert';

const EnvironmentState = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <InfoAlert description='This page displays the current state of the environment.' />

          <SensorStateCards />

          <ActuatorStateCards />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default EnvironmentState;
