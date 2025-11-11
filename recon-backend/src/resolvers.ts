import type { Claim, Invoice } from './types';
import { store } from './services/store';
import { transformClaims, transformInvoices } from './services/csv';
import { reconcileAll } from './services/reconciliation';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { parse } from 'csv-parse';

async function readCsvStream<T extends Record<string, any> = Record<string, any>>(stream: NodeJS.ReadableStream): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const rows: T[] = [];
    stream
      .pipe(parse({ columns: true, trim: true, skip_empty_lines: true }))
      .on('data', (r: T) => rows.push(r))
      .on('error', reject)
      .on('end', () => resolve(rows));
  });
}

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    summary: () => {
      const rows = reconcileAll();
      const out = {
        totalClaims: rows.length,
        balanced: rows.filter(r => r.status === 'BALANCED').length,
        overpaid: rows.filter(r => r.status === 'OVERPAID').length,
        underpaid: rows.filter(r => r.status === 'UNDERPAID').length,
        na: rows.filter(r => r.status === 'NA').length
      };
      return out;
    },
    reconciliation: () => {
      return reconcileAll();
    }
  },
  Mutation: {
    async uploadClaimsFile(_: unknown, { file }: any) {
      try {
        const { createReadStream, filename } = await file;
        const rawRows = await readCsvStream<Record<string, any>>(createReadStream());
        const claims = transformClaims(rawRows);

        if (claims.length === 0) {
          return {
            success: false,
            message: 'The file is corrupt or missing required data',
          };
        }

        store.claims.clear();
        claims.forEach((claim) => {
          store.claims.set(claim.claim_id, claim);
        });

        return {
          success: true,
          message: `Loaded ${claims.length} claims from ${filename}`,
        };
      } catch {
        return {
          success: false,
          message: 'The file is corrupt or invalid',
        };
      }
    },

    async uploadInvoicesFile(_: unknown, { file }: any) {
      try {
        const { createReadStream, filename } = await file;
        const rawRows = await readCsvStream<Record<string, any>>(createReadStream());
        const invoices = transformInvoices(rawRows);

        if (invoices.length === 0) {
          return {
            success: false,
            message: 'The file is corrupt or missing required data',
          };
        }

        store.invoicesByClaim.clear();
        invoices.forEach((invoice) => {
          const existing = store.invoicesByClaim.get(invoice.claim_id) ?? [];
          store.invoicesByClaim.set(invoice.claim_id, [...existing, invoice]);
        });

        return {
          success: true,
          message: `Loaded ${invoices.length} invoices from ${filename}`,
        };
      } catch {
        return {
          success: false,
          message: 'The file is corrupt or invalid',
        };
      }
    },

    clearData() {
      store.reset();
      return { success: true, message: 'All data cleared successfully' };
    },
  },
};
