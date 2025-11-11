import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { ReconEffects } from './recon.effects';
import * as ReconActions from './recon.actions';
import { ReconciliationApiService } from '../../../core/services/reconciliation-api.service';
import { Summary, ReconciliationRow, UploadResult } from './recon.types';

describe('ReconEffects', () => {
  let effects: ReconEffects;
  let actions$: Observable<any>;
  let apiService: jasmine.SpyObj<ReconciliationApiService>;
  const mockSummary: Summary = { totalClaims: 10, balanced: 5, overpaid: 2, underpaid: 2, na: 1 };
  const mockRows: ReconciliationRow[] = [{ claim_id: '1', patient_id: 'P1', claim_amount: 100, invoices_total: 100, status: 'BALANCED' }];
  const successResult: UploadResult = { success: true, message: 'Success' };
  const failureResult: UploadResult = { success: false, message: 'Failed' };

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ReconciliationApiService', ['uploadClaims', 'uploadInvoices', 'getSummary', 'getReconcile', 'clearData']);
    TestBed.configureTestingModule({
      providers: [ReconEffects, provideMockActions(() => actions$), { provide: ReconciliationApiService, useValue: apiService }],
    });
    effects = TestBed.inject(ReconEffects);
  });

  describe('uploadClaims$', () => {
    it('should dispatch success actions on success', (done) => {
      apiService.uploadClaims.and.returnValue(of(successResult));
      apiService.getSummary.and.returnValue(of(mockSummary));
      apiService.getReconcile.and.returnValue(of(mockRows));
      actions$ = of(ReconActions.uploadClaims({ csvText: 'csv' }));

      effects.uploadClaims$.pipe(take(4), toArray()).subscribe((actions) => {
        expect(actions.map(a => a.type)).toEqual([
          '[Recon] Upload Claims CSV Success',
          '[Recon] Set Has Data',
          '[Recon] Load Summary',
          '[Recon] Load Reconcile',
        ]);
        done();
      });
    });

    it('should dispatch failure on error', (done) => {
      apiService.uploadClaims.and.returnValue(of(failureResult));
      actions$ = of(ReconActions.uploadClaims({ csvText: 'csv' }));

      effects.uploadClaims$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Upload Claims CSV Failure');
        done();
      });
    });
  });

  describe('uploadInvoices$', () => {
    it('should dispatch success actions on success', (done) => {
      apiService.uploadInvoices.and.returnValue(of(successResult));
      apiService.getSummary.and.returnValue(of(mockSummary));
      apiService.getReconcile.and.returnValue(of(mockRows));
      actions$ = of(ReconActions.uploadInvoices({ csvText: 'csv' }));

      effects.uploadInvoices$.pipe(take(3), toArray()).subscribe((actions) => {
        expect(actions.map(a => a.type)).toEqual([
          '[Recon] Upload Invoices CSV Success',
          '[Recon] Load Summary',
          '[Recon] Load Reconcile',
        ]);
        done();
      });
    });

    it('should dispatch failure on error', (done) => {
      apiService.uploadInvoices.and.returnValue(of(failureResult));
      actions$ = of(ReconActions.uploadInvoices({ csvText: 'csv' }));

      effects.uploadInvoices$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Upload Invoices CSV Failure');
        done();
      });
    });
  });

  describe('loadSummary$', () => {
    it('should dispatch success', (done) => {
      apiService.getSummary.and.returnValue(of(mockSummary));
      actions$ = of(ReconActions.loadSummary());

      effects.loadSummary$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Load Summary Success');
        done();
      });
    });

    it('should dispatch failure on error', (done) => {
      apiService.getSummary.and.returnValue(throwError(() => new Error()));
      actions$ = of(ReconActions.loadSummary());

      effects.loadSummary$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Load Summary Failure');
        done();
      });
    });
  });

  describe('loadReconcile$', () => {
    it('should dispatch success', (done) => {
      apiService.getReconcile.and.returnValue(of(mockRows));
      actions$ = of(ReconActions.loadReconcile());

      effects.loadReconcile$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Load Reconcile Success');
        done();
      });
    });

    it('should dispatch failure on error', (done) => {
      apiService.getReconcile.and.returnValue(throwError(() => new Error()));
      actions$ = of(ReconActions.loadReconcile());

      effects.loadReconcile$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Load Reconcile Failure');
        done();
      });
    });
  });

  describe('clearData$', () => {
    it('should dispatch success', (done) => {
      apiService.clearData.and.returnValue(of(successResult));
      actions$ = of(ReconActions.clearData());

      effects.clearData$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Clear Data Success');
        done();
      });
    });

    it('should dispatch failure on error', (done) => {
      apiService.clearData.and.returnValue(throwError(() => ({ message: 'Failed' })));
      actions$ = of(ReconActions.clearData());

      effects.clearData$.subscribe((action) => {
        expect(action.type).toBe('[Recon] Clear Data Failure');
        done();
      });
    });
  });
});
