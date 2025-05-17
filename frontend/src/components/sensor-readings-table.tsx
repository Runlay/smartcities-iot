import { useState, useEffect } from 'react';
import { connectMQTT, disconnectMQTT } from '../services/mqtt-client';
import type { SensorReading } from '../types/types';
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
  TableBody,
} from './ui/table';

const SensorReadingsTable = () => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    connectMQTT((sensorReading) => {
      setSensorReadings([...sensorReadings, sensorReading]);
    });

    return () => {
      disconnectMQTT();
    };
  }, []);

  const sensorReadingRows = sensorReadings.map((sensorReading) => (
    <TableRow key={sensorReading.instanceId}>
      <TableCell>{sensorReading.timestamp}</TableCell>
      <TableCell>{sensorReading.typeId}</TableCell>
      <TableCell>{JSON.stringify(sensorReading.value)}</TableCell>
    </TableRow>
  ));

  return (
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
  );
};

export default SensorReadingsTable;
