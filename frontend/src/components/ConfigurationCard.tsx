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
import type { ConfigKey } from '@/types/types';
import { capitalize } from '@/lib/utils';

interface ConfigurationCardProps {
  type: ConfigKey;
  unit: string;
  description: string;
  defaultValue?: number;
  defaultThreshold: number;
  onSubmit: (
    type: ConfigKey,
    targetValue: number | undefined,
    targetThreshold: number
  ) => void;
}

const ConfigurationCard = ({
  type,
  unit,
  description,
  defaultValue,
  defaultThreshold,
  onSubmit,
}: ConfigurationCardProps) => {
  const [targetValue, setTargetValue] = useState<number | undefined>(
    defaultValue
  );
  const [targetThreshold, setTargetThreshold] =
    useState<number>(defaultThreshold);

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
        <CardTitle>{capitalize(type)} Configuration</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        {targetValue && (
          <div className='flex max-w-sm flex-col gap-2'>
            <Label htmlFor={`target-${type.toLowerCase()}`}>
              Target {capitalize(type)} ({unit})
            </Label>
            <Input
              type='number'
              id={`target-${type.toLowerCase()}`}
              onChange={handleTargetTemperatureChange}
              value={targetValue}
            />
          </div>
        )}

        <div className='flex max-w-sm flex-col gap-2'>
          <Label htmlFor={`${type.toLowerCase()}-threshold`}>
            {capitalize(type)} Threshold ({unit})
          </Label>
          <Input
            type='number'
            id={`${type.toLowerCase()}-threshold`}
            onChange={handleTemperatureThresholdChange}
            value={targetThreshold}
          />
        </div>

        {targetValue && (
          <div>
            <h3>Target Interval</h3>
            <span className='text-muted-foreground text-sm'>
              {targetInterval.start}
              {unit} - {targetInterval.end}
              {unit}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {/* TODO: handle click: send message with new values */}
        <Button onClick={() => onSubmit(type, targetValue, targetThreshold)}>
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigurationCard;
