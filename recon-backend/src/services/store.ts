import type { Claim, Invoice } from '../types';

/**
 * In-memory store for claims and invoices.
 * Singleton instance used throughout the application.
 */
class InMemoryStore {
  claims: Map<string, Claim> = new Map();
  invoicesByClaim: Map<string, Invoice[]> = new Map();

  reset() {
    this.claims.clear();
    this.invoicesByClaim.clear();
  }
}

export const store = new InMemoryStore();
