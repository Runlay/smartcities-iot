import { create } from 'zustand';
import type { Plan, PlanStep } from '@/types';
import { addMqttMessagehandler } from '@/lib/mqtt-client';

const INITIAL_PLAN_STEPS: PlanStep[] = [];

const INITIAL_PLAN: Plan = {
  id: '',
  status: 'pending',
  steps: INITIAL_PLAN_STEPS,
  createdAt: new Date().toISOString(),
};

interface PlanStore {
  currentPlan: Plan;
  setPlan: (plan: Plan) => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  currentPlan: INITIAL_PLAN,
  setPlan: (plan: Plan) => set({ currentPlan: plan }),
}));

const handlePlanMessage = (topic: string, message: object) => {
  console.log('Received plan update:', topic, message);

  if (topic === 'planner/plan') {
    usePlanStore.getState().setPlan(message as Plan);
  }
};

addMqttMessagehandler('planner/', handlePlanMessage);
