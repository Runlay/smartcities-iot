import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import InfoAlert from '@/components/InfoAlert';
import ConfigurationCard from '@/components/ConfigurationCard';

import { useEnvironmentState } from '@/context/EnvironmentStateContext';
import type { ConfigKey } from '@/types/types';
import { publishMessage } from '@/services/mqtt-client';

const Configuration = () => {
  const { environmentState, setEnvironmentState } = useEnvironmentState();
  const configuration = environmentState!.configuration;

  const handleSubmit = (
    type: ConfigKey,
    targetValue: number | undefined,
    targetThreshold: number
  ) => {
    if (!targetThreshold) {
      targetThreshold = 0;
    }

    setEnvironmentState((prevState) => {
      const newConfig = {
        ...prevState.configuration,
        [type]: {
          ...prevState.configuration[type],
          targetValue: targetValue,
          targetThreshold: targetThreshold,
        },
      };

      publishMessage('env/configuration', JSON.stringify(newConfig));

      return {
        ...prevState,
        configuration: newConfig,
      };
    });
  };

  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <InfoAlert description='This page allows the configuration of target values and thresholds.' />

          <section className='grid grid-cols-2 gap-8'>
            <ConfigurationCard
              type='temperature'
              unit='°C'
              description='Set the target temperature value and thresholds. The smart warehouse system will try to maintain the temperature within the specified target interval.'
              defaultValue={configuration.temperature.targetValue}
              defaultThreshold={configuration.temperature.targetThreshold}
              onSubmit={handleSubmit}
            />

            <ConfigurationCard
              type='humidity'
              unit='%'
              description='Set the target humidty value and thresholds. The smart warehouse system will try to maintain the humidity within the specified target interval.'
              defaultValue={configuration.humidity.targetValue}
              defaultThreshold={configuration.humidity.targetThreshold}
              onSubmit={handleSubmit}
            />

            <ConfigurationCard
              type='pressure'
              unit='kg'
              description='Set the target pressure threshold. The smart warehouse system will trigger an alarm if the pressure exceeds the specified threshold.'
              defaultThreshold={configuration.pressure.targetThreshold}
              onSubmit={handleSubmit}
            />

            <ConfigurationCard
              type='motion'
              unit='seconds'
              description='Set the target motion threshold. This is the amount of time the lights should remain activated after motion has been detected.'
              defaultThreshold={configuration.motion.targetThreshold}
              onSubmit={handleSubmit}
            />
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Configuration;
