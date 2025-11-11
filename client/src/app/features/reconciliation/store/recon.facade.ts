import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ReconActions from './recon.actions';
import { selectHasData, selectRows, selectSummary, selectError } from './recon.reducer';

@Injectable({ providedIn: 'root' })
export class ReconFacade {
  private store = inject(Store);
  hasData$ = this.store.select(selectHasData);
  summary$ = this.store.select(selectSummary);
  rows$ = this.store.select(selectRows);
  error$ = this.store.select(selectError);
  uploadClaims(csvText: string)   { this.store.dispatch(ReconActions.uploadClaims({ csvText })); }
  uploadInvoices(csvText: string) { this.store.dispatch(ReconActions.uploadInvoices({ csvText })); }
  loadSummary()                   { this.store.dispatch(ReconActions.loadSummary()); }
  loadReconcile()                 { this.store.dispatch(ReconActions.loadReconcile()); }
  setHasData(v: boolean)          { this.store.dispatch(ReconActions.setHasData({ hasData: v })); }
  clearError()                    { this.store.dispatch(ReconActions.clearError()); }
  clearData()                     { this.store.dispatch(ReconActions.clearData()); }
}
