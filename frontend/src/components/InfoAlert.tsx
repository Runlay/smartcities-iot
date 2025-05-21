import { Alert, AlertDescription } from '@/components/ui/alert';

import { Info } from 'lucide-react';

interface InfoAlertProps {
  description: string;
}

const InfoAlert = ({ description }: InfoAlertProps) => {
  return (
    <Alert className='mt-2 mb-10'>
      <Info className='h-4 w-4' />
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default InfoAlert;
