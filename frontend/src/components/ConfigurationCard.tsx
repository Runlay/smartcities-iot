import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { Button } from './ui/button';

interface ConfigurationCardProps {
  type: string;
  unit?: string;
  description: string;
  defaultValue?: number;
  defaultThreshold?: number;
}

const ConfigurationCard = ({
  type,
  unit,
  description,
  defaultValue,
  defaultThreshold,
}: ConfigurationCardProps) => {
  const [targetValue, setTargetValue] = useState<number | undefined>(
    defaultValue
  );
  const [targetThreshold, setTargetThreshold] = useState<number | undefined>(
    defaultThreshold
  );

  const handleTargetTemperatureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setTargetValue(value);
    }
  };

  const handleTemperatureThresholdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setTargetThreshold(value);
    }
  };

  // const handleSubmit = () => {
  //   const configuration = {
  //     targetThreshold: targetThreshold,
  //     targetValue: targetValue,
  //   };

  // };

  let targetInterval = {
    start: 0,
    end: 0,
  };
  if (targetValue && targetThreshold) {
    targetInterval = {
      start: targetValue - targetThreshold,
      end: targetValue + targetThreshold,
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type} Configuration</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        {targetValue && (
          <p className='flex max-w-sm flex-col gap-2'>
            <Label htmlFor='target-temperature'>
              Target {type} ({unit})
            </Label>
            <Input
              type='number'
              id='target-temperature'
              onChange={handleTargetTemperatureChange}
              value={targetValue}
            />
          </p>
        )}

        <p className='flex max-w-sm flex-col gap-2'>
          <Label htmlFor='temperature-threshold'>
            {type} Threshold ({unit})
          </Label>
          <Input
            type='number'
            id='temperature-threshold'
            onChange={handleTemperatureThresholdChange}
            value={targetThreshold}
          />
        </p>

        {targetValue && (
          <p>
            <h3>Target Interval</h3>
            <span className='text-muted-foreground text-sm'>
              {targetInterval.start}
              {unit} - {targetInterval.end}
              {unit}
            </span>
          </p>
        )}
      </CardContent>

      <CardFooter>
        {/* TODO: handle click: send message with new values */}
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigurationCard;
