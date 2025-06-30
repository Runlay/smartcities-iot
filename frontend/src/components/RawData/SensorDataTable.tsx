import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { ScrollArea } from '@/components/ui/scroll-area';

import type { SensorData, RawSensorData } from '@/types';
import { capitalize } from '@/lib/utils';
import { useDataStore } from '@/store/data-store';

const SensorDataTable = () => {
  const { sensorData } = useDataStore();

  return (
    <ScrollArea className='h-[70vh] w-full rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Sensor</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Raw JSON Payload</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sensorData.map((data) => {
            const rawData = data as RawSensorData;
            const sensorData = rawData.sensorData as SensorData;

            return (
              <TableRow key={sensorData.instanceId}>
                <TableCell className='text-muted-foreground'>
                  {sensorData.timestamp.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>
                    {capitalize(sensorData.type)}
                  </Badge>
                </TableCell>
                <TableCell className='font-medium'>
                  {sensorData.value} {sensorData.unit}
                </TableCell>
                <TableCell className='text-muted-foreground font-mono text-sm'>
                  <pre className='whitespace-pre-wrap'>
                    {JSON.stringify(JSON.parse(rawData.jsonPayload), null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default SensorDataTable;
