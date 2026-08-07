import { defaultApprovalEngine, PendingAction } from '@lamo/approval-engine';
import { wordpressGatekeeper } from '@lamo/policy-engine';

export interface ContentDraft {
  draftId: string;
  title: string;
  category: string;
  content: string;
  status: 'draft' | 'pending_approval' | 'published';
}

export class MarketingCommandApp {
  private drafts: ContentDraft[] = [];

  constructor() {
    this.drafts = [
      {
        draftId: 'draft-seo-01',
        title: 'Guide to Vietnam Visa On Arrival & eVisa in 2026',
        category: 'SEO Content',
        content: 'Complete guide on how to get Vietnam eVisa fast and hassle-free...',
        status: 'draft',
      }
    ];
  }

  public getDrafts(): ContentDraft[] {
    return this.drafts;
  }

  public async requestPublishDraft(draftId: string): Promise<PendingAction> {
    const draft = this.drafts.find(d => d.draftId === draftId);
    if (!draft) {
      throw new Error(`Draft ${draftId} not found.`);
    }

    const permissionReq = {
      agentId: 'content-strategist',
      resource: 'wordpress' as const,
      action: 'publish' as const,
      scope: `post:${draft.title}`,
      payload: { title: draft.title, content: draft.content },
    };

    const evaluation = wordpressGatekeeper.evaluatePermission(permissionReq);
    const simulation = await wordpressGatekeeper.simulate(permissionReq);

    const pendingAction = defaultApprovalEngine.enqueueAction(
      permissionReq,
      evaluation.riskLevel,
      simulation.simulatedOutput,
      { draftStatus: draft.status }
    );

    draft.status = 'pending_approval';
    return pendingAction;
  }
}

export const defaultMarketingCommandApp = new MarketingCommandApp();
