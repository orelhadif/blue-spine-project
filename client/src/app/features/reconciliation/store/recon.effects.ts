import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ReconActions from './recon.actions';
import { ReconciliationApiService } from '../../../core/services/reconciliation-api.service';

const CORRUPT_FILE_ERROR = 'The file is corrupt or invalid';

@Injectable()
export class ReconEffects {
  private actions$ = inject(Actions);
  private api = inject(ReconciliationApiService);

  uploadClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReconActions.uploadClaims),
      mergeMap(({ csvText }) =>
        this.api.uploadClaims(csvText).pipe(
          mergeMap((result) =>
            result.success
              ? [
                  ReconActions.uploadClaimsSuccess({
                    message: result.message || 'Claims uploaded successfully',
                  }),
                  ReconActions.setHasData({ hasData: true }),
                  ReconActions.loadSummary(),
                  ReconActions.loadReconcile(),
                ]
              : [
                  ReconActions.uploadClaimsFailure({
                    error: result.message || CORRUPT_FILE_ERROR,
                  }),
                ]
          ),
          catchError(() => of(ReconActions.uploadClaimsFailure({ error: CORRUPT_FILE_ERROR })))
        )
      )
    )
  );

  uploadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReconActions.uploadInvoices),
      mergeMap(({ csvText }) =>
        this.api.uploadInvoices(csvText).pipe(
          mergeMap((result) =>
            result.success
              ? [
                  ReconActions.uploadInvoicesSuccess({
                    message: result.message || 'Invoices uploaded successfully',
                  }),
                  ReconActions.loadSummary(),
                  ReconActions.loadReconcile(),
                ]
              : [
                  ReconActions.uploadInvoicesFailure({
                    error: result.message || CORRUPT_FILE_ERROR,
                  }),
                ]
          ),
          catchError(() => of(ReconActions.uploadInvoicesFailure({ error: CORRUPT_FILE_ERROR })))
        )
      )
    )
  );

  loadSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReconActions.loadSummary),
      mergeMap(() =>
        this.api.getSummary().pipe(
          map((summary) => ReconActions.loadSummarySuccess({ summary })),
          catchError((error) => of(ReconActions.loadSummaryFailure({ error })))
        )
      )
    )
  );

  loadReconcile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReconActions.loadReconcile),
      mergeMap(() =>
        this.api.getReconcile().pipe(
          map((rows) => ReconActions.loadReconcileSuccess({ rows })),
          catchError((error) => of(ReconActions.loadReconcileFailure({ error })))
        )
      )
    )
  );

  clearData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReconActions.clearData),
      mergeMap(() =>
        this.api.clearData().pipe(
          map(() => ReconActions.clearDataSuccess()),
          catchError((error) => {
            const errorMessage =
              error?.error?.errors?.[0]?.message || error?.message || 'Failed to clear data';
            return of(ReconActions.clearDataFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
}
