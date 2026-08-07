export type ModelProvider = 'anthropic' | 'google' | 'openai';

export type TaskComplexity = 'fast' | 'standard' | 'complex' | 'reasoning';

export interface ModelSelection {
  provider: ModelProvider;
  modelId: string;
  reasoningBudget?: number;
}

export interface RouterConfig {
  defaultProvider: ModelProvider;
  anthropicKeyConfigured: boolean;
  googleKeyConfigured: boolean;
  openaiKeyConfigured: boolean;
}

export class LamoModelRouter {
  private config: RouterConfig;

  constructor(config: Partial<RouterConfig> = {}) {
    this.config = {
      defaultProvider: config.defaultProvider ?? 'google',
      anthropicKeyConfigured: config.anthropicKeyConfigured ?? true,
      googleKeyConfigured: config.googleKeyConfigured ?? true,
      openaiKeyConfigured: config.openaiKeyConfigured ?? true,
    };
  }

  public routeTask(complexity: TaskComplexity, preferredProvider?: ModelProvider): ModelSelection {
    const provider = preferredProvider ?? this.selectProvider(complexity);

    switch (complexity) {
      case 'fast':
        return this.getFastModel(provider);
      case 'complex':
      case 'reasoning':
        return this.getReasoningModel(provider);
      case 'standard':
      default:
        return this.getStandardModel(provider);
    }
  }

  private selectProvider(complexity: TaskComplexity): ModelProvider {
    if (complexity === 'reasoning' && this.config.anthropicKeyConfigured) {
      return 'anthropic';
    }
    if (complexity === 'fast' && this.config.googleKeyConfigured) {
      return 'google';
    }
    if (this.config.openaiKeyConfigured) {
      return 'openai';
    }
    return this.config.defaultProvider;
  }

  private getFastModel(provider: ModelProvider): ModelSelection {
    switch (provider) {
      case 'anthropic':
        return { provider: 'anthropic', modelId: 'claude-3-5-haiku-latest' };
      case 'google':
        return { provider: 'google', modelId: 'gemini-2.5-flash' };
      case 'openai':
        return { provider: 'openai', modelId: 'gpt-4o-mini' };
    }
  }

  private getStandardModel(provider: ModelProvider): ModelSelection {
    switch (provider) {
      case 'anthropic':
        return { provider: 'anthropic', modelId: 'claude-3-7-sonnet-latest' };
      case 'google':
        return { provider: 'google', modelId: 'gemini-2.5-pro' };
      case 'openai':
        return { provider: 'openai', modelId: 'gpt-4o' };
    }
  }

  private getReasoningModel(provider: ModelProvider): ModelSelection {
    switch (provider) {
      case 'anthropic':
        return { provider: 'anthropic', modelId: 'claude-3-7-sonnet-latest', reasoningBudget: 8000 };
      case 'google':
        return { provider: 'google', modelId: 'gemini-2.5-pro' };
      case 'openai':
        return { provider: 'openai', modelId: 'o3-mini' };
    }
  }
}

export const defaultModelRouter = new LamoModelRouter();
