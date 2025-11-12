import { resolvers } from './resolvers';
import { store } from './services/store';
import { Readable } from 'stream';

describe('Resolvers', () => {
  beforeEach(() => {
    store.reset();
  });

  describe('Query.summary', () => {
    it('should return summary with all statuses', () => {
      store.claims.set('1', {
        claim_id: '1',
        patient_id: 'P1',
        date_of_service: '2024-01-01',
        amount: 100,
      });
      store.claims.set('2', {
        claim_id: '2',
        patient_id: 'P2',
        date_of_service: '2024-01-02',
        amount: 200,
      });
      store.claims.set('3', {
        claim_id: '3',
        patient_id: 'P3',
        date_of_service: '2024-01-03',
        amount: 300,
      });
      store.claims.set('4', {
        claim_id: '4',
        patient_id: 'P4',
        date_of_service: '2024-01-04',
        amount: 400,
      });

      store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 100 }]);
      store.invoicesByClaim.set('2', [{ invoice_id: 'I2', claim_id: '2', transaction_value: 150 }]);
      store.invoicesByClaim.set('3', [{ invoice_id: 'I3', claim_id: '3', transaction_value: 350 }]);

      const summary = resolvers.Query.summary();
      expect(summary.totalClaims).toBe(4);
      expect(summary.balanced).toBe(1);
      expect(summary.overpaid).toBe(1);
      expect(summary.underpaid).toBe(1);
      expect(summary.na).toBe(1);
    });

    it('should return zeros for empty store', () => {
      const summary = resolvers.Query.summary();
      expect(summary.totalClaims).toBe(0);
      expect(summary.balanced).toBe(0);
      expect(summary.overpaid).toBe(0);
      expect(summary.underpaid).toBe(0);
      expect(summary.na).toBe(0);
    });
  });

  describe('Query.reconciliation', () => {
    it('should return all reconciliation rows', () => {
      store.claims.set('1', {
        claim_id: '1',
        patient_id: 'P1',
        date_of_service: '2024-01-01',
        amount: 100,
      });
      store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 100 }]);

      const rows = resolvers.Query.reconciliation();
      expect(rows).toHaveLength(1);
      expect(rows[0].claim_id).toBe('1');
      expect(rows[0].status).toBe('BALANCED');
    });
  });

  describe('Mutation.uploadClaimsFile', () => {
    it('should upload valid claims', async () => {
      const csv = 'claim_id,patient_id,date_of_service,amount\n1,P1,2024-01-01,100';
      const stream = Readable.from([csv]);
      const file = { createReadStream: () => stream, filename: 'claims.csv' };

      const result = await resolvers.Mutation.uploadClaimsFile(null, { file });

      expect(result.success).toBe(true);
      expect(result.message).toContain('Loaded 1 claims');
      expect(store.claims.size).toBe(1);
      expect(store.claims.get('1')?.amount).toBe(100);
    });

    it('should return error for empty file', async () => {
      const stream = Readable.from(['claim_id,patient_id,date_of_service,amount\n']);
      const file = { createReadStream: () => stream, filename: 'claims.csv' };

      const result = await resolvers.Mutation.uploadClaimsFile(null, { file });

      expect(result.success).toBe(false);
      expect(result.message).toContain('corrupt or missing');
    });

    it('should return error for invalid file', async () => {
      const stream = Readable.from(['invalid csv']);
      const file = { createReadStream: () => stream, filename: 'claims.csv' };

      const result = await resolvers.Mutation.uploadClaimsFile(null, { file });

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/corrupt|invalid/);
    });

    it('should clear existing claims', async () => {
      store.claims.set('old', {
        claim_id: 'old',
        patient_id: 'P1',
        date_of_service: '2024-01-01',
        amount: 50,
      });
      const csv = 'claim_id,patient_id,date_of_service,amount\n1,P1,2024-01-01,100';
      const stream = Readable.from([csv]);
      const file = { createReadStream: () => stream, filename: 'claims.csv' };

      await resolvers.Mutation.uploadClaimsFile(null, { file });

      expect(store.claims.has('old')).toBe(false);
      expect(store.claims.size).toBe(1);
    });
  });

  describe('Mutation.uploadInvoicesFile', () => {
    it('should upload valid invoices', async () => {
      const csv = 'invoice_id,claim_id,transaction_value\nI1,1,50';
      const stream = Readable.from([csv]);
      const file = { createReadStream: () => stream, filename: 'invoices.csv' };

      const result = await resolvers.Mutation.uploadInvoicesFile(null, { file });

      expect(result.success).toBe(true);
      expect(result.message).toContain('Loaded 1 invoices');
      expect(store.invoicesByClaim.get('1')).toHaveLength(1);
    });

    it('should append multiple invoices for same claim', async () => {
      const csv = 'invoice_id,claim_id,transaction_value\nI1,1,50\nI2,1,50';
      const stream = Readable.from([csv]);
      const file = { createReadStream: () => stream, filename: 'invoices.csv' };

      await resolvers.Mutation.uploadInvoicesFile(null, { file });

      expect(store.invoicesByClaim.get('1')).toHaveLength(2);
    });

    it('should clear existing invoices', async () => {
      store.invoicesByClaim.set('old', [
        { invoice_id: 'I1', claim_id: 'old', transaction_value: 50 },
      ]);
      const csv = 'invoice_id,claim_id,transaction_value\nI1,1,50';
      const stream = Readable.from([csv]);
      const file = { createReadStream: () => stream, filename: 'invoices.csv' };

      await resolvers.Mutation.uploadInvoicesFile(null, { file });

      expect(store.invoicesByClaim.has('old')).toBe(false);
    });
  });

  describe('Mutation.clearData', () => {
    it('should clear all data', () => {
      store.claims.set('1', {
        claim_id: '1',
        patient_id: 'P1',
        date_of_service: '2024-01-01',
        amount: 100,
      });
      store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 50 }]);

      const result = resolvers.Mutation.clearData();

      expect(result.success).toBe(true);
      expect(store.claims.size).toBe(0);
      expect(store.invoicesByClaim.size).toBe(0);
    });
  });
});
