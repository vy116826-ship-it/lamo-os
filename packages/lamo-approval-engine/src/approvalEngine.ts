import { ActionPermissionRequest, RiskLevel } from '@lamo/policy-engine';
import { AuditEntry, PendingAction } from './types.js';

export class LamoApprovalEngine {
  private pendingQueue = new Map<string, PendingAction>();
  private auditLogs: AuditEntry[] = [];

  public enqueueAction(
    req: ActionPermissionRequest,
    riskLevel: RiskLevel,
    simulatedResult: unknown,
    beforeSnapshot?: unknown
  ): PendingAction {
    const traceId = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const pendingItem: PendingAction = {
      traceId,
      agentId: req.agentId,
      action: req.action,
      resource: req.resource,
      riskLevel,
      beforeSnapshot,
      simulatedResult,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.pendingQueue.set(traceId, pendingItem);
    return pendingItem;
  }

  public getPendingActions(): PendingAction[] {
    return Array.from(this.pendingQueue.values()).filter(item => item.status === 'pending');
  }

  public getActionByTraceId(traceId: string): PendingAction | undefined {
    return this.pendingQueue.get(traceId);
  }

  public approveAction(traceId: string, approvedBy: string): PendingAction {
    const item = this.pendingQueue.get(traceId);
    if (!item) {
      throw new Error(`Action with traceId ${traceId} not found.`);
    }

    item.status = 'approved';
    item.approvedBy = approvedBy;
    item.executedAt = new Date().toISOString();

    const auditEntry: AuditEntry = {
      auditId: `aud_${Date.now()}`,
      traceId: item.traceId,
      agentId: item.agentId,
      action: item.action,
      resource: item.resource,
      riskLevel: item.riskLevel,
      decision: 'approved',
      decidedBy: approvedBy,
      timestamp: item.executedAt,
    };

    this.auditLogs.push(auditEntry);
    return item;
  }

  public rejectAction(traceId: string, rejectedBy: string, reason?: string): PendingAction {
    const item = this.pendingQueue.get(traceId);
    if (!item) {
      throw new Error(`Action with traceId ${traceId} not found.`);
    }

    item.status = 'rejected';
    item.rejectionReason = reason;

    const auditEntry: AuditEntry = {
      auditId: `aud_${Date.now()}`,
      traceId: item.traceId,
      agentId: item.agentId,
      action: item.action,
      resource: item.resource,
      riskLevel: item.riskLevel,
      decision: 'rejected',
      decidedBy: rejectedBy,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.push(auditEntry);
    return item;
  }

  public getAuditTrail(): AuditEntry[] {
    return [...this.auditLogs];
  }
}

export const defaultApprovalEngine = new LamoApprovalEngine();
