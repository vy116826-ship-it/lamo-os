import { defaultAgentRegistry, LamoAgentDefinition } from '@lamo/agent-registry';
import { defaultModelRouter, ModelSelection, TaskComplexity } from '@lamo/model-router';

export interface OrchestrationResult {
  agent: LamoAgentDefinition;
  model: ModelSelection;
  reasoning: string;
}

export class LamoOrchestrator {
  public routeUserRequest(prompt: string): OrchestrationResult {
    const lower = prompt.toLowerCase();

    let selectedAgentId = 'project-manager';
    let complexity: TaskComplexity = 'standard';
    let reason = 'Defaulting to Project Manager for general coordination.';

    if (lower.includes('visa') || lower.includes('evisa') || lower.includes('applicant') || lower.includes('entry visa')) {
      selectedAgentId = 'visa-operations-specialist';
      complexity = 'reasoning';
      reason = 'Routing to Visa Operations Specialist for eVisa processing task.';
    } else if (lower.includes('ui') || lower.includes('component') || lower.includes('frontend') || lower.includes('css') || lower.includes('react')) {
      selectedAgentId = 'frontend-developer';
      complexity = 'standard';
      reason = 'Routing to Frontend Developer for UI/UX work.';
    } else if (lower.includes('api') || lower.includes('worker') || lower.includes('backend') || lower.includes('database') || lower.includes('schema')) {
      selectedAgentId = 'backend-architect';
      complexity = 'reasoning';
      reason = 'Routing to Backend Architect for system/API work.';
    } else if (lower.includes('deploy') || lower.includes('wrangler') || lower.includes('docker') || lower.includes('vps') || lower.includes('cicd')) {
      selectedAgentId = 'devops-automator';
      complexity = 'standard';
      reason = 'Routing to DevOps Automator for deployment/server task.';
    } else if (lower.includes('security') || lower.includes('audit') || lower.includes('auth') || lower.includes('gatekeeper') || lower.includes('token')) {
      selectedAgentId = 'security-analyst';
      complexity = 'reasoning';
      reason = 'Routing to Security Analyst for access & security audit.';
    } else if (lower.includes('test') || lower.includes('e2e') || lower.includes('playwright') || lower.includes('qa')) {
      selectedAgentId = 'qa-engineer';
      complexity = 'standard';
      reason = 'Routing to QA Engineer for verification and testing.';
    } else if (lower.includes('content') || lower.includes('article') || lower.includes('post') || lower.includes('copy')) {
      selectedAgentId = 'content-strategist';
      complexity = 'standard';
      reason = 'Routing to Content Strategist for copywriting.';
    } else if (lower.includes('seo') || lower.includes('keyword') || lower.includes('google rank') || lower.includes('lighthouse')) {
      selectedAgentId = 'seo-specialist';
      complexity = 'standard';
      reason = 'Routing to SEO Specialist for optimization.';
    } else if (lower.includes('doc') || lower.includes('sop') || lower.includes('markdown') || lower.includes('guide')) {
      selectedAgentId = 'technical-writer';
      complexity = 'fast';
      reason = 'Routing to Technical Writer for documentation.';
    } else if (lower.includes('metric') || lower.includes('analytics') || lower.includes('data') || lower.includes('report')) {
      selectedAgentId = 'data-analyst';
      complexity = 'standard';
      reason = 'Routing to Data Analyst for reporting.';
    }

    const agent = defaultAgentRegistry.getAgent(selectedAgentId) ?? defaultAgentRegistry.getAllAgents()[0];
    const model = defaultModelRouter.routeTask(complexity, agent.preferredModelTier === 'fast' ? 'google' : undefined);

    return {
      agent,
      model,
      reasoning: reason,
    };
  }
}

export const defaultOrchestrator = new LamoOrchestrator();
