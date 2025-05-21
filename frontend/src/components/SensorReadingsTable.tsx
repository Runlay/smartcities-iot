import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
  TableBody,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const SensorReadingsTable = () => {
  const sensorReadings = [
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
    {
      instanceId: '1',
      typeId: 'temperature',
      timestamp: '2023-10-01T12:00:00Z',
      value: { celsius: 22.5 },
    },
    {
      instanceId: '2',
      typeId: 'humidity',
      timestamp: '2023-10-01T12:05:00Z',
      value: { percentage: 45 },
    },
    {
      instanceId: '3',
      typeId: 'motion',
      timestamp: '2023-10-01T12:10:00Z',
      value: { pascals: 101325 },
    },
  ];

  return (
    <ScrollArea className='h-[80vh] rounded-md border p-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Sensor Type</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensorReadings.map((sensorReading) => (
            <TableRow key={sensorReading.instanceId}>
              <TableCell>{sensorReading.timestamp}</TableCell>
              <TableCell>{sensorReading.typeId}</TableCell>
              <TableCell>{JSON.stringify(sensorReading.value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default SensorReadingsTable;
