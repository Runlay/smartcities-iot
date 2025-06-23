import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import InfoAlert from '@/components/InfoAlert';
import ConfigurationCard from '@/components/ConfigurationCard';

const Configuration = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <InfoAlert description='This page allows the configuration of target values and thresholds.' />

          <section className='grid grid-cols-2 gap-8'>
            <ConfigurationCard
              type='Temperature'
              unit='°C'
              description='Set the target temperature value and thresholds. The smart warehouse system will try to maintain the temperature within the specified target interval.'
              defaultValue={20}
              defaultThreshold={2}
            />

            <ConfigurationCard
              type='Humidity'
              unit='%'
              description='Set the target humidty value and thresholds. The smart warehouse system will try to maintain the humidity within the specified target interval.'
              defaultValue={50}
              defaultThreshold={5}
            />

            <ConfigurationCard
              type='Pressure'
              unit='kg'
              description='Set the target pressure threshold. The smart warehouse system will trigger an alarm if the pressure exceeds the specified threshold.'
              defaultThreshold={500}
            />

            <ConfigurationCard
              type='Motion'
              unit='seconds'
              description='Set the target motion threshold. This is the amount of time the lights should remain activated after motion has been detected.'
              defaultThreshold={60}
            />
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Configuration;
