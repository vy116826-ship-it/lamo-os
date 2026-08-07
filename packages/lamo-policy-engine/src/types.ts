export type LamoResource = 'github' | 'google' | 'n8n' | 'directus' | 'espocrm' | 'woocommerce' | 'wordpress' | 'mautic';

export type ActionType = 'read' | 'create' | 'update' | 'delete' | 'trigger' | 'publish';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ActionPermissionRequest {
  agentId: string;
  resource: LamoResource;
  action: ActionType;
  scope: string;
  payload?: unknown;
}

export interface PolicyEvaluation {
  allowed: boolean;
  requiresApproval: boolean;
  riskLevel: RiskLevel;
  reason: string;
}

export interface LamoGatekeeper {
  resource: LamoResource;
  evaluatePermission(req: ActionPermissionRequest): PolicyEvaluation;
  simulate(req: ActionPermissionRequest): Promise<{ simulatedOutput: unknown; status: 'simulated' }>;
}
