import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalize } from '@/lib/utils';
import type { PlanStep as PlanStep } from '@/types';

interface PlanStepCardProps {
  planStep: PlanStep;
}

const PlanStepCard = ({ planStep }: PlanStepCardProps) => {
  const title =
    planStep.actuator === 'ac' ? 'AC' : capitalize(planStep.actuator);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}: <span className='uppercase'>{planStep.action}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p>Timestamp: {new Date(planStep.timestamp).toLocaleTimeString()}</p>
      </CardContent>
    </Card>
  );
};

export default PlanStepCard;
