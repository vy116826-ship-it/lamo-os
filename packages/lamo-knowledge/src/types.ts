export type KnowledgeSourceType = 'wordpress' | 'directus' | 'github' | 'googledocs';

export interface KnowledgeItem {
  id: string;
  source: KnowledgeSourceType;
  title: string;
  content: string;
  category?: string;
  url?: string;
  updatedAt: string;
}

export interface KnowledgeLoader {
  sourceType: KnowledgeSourceType;
  loadKnowledge(query?: string): Promise<KnowledgeItem[]>;
}

export interface LamoCompanyContext {
  companyName: string;
  primaryDomain: string;
  vpsIp: string;
  products: string[];
  sops: string[];
  knowledgeBaseSummary: string;
}
