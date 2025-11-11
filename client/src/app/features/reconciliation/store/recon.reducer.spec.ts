import { reconReducer, initialState, ReconState } from './recon.reducer';
import * as Actions from './recon.actions';
import { Summary, ReconciliationRow } from './recon.types';

describe('ReconReducer', () => {
  const mockSummary: Summary = { totalClaims: 10, balanced: 5, overpaid: 2, underpaid: 2, na: 1 };
  const mockRows: ReconciliationRow[] = [
    { claim_id: '1', patient_id: 'P1', claim_amount: 100, invoices_total: 100, status: 'BALANCED' },
    { claim_id: '2', patient_id: 'P2', claim_amount: 200, invoices_total: 150, status: 'UNDERPAID' },
  ];

  it('should return initial state', () => {
    expect(reconReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('should handle loadSummarySuccess', () => {
    const state = reconReducer(initialState, Actions.loadSummarySuccess({ summary: mockSummary }));
    expect(state.summary).toEqual(mockSummary);
    expect(state.hasData).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadReconcileSuccess', () => {
    const state = reconReducer(initialState, Actions.loadReconcileSuccess({ rows: mockRows }));
    expect(state.rows).toEqual(mockRows);
    expect(state.error).toBeNull();
  });

  it('should handle setHasData', () => {
    expect(reconReducer(initialState, Actions.setHasData({ hasData: true })).hasData).toBe(true);
  });

  it('should clear error on uploadClaimsSuccess', () => {
    const state = reconReducer({ ...initialState, error: 'Error' }, Actions.uploadClaimsSuccess({ message: 'Success' }));
    expect(state.error).toBeNull();
  });

  it('should clear all data on uploadClaimsFailure', () => {
    const stateWithData: ReconState = { summary: mockSummary, rows: mockRows, hasData: true, error: null };
    const state = reconReducer(stateWithData, Actions.uploadClaimsFailure({ error: 'Failed' }));
    expect(state.summary).toBeNull();
    expect(state.rows).toEqual([]);
    expect(state.hasData).toBe(false);
    expect(state.error).toBe('Failed');
  });

  it('should clear error on uploadInvoicesSuccess', () => {
    const state = reconReducer({ ...initialState, error: 'Error' }, Actions.uploadInvoicesSuccess({ message: 'Success' }));
    expect(state.error).toBeNull();
  });

  it('should preserve data on uploadInvoicesFailure', () => {
    const stateWithData: ReconState = { summary: mockSummary, rows: mockRows, hasData: true, error: null };
    const state = reconReducer(stateWithData, Actions.uploadInvoicesFailure({ error: 'Failed' }));
    expect(state.summary).toEqual(mockSummary);
    expect(state.rows).toEqual(mockRows);
    expect(state.hasData).toBe(true);
    expect(state.error).toBe('Failed');
  });

  it('should clear error', () => {
    expect(reconReducer({ ...initialState, error: 'Error' }, Actions.clearError()).error).toBeNull();
  });

  it('should clear all data on clearDataSuccess', () => {
    const stateWithData: ReconState = { summary: mockSummary, rows: mockRows, hasData: true, error: 'Error' };
    const state = reconReducer(stateWithData, Actions.clearDataSuccess());
    expect(state.summary).toBeNull();
    expect(state.rows).toEqual([]);
    expect(state.hasData).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set error on clearDataFailure', () => {
    expect(reconReducer(initialState, Actions.clearDataFailure({ error: 'Failed' })).error).toBe('Failed');
  });
});
