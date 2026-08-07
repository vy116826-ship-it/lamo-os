import { ActionType, LamoResource, RiskLevel } from '@lamo/policy-engine';

export type ActionStatus = 'pending' | 'approved' | 'rejected' | 'executed';

export interface PendingAction {
  traceId: string;
  agentId: string;
  action: ActionType;
  resource: LamoResource;
  riskLevel: RiskLevel;
  beforeSnapshot?: unknown;
  simulatedResult: unknown;
  status: ActionStatus;
  createdAt: string;
  approvedBy?: string;
  executedAt?: string;
  rejectionReason?: string;
}

export interface AuditEntry {
  auditId: string;
  traceId: string;
  agentId: string;
  action: ActionType;
  resource: LamoResource;
  riskLevel: RiskLevel;
  decision: 'approved' | 'rejected';
  decidedBy: string;
  timestamp: string;
}
