import { useContext } from 'react';
import { SensorReadingsContext } from '@/context/SensorReadingsContext';
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
  TableBody,
} from './ui/table';

const SensorReadingsTable = () => {
  const sensorReadings = useContext(SensorReadingsContext);

  return (
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
  );
};

export default SensorReadingsTable;
