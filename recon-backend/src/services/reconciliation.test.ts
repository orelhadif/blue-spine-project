import { reconcileAll } from './reconciliation';
import { store } from './store';
import { Claim, Invoice } from '../types';

describe('Reconciliation Logic', () => {
  beforeEach(() => {
    store.reset();
  });

  it('should return NA when no invoices', () => {
    store.claims.set('1', { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 });
    const result = reconcileAll();
    expect(result[0].status).toBe('NA');
    expect(result[0].invoices_total).toBeNull();
  });

  it('should return BALANCED when amounts match', () => {
    store.claims.set('1', { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 });
    store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 100 }]);
    const result = reconcileAll();
    expect(result[0].status).toBe('BALANCED');
    expect(result[0].invoices_total).toBe(100);
  });

  it('should return OVERPAID when claim > invoices', () => {
    store.claims.set('1', { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 });
    store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 50 }]);
    const result = reconcileAll();
    expect(result[0].status).toBe('OVERPAID');
    expect(result[0].invoices_total).toBe(50);
  });

  it('should return UNDERPAID when claim < invoices', () => {
    store.claims.set('1', { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 });
    store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 150 }]);
    const result = reconcileAll();
    expect(result[0].status).toBe('UNDERPAID');
    expect(result[0].invoices_total).toBe(150);
  });

  it('should sum multiple invoices', () => {
    store.claims.set('1', { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 });
    store.invoicesByClaim.set('1', [
      { invoice_id: 'I1', claim_id: '1', transaction_value: 50 },
      { invoice_id: 'I2', claim_id: '1', transaction_value: 50 },
    ]);
    const result = reconcileAll();
    expect(result[0].status).toBe('BALANCED');
    expect(result[0].invoices_total).toBe(100);
  });

  it('should handle multiple claims', () => {
    store.claims.set('1', { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 });
    store.claims.set('2', { claim_id: '2', patient_id: 'P2', date_of_service: '2024-01-02', amount: 200 });
    store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 100 }]);
    const result = reconcileAll();
    expect(result).toHaveLength(2);
    expect(result.find(r => r.claim_id === '1')?.status).toBe('BALANCED');
    expect(result.find(r => r.claim_id === '2')?.status).toBe('NA');
  });

  it('should round invoices_total to 2 decimals', () => {
    store.claims.set('1', { claim_id: '1', patient_id: 'P1', date_of_service: '2024-01-01', amount: 100 });
    store.invoicesByClaim.set('1', [
      { invoice_id: 'I1', claim_id: '1', transaction_value: 33.333 },
      { invoice_id: 'I2', claim_id: '1', transaction_value: 33.333 },
      { invoice_id: 'I3', claim_id: '1', transaction_value: 33.334 },
    ]);
    const result = reconcileAll();
    expect(result[0].invoices_total).toBe(100);
  });
});

