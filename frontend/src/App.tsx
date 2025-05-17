import { ThemeProvider } from './components/theme-provider';

import { ModeToggle } from './components/mode-toggle';

import SensorReadingsTable from './components/sensor-readings-table';

const App = () => {
  return (
    <ThemeProvider>
      <header className='container mx-auto flex items-center justify-between px-4 py-6'>
        <img src='/favicon.svg' alt='Warehouse Logo' />

        <ModeToggle />
      </header>

      <main className='container mx-auto mt-8 px-4'>
        <SensorReadingsTable />
      </main>
    </ThemeProvider>
  );
};

export default App;
