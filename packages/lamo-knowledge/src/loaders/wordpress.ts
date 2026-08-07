import { KnowledgeItem, KnowledgeLoader } from '../types.js';

export interface WordPressConfig {
  baseUrl: string; // e.g. "https://vietnamentryvisa.com"
  apiKey?: string;
}

export class WordPressKnowledgeLoader implements KnowledgeLoader {
  public sourceType = 'wordpress' as const;
  private config: WordPressConfig;

  constructor(config: Partial<WordPressConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? 'https://vietnamentryvisa.com',
      apiKey: config.apiKey,
    };
  }

  public async loadKnowledge(query?: string): Promise<KnowledgeItem[]> {
    // In production, fetches WP REST API: /wp-json/wp/v2/posts and /wp-json/wp/v2/pages
    return [
      {
        id: 'wp-evisa-requirements-2026',
        source: 'wordpress',
        title: 'Vietnam eVisa Requirements & Eligible Countries 2026',
        category: 'Visa Policy',
        content: `Vietnam electronic visa (eVisa) is valid for up to 90 days with single or multiple entries.
Applicants require a valid passport (min 6 months validity), passport photo, and entry port details.
Processing standard time: 3 business days. Emergency processing: 1-4 hours available.`,
        url: `${this.config.baseUrl}/evisa-requirements`,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'wp-evisa-fast-track-service',
        source: 'wordpress',
        title: 'Airport Fast Track & Arrival Support Service',
        category: 'Services',
        content: `Airport Fast Track assists international travelers through immigration lines at Tan Son Nhat (SGN), Noi Bai (HAN), and Da Nang (DAD) airports.`,
        url: `${this.config.baseUrl}/fast-track-service`,
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}
