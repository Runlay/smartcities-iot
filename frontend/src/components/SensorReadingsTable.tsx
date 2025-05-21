import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
  TableBody,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSensorReadings } from '@/context/SensorReadingsContext';

const SensorReadingsTable = () => {
  const sensorReadings = useSensorReadings();

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
