import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SensorReadingTable() {
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
        <TableRow>
          <TableCell className="text-left">2025-05-14T19:44:30.262Z</TableCell>
          <TableCell className="text-left">Temperature</TableCell>
          <TableCell className="text-left">21°C</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
