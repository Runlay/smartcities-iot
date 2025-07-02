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

  if (!currentPlan) {
    return (
      <Card className='bg-background'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>No Plan Yet</CardTitle>
          <CardDescription className='text-muted-foreground text-sm'>
            Created: -
          </CardDescription>
        </CardHeader>

        <CardContent className='text-muted-foreground'>
          Please wait for the system to execute a plan.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-background'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>
          Plan {currentPlan.id}
        </CardTitle>
        <CardDescription className='text-muted-foreground text-sm'>
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
