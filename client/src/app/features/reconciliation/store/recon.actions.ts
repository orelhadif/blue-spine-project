import { createAction, props } from '@ngrx/store';
import { Summary, ReconciliationRow } from './recon.types';

// Upload actions
export const uploadClaims = createAction(
  '[Recon] Upload Claims CSV',
  props<{ csvText: string }>()
);
export const uploadClaimsSuccess = createAction(
  '[Recon] Upload Claims CSV Success',
  props<{ message: string }>()
);
export const uploadClaimsFailure = createAction(
  '[Recon] Upload Claims CSV Failure',
  props<{ error: string }>()
);

export const uploadInvoices = createAction(
  '[Recon] Upload Invoices CSV',
  props<{ csvText: string }>()
);
export const uploadInvoicesSuccess = createAction(
  '[Recon] Upload Invoices CSV Success',
  props<{ message: string }>()
);
export const uploadInvoicesFailure = createAction(
  '[Recon] Upload Invoices CSV Failure',
  props<{ error: string }>()
);

// Load actions
export const loadSummary = createAction('[Recon] Load Summary');
export const loadSummarySuccess = createAction(
  '[Recon] Load Summary Success',
  props<{ summary: Summary }>()
);
export const loadSummaryFailure = createAction(
  '[Recon] Load Summary Failure',
  props<{ error: unknown }>()
);

export const loadReconcile = createAction('[Recon] Load Reconcile');
export const loadReconcileSuccess = createAction(
  '[Recon] Load Reconcile Success',
  props<{ rows: ReconciliationRow[] }>()
);
export const loadReconcileFailure = createAction(
  '[Recon] Load Reconcile Failure',
  props<{ error: unknown }>()
);

// State management actions
export const setHasData = createAction(
  '[Recon] Set Has Data',
  props<{ hasData: boolean }>()
);
export const clearError = createAction('[Recon] Clear Error');

// Clear data actions
export const clearData = createAction('[Recon] Clear Data');
export const clearDataSuccess = createAction('[Recon] Clear Data Success');
export const clearDataFailure = createAction(
  '[Recon] Clear Data Failure',
  props<{ error: string }>()
); 
