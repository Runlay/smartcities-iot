import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PlanStep } from '@/types';
import { Badge } from '@/components/ui/badge';
import { capitalize } from '@/lib/utils';
import PlanStepCard from './PlanStepCard';
import { usePlanStore } from '@/store/plan-store';

const PlanExecution = () => {
  const { currentPlan } = usePlanStore();

  return (
    <Card className='bg-background'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>
          Plan {currentPlan.id}
        </CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          Created: {new Date(currentPlan.createdAt).toLocaleString()}
        </CardDescription>
        <CardAction>
          <Badge>{capitalize(currentPlan.status)}</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        {currentPlan.steps.map((step) => (
          <PlanStepCard key={step.timestamp} planStep={step as PlanStep} />
        ))}
      </CardContent>
    </Card>
  );
};

export default PlanExecution;
