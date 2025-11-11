import { createFeature, createReducer, on } from '@ngrx/store';
import * as Actions from './recon.actions';
import { Summary, ReconciliationRow } from './recon.types';

export const reconFeatureKey = 'recon';

export interface ReconState {
  summary: Summary | null;
  rows: ReconciliationRow[];
  hasData: boolean;
  error: string | null;
}

export const initialState: ReconState = {
  summary: null,
  rows: [],
  hasData: false,
  error: null,
};


const clearDataState = (state: ReconState): ReconState => ({
  ...state,
  hasData: false,
  summary: null,
  rows: [],
});

export const reconReducer = createReducer(
  initialState,
  on(Actions.loadSummarySuccess, (state, { summary }) => ({
    ...state,
    summary,
    hasData: true,
    error: null,
  })),
  on(Actions.loadReconcileSuccess, (state, { rows }) => ({
    ...state,
    rows,
    error: null,
  })),
  on(Actions.setHasData, (state, { hasData }) => ({ ...state, hasData })),
  on(Actions.uploadClaimsSuccess, (state) => ({ ...state, error: null })),
  on(Actions.uploadClaimsFailure, (state, { error }) => ({
    ...clearDataState(state),
    error,
  })),
  on(Actions.uploadInvoicesSuccess, (state) => ({ ...state, error: null })),
  on(Actions.uploadInvoicesFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(Actions.clearError, (state) => ({ ...state, error: null })),
  on(Actions.clearDataSuccess, (state) => ({
    ...clearDataState(state),
    error: null,
  })),
  on(Actions.clearDataFailure, (state, { error }) => ({ ...state, error }))
);

export const reconFeature = createFeature({ name: reconFeatureKey, reducer: reconReducer });
export const { selectSummary, selectRows, selectHasData, selectError } = reconFeature;
