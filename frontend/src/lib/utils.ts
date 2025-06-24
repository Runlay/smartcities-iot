import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { SensorReading } from '@/types/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSensorValue(sensorReading: SensorReading): string {
  const typeId = sensorReading.typeId;
  const value = sensorReading.value;

  // Extract sensor type from type-id (e.g., "de.uni-stuttgart.sciot.aeon/temperature" -> "temperature")
  const sensorType = typeId.split('/').pop();

  switch (sensorType) {
    case 'temperature':
      return `${value.degrees}°C`;
    case 'humidity':
      return `${value.percent}%`;
    case 'motion':
      return value.detected ? 'Motion Detected' : 'No Motion';
    case 'pressure':
      return `${value.kg} kg`;
    default:
      return JSON.stringify(value);
  }
}

export function formatCurrentSensorValue(
  sensorType: string,
  value: number | boolean
): string {
  switch (sensorType) {
    case 'temperature':
      return `${value}°C`;
    case 'humidity':
      return `${value}%`;
    case 'motion':
      return value ? 'Motion Detected' : 'No Motion Detected';
    case 'pressure':
      return `${value} kg`;
    default:
      return String(value);
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
