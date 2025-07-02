import { create } from 'zustand';
import type { Plan } from '@/types';
import { addMqttMessagehandler } from '@/lib/mqtt-client';

interface PlanStore {
  currentPlan?: Plan;
  setPlan: (plan: Plan) => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  currentPlan: undefined,
  setPlan: (plan: Plan) => set({ currentPlan: plan }),
}));

const handlePlanMessage = (topic: string, message: object) => {
  console.log('Received plan update:', topic, message);

  if (topic === 'planner/plan') {
    usePlanStore.getState().setPlan(message as Plan);
  }
};

addMqttMessagehandler('planner/', handlePlanMessage);
