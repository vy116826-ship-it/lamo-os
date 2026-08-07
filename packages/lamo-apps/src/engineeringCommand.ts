import { defaultApprovalEngine, PendingAction } from '@lamo/approval-engine';
import { githubGatekeeper } from '@lamo/policy-engine';

export interface EngineeringTask {
  issueId: string;
  title: string;
  repo: string;
  severity: 'low' | 'medium' | 'critical';
  status: 'open' | 'pr_created' | 'merged';
}

export class EngineeringCommandApp {
  private issues: EngineeringTask[] = [];

  constructor() {
    this.issues = [
      {
        issueId: 'ISSUE-101',
        title: 'Optimize Workers D1 query indexing for eVisa applications',
        repo: 'vy116826-ship-it/lamo-os',
        severity: 'medium',
        status: 'open',
      }
    ];
  }

  public getIssues(): EngineeringTask[] {
    return this.issues;
  }

  public async requestPullRequestDraft(issueId: string, prTitle: string): Promise<PendingAction> {
    const issue = this.issues.find(i => i.issueId === issueId);
    if (!issue) {
      throw new Error(`Issue ${issueId} not found.`);
    }

    const permissionReq = {
      agentId: 'backend-architect',
      resource: 'github' as const,
      action: 'create' as const,
      scope: `pr:${issue.repo}`,
      payload: { issueId, prTitle, repo: issue.repo },
    };

    const evaluation = githubGatekeeper.evaluatePermission(permissionReq);
    const simulation = await githubGatekeeper.simulate(permissionReq);

    const pendingAction = defaultApprovalEngine.enqueueAction(
      permissionReq,
      evaluation.riskLevel,
      simulation.simulatedOutput,
      { issueStatus: issue.status }
    );

    issue.status = 'pr_created';
    return pendingAction;
  }
}

export const defaultEngineeringCommandApp = new EngineeringCommandApp();
