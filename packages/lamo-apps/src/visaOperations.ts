import { defaultApprovalEngine, PendingAction } from '@lamo/approval-engine';
import { n8nGatekeeper } from '@lamo/policy-engine';

export interface eVisaApplication {
  applicationId: string;
  applicantName: string;
  passportNumber: string;
  entryPort: string;
  processingTier: 'standard' | 'urgent' | 'emergency';
  status: 'received' | 'document_check' | 'n8n_triggered' | 'approved';
}

export class VisaOperationsApp {
  private applications: eVisaApplication[] = [];

  constructor() {
    this.applications = [
      {
        applicationId: 'EV-2026-001',
        applicantName: 'John Doe',
        passportNumber: 'A12345678',
        entryPort: 'Tan Son Nhat (SGN)',
        processingTier: 'urgent',
        status: 'received',
      },
      {
        applicationId: 'EV-2026-002',
        applicantName: 'Alice Smith',
        passportNumber: 'B87654321',
        entryPort: 'Noi Bai (HAN)',
        processingTier: 'standard',
        status: 'document_check',
      }
    ];
  }

  public getApplications(): eVisaApplication[] {
    return this.applications;
  }

  public async triggerN8nWorkflow(applicationId: string, workflowName: string): Promise<PendingAction> {
    const app = this.applications.find(a => a.applicationId === applicationId);
    if (!app) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const permissionReq = {
      agentId: 'visa-operations-specialist',
      resource: 'n8n' as const,
      action: 'trigger' as const,
      scope: `workflow:${workflowName}`,
      payload: { applicationId, applicantName: app.applicantName, port: app.entryPort },
    };

    const evaluation = n8nGatekeeper.evaluatePermission(permissionReq);
    const simulation = await n8nGatekeeper.simulate(permissionReq);

    const pendingAction = defaultApprovalEngine.enqueueAction(
      permissionReq,
      evaluation.riskLevel,
      simulation.simulatedOutput,
      { previousAppStatus: app.status }
    );

    app.status = 'n8n_triggered';
    return pendingAction;
  }
}

export const defaultVisaOperationsApp = new VisaOperationsApp();
