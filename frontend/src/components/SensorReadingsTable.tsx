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
import { formatSensorValue } from '@/lib/utils';

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
            <TableRow key={sensorReading['instanceId']}>
              <TableCell>
                {new Date(sensorReading.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>{sensorReading['typeId'].split('/').pop()}</TableCell>
              <TableCell>{formatSensorValue(sensorReading)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default SensorReadingsTable;
