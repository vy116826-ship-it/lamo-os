import { ActionPermissionRequest, LamoGatekeeper, LamoResource, PolicyEvaluation } from './types.js';
import { defaultPolicyEngine } from './policyEngine.js';

export class BaseLamoGatekeeper implements LamoGatekeeper {
  public resource: LamoResource;

  constructor(resource: LamoResource) {
    this.resource = resource;
  }

  public evaluatePermission(req: ActionPermissionRequest): PolicyEvaluation {
    return defaultPolicyEngine.evaluate(req);
  }

  public async simulate(req: ActionPermissionRequest): Promise<{ simulatedOutput: unknown; status: 'simulated' }> {
    return {
      simulatedOutput: {
        message: `[SIMULATION] Action ${req.action} on ${req.resource} with scope ${req.scope} simulated successfully.`,
        payloadPreview: req.payload,
        timestamp: new Date().toISOString(),
      },
      status: 'simulated',
    };
  }
}

export const n8nGatekeeper = new BaseLamoGatekeeper('n8n');
export const directusGatekeeper = new BaseLamoGatekeeper('directus');
export const wordpressGatekeeper = new BaseLamoGatekeeper('wordpress');
export const githubGatekeeper = new BaseLamoGatekeeper('github');
export const espocrmGatekeeper = new BaseLamoGatekeeper('espocrm');
export const googleGatekeeper = new BaseLamoGatekeeper('google');
export const woocommerceGatekeeper = new BaseLamoGatekeeper('woocommerce');
export const mauticGatekeeper = new BaseLamoGatekeeper('mautic');
