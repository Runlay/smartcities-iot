import { Warehouse } from 'lucide-react';
import { ModeToggle } from './components/mode-toggle';
import { ThemeProvider } from './components/theme-provider';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from './components/ui/table';

const sensorReadings = [
  {
    typeId: 'de.uni-stuttgart.sciot.group08.aeon/temperature',
    instanceId: '0xe238dbw3c277',
    timestamp: '2018-05-02T07:20:30.262Z',
    value: {
      degrees: 20.5,
    },
  },
  {
    typeId: 'de.uni-stuttgart.sciot.group08.aeon/humidity',
    instanceId: '0xe238dbw3c278',
    timestamp: '2018-05-02T07:20:32.262Z',
    value: {
      percent: 50.0,
    },
  },
];

const App = () => {
  const sensorReadingRows = sensorReadings.map((sensorReading) => (
    <TableRow key={sensorReading.instanceId}>
      <TableCell>{sensorReading.timestamp}</TableCell>
      <TableCell>{sensorReading.typeId}</TableCell>
      <TableCell>{JSON.stringify(sensorReading.value)}</TableCell>
    </TableRow>
  ));

  return (
    <ThemeProvider>
      <header className='container mx-auto flex items-center justify-between px-4 py-6'>
        <img src='/favicon.svg' alt='Warehouse Logo' />

        <ModeToggle />
      </header>

      <main className='container mx-auto mt-8 px-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Sensor Type</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{sensorReadingRows}</TableBody>
        </Table>
      </main>
    </ThemeProvider>
  );
};
export default App;
