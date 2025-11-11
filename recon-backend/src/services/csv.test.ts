import { transformClaims, transformInvoices, parseClaims, parseInvoices } from './csv';
import { Claim, Invoice } from '../types';

describe('CSV Service', () => {
  describe('transformClaims', () => {
    it('should transform valid records', () => {
      const raw = [
        { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: '100' },
        { claim_id: '2', patient_id: 'P2', date_of_service: '2024-01-02', amount: 200 },
      ];
      const result = transformClaims(raw);
      expect(result).toEqual([
        { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 },
        { claim_id: '2', patient_id: 'P2', date_of_service: '2024-01-02', amount: 200 },
      ]);
    });

    it('should filter invalid records', () => {
      const raw = [
        { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: '100' },
        { claim_id: '2', patient_id: '', date_of_service: '2024-01-02', amount: 200 },
        { claim_id: '3', patient_id: 'P3', date_of_service: '2024-01-03' },
      ];
      expect(transformClaims(raw)).toHaveLength(1);
    });

    it('should handle empty array', () => {
      expect(transformClaims([])).toEqual([]);
    });
  });

  describe('transformInvoices', () => {
    it('should transform valid records', () => {
      const raw = [
        { invoice_id: 'I1', claim_id: 'C1', transaction_value: '50' },
        { invoice_id: 'I2', claim_id: 'C1', transaction_value: 50 },
      ];
      const result = transformInvoices(raw);
      expect(result).toEqual([
        { invoice_id: 'I1', claim_id: 'C1', transaction_value: 50 },
        { invoice_id: 'I2', claim_id: 'C1', transaction_value: 50 },
      ]);
    });

    it('should filter invalid records', () => {
      const raw = [
        { invoice_id: 'I1', claim_id: 'C1', transaction_value: '50' },
        { invoice_id: 'I2', claim_id: '', transaction_value: 50 },
        { invoice_id: 'I3', claim_id: 'C2' },
      ];
      expect(transformInvoices(raw)).toHaveLength(1);
    });
  });

  describe('parseClaims', () => {
    it('should parse valid CSV', () => {
      const csv = 'claim_id,patient_id,date_of_service,amount\n1,P1,2024-01-01,100';
      const result = parseClaims(csv);
      expect(result).toEqual([{ claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 }]);
    });

    it('should throw on missing column', () => {
      const csv = 'claim_id,patient_id,date_of_service\n1,P1,2024-01-01';
      expect(() => parseClaims(csv)).toThrow('claims.csv missing column: amount');
    });

    it('should handle empty CSV', () => {
      expect(parseClaims('claim_id,patient_id,date_of_service,amount\n')).toEqual([]);
    });
  });

  describe('parseInvoices', () => {
    it('should parse valid CSV', () => {
      const csv = 'invoice_id,claim_id,transaction_value\nI1,C1,50';
      const result = parseInvoices(csv);
      expect(result).toEqual([{ invoice_id: 'I1', claim_id: 'C1', transaction_value: 50 }]);
    });

    it('should throw on missing column', () => {
      const csv = 'invoice_id,claim_id\nI1,C1';
      expect(() => parseInvoices(csv)).toThrow('invoices.csv missing column: transaction_value');
    });
  });
});

