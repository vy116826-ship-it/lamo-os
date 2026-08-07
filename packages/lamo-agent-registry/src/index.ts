import { CURATED_LAMO_AGENTS, LamoAgentDefinition } from './agents.js';

export * from './agents.js';

export class LamoAgentRegistry {
  private agentsMap = new Map<string, LamoAgentDefinition>();

  constructor(agents: LamoAgentDefinition[] = CURATED_LAMO_AGENTS) {
    for (const agent of agents) {
      this.agentsMap.set(agent.id, agent);
    }
  }

  public getAgent(id: string): LamoAgentDefinition | undefined {
    return this.agentsMap.get(id);
  }

  public getAllAgents(): LamoAgentDefinition[] {
    return Array.from(this.agentsMap.values());
  }

  public getAgentsByDivision(division: LamoAgentDefinition['division']): LamoAgentDefinition[] {
    return this.getAllAgents().filter(a => a.division === division);
  }

  public findAgentsByCapability(capability: string): LamoAgentDefinition[] {
    return this.getAllAgents().filter(a => a.capabilities.includes(capability));
  }
}

export const defaultAgentRegistry = new LamoAgentRegistry();
