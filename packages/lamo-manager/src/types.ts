import { PendingAction } from '@lamo/approval-engine';

export type PipelineStepStatus = 'pending' | 'executing' | 'awaiting_approval' | 'completed' | 'failed';

export interface PipelineStep {
  stepId: string;
  stepName: string;
  agentId: string;
  actionRequired: string;
  status: PipelineStepStatus;
  output?: unknown;
  pendingAction?: PendingAction;
}

export interface AutonomousPipeline {
  pipelineId: string;
  goalPrompt: string;
  steps: PipelineStep[];
  status: 'planning' | 'running' | 'paused_for_approval' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}
