import { LamoCompanyContext, KnowledgeItem } from './types.js';

export const DEFAULT_LAMO_CONTEXT: LamoCompanyContext = {
  companyName: 'LAMO Company',
  primaryDomain: 'os.tinhgon.com',
  vpsIp: '190.102.110.208',
  products: ['Vietnam Entry Visa', 'Airport Fast Track', 'Visa Extension Support'],
  sops: ['eVisa Verification SOP', 'Customer Support Triage SOP', 'Gatekeeper Security Policy'],
  knowledgeBaseSummary: 'LAMO operates Vietnam Entry Visa portal, automation pipelines via n8n, CRM via EspoCRM, and CMS via Directus & WordPress.'
};

export class LamoContextBuilder {
  private companyContext: LamoCompanyContext;

  constructor(context: Partial<LamoCompanyContext> = {}) {
    this.companyContext = { ...DEFAULT_LAMO_CONTEXT, ...context };
  }

  public buildSystemPromptHeader(agentName: string, items: KnowledgeItem[] = []): string {
    const knowledgeText = items.map(item => `- [${item.category ?? item.source}] ${item.title}: ${item.content}`).join('\n');

    return `=== LAMO OS KNOWLEDGE CONTEXT ===
Company: ${this.companyContext.companyName} (${this.companyContext.primaryDomain})
Target Systems: Directus, EspoCRM, WooCommerce, n8n, WordPress
Core Business: ${this.companyContext.products.join(', ')}

Active Agent: ${agentName}

Relevant Knowledge Items:
${knowledgeText.length > 0 ? knowledgeText : '(No specific knowledge items loaded for this prompt)'}
===================================\n\n`;
  }
}

export const defaultContextBuilder = new LamoContextBuilder();
