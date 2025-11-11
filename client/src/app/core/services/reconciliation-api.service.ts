import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GraphqlHttpService } from './graphql-http.service';
import { UPLOAD_CLAIMS } from '../graphql/operations/claims/upload-claims.mutation';
import { UPLOAD_INVOICES } from '../graphql/operations/claims/upload-invoices.mutation';
import { GET_SUMMARY } from '../graphql/operations/reconciliation/get-summary.query';
import { GET_RECONCILE } from '../graphql/operations/reconciliation/get-reconcile.query';
import { CLEAR_DATA } from '../graphql/operations/reconciliation/clear-data.mutation';
import { Summary, ReconciliationRow, UploadResult } from '../../features/reconciliation/store/recon.types';

@Injectable({ providedIn: 'root' })
export class ReconciliationApiService {
  constructor(private gql: GraphqlHttpService) {}

  uploadClaims(csvText: string): Observable<UploadResult> {
    const file = new Blob([csvText], { type: 'text/csv' });
    return this.gql
      .uploadFile<{ uploadClaimsFile: UploadResult }>(UPLOAD_CLAIMS, file, {})
      .pipe(map((response) => response.uploadClaimsFile));
  }

  uploadInvoices(csvText: string): Observable<UploadResult> {
    const file = new Blob([csvText], { type: 'text/csv' });
    return this.gql
      .uploadFile<{ uploadInvoicesFile: UploadResult }>(UPLOAD_INVOICES, file, {})
      .pipe(map((response) => response.uploadInvoicesFile));
  }

  getSummary(): Observable<Summary> {
    return this.gql
      .execute<{ summary: Summary }>(GET_SUMMARY)
      .pipe(map((response) => response.summary));
  }

  getReconcile(): Observable<ReconciliationRow[]> {
    return this.gql
      .execute<{ reconciliation: ReconciliationRow[] }>(GET_RECONCILE)
      .pipe(map((response) => response.reconciliation));
  }

  clearData(): Observable<UploadResult> {
    return this.gql
      .execute<{ clearData: UploadResult }>(CLEAR_DATA)
      .pipe(map((response) => response.clearData));
  }
}