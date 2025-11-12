import { store } from './store';
import { Claim, Invoice } from '../types';

describe('Store', () => {
  beforeEach(() => {
    store.reset();
  });

  it('should reset all data', () => {
    store.claims.set('1', {
      claim_id: '1',
      patient_id: 'P1',
      date_of_service: '2024-01-01',
      amount: 100,
    });
    store.invoicesByClaim.set('1', [{ invoice_id: 'I1', claim_id: '1', transaction_value: 50 }]);

    store.reset();

    expect(store.claims.size).toBe(0);
    expect(store.invoicesByClaim.size).toBe(0);
  });

  it('should store claims', () => {
    const claim: Claim = {
      claim_id: '1',
      patient_id: 'P1',
      date_of_service: '2024-01-01',
      amount: 100,
    };
    store.claims.set('1', claim);
    expect(store.claims.get('1')).toEqual(claim);
  });

  it('should store invoices by claim', () => {
    const invoice: Invoice = { invoice_id: 'I1', claim_id: '1', transaction_value: 50 };
    store.invoicesByClaim.set('1', [invoice]);
    expect(store.invoicesByClaim.get('1')).toEqual([invoice]);
  });
});
