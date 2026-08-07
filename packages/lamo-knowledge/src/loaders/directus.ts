import { KnowledgeItem, KnowledgeLoader } from '../types.js';

export interface DirectusConfig {
  baseUrl: string; // e.g. "http://190.102.110.208:8055" or domain
  token?: string;
}

export class DirectusKnowledgeLoader implements KnowledgeLoader {
  public sourceType = 'directus' as const;
  private config: DirectusConfig;

  constructor(config: Partial<DirectusConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? 'http://190.102.110.208:8055',
      token: config.token,
    };
  }

  public async loadKnowledge(query?: string): Promise<KnowledgeItem[]> {
    // In production, queries Directus collections /items/products & /items/visa_pricing
    return [
      {
        id: 'directus-product-evisa-90d-multi',
        source: 'directus',
        title: 'Product Catalog: Vietnam 90-Day Multiple Entry eVisa',
        category: 'Products',
        content: `Product ID: EV-90M
Base fee: $50 USD
Processing fee: $25 USD
Options: Standard (3 days), Urgent (1 day), Emergency (4 hours).`,
        url: `${this.config.baseUrl}/admin/content/products/EV-90M`,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'directus-system-infrastructure',
        source: 'directus',
        title: 'LAMO Infrastructure Registry',
        category: 'Infrastructure',
        content: `VPS Server: 190.102.110.208 (Port 2287)
Services: Directus, EspoCRM, WooCommerce, n8n Automation Engine, Mautic.`,
        url: `${this.config.baseUrl}/admin/content/infra`,
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}
