import { ActionPermissionRequest, PolicyEvaluation, RiskLevel } from './types.js';

export class LamoPolicyEngine {
  public evaluate(req: ActionPermissionRequest): PolicyEvaluation {
    // 1. Read actions: generally Low risk and auto-allowed without approval
    if (req.action === 'read') {
      return {
        allowed: true,
        requiresApproval: false,
        riskLevel: 'low',
        reason: `Read access granted for ${req.resource}:${req.scope}.`,
      };
    }

    // 2. Write actions to WooCommerce or root SSH are strictly forbidden in V1
    if (req.resource === 'woocommerce' && (req.action === 'update' || req.action === 'delete')) {
      return {
        allowed: false,
        requiresApproval: true,
        riskLevel: 'high',
        reason: 'V1 Guard Rail: Direct modification of production WooCommerce data is blocked.',
      };
    }

    // 3. Draft actions (WordPress draft, GitHub issue/PR draft) -> Low/Medium risk, requires approval
    if (req.action === 'create' || req.action === 'update') {
      const risk: RiskLevel = req.resource === 'github' ? 'medium' : 'low';
      return {
        allowed: true,
        requiresApproval: true,
        riskLevel: risk,
        reason: `Action ${req.action} on ${req.resource} requires human approval before execution.`,
      };
    }

    // 4. Publishing / Triggering workflows / Deleting -> High risk, requires human approval
    if (req.action === 'publish' || req.action === 'trigger' || req.action === 'delete') {
      return {
        allowed: true,
        requiresApproval: true,
        riskLevel: 'high',
        reason: `High-risk action (${req.action}) on ${req.resource} requires mandatory human approval.`,
      };
    }

    return {
      allowed: false,
      requiresApproval: true,
      riskLevel: 'high',
      reason: 'Default Deny: Action is not explicitly permitted.',
    };
  }
}

export const defaultPolicyEngine = new LamoPolicyEngine();
