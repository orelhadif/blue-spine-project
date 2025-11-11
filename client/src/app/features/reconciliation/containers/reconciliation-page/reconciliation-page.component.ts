import { Component, inject, OnInit } from '@angular/core';
import { ReconFacade } from '../../store/recon.facade';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-reconciliation-page',
  templateUrl: './reconciliation-page.component.html',
  standalone: false,
  styleUrls: ['./reconciliation-page.component.less']
})
export class ReconciliationPageComponent implements OnInit {
  private facade = inject(ReconFacade);
  hasData$ = this.facade.hasData$;
  summary$ = this.facade.summary$;
  rows$ = this.facade.rows$;
  error$ = this.facade.error$;
  
  // Check if claims have been uploaded (invoices button should be disabled until claims exist)
  hasClaims$: Observable<boolean> = this.summary$.pipe(
    map((summary) => (summary?.totalClaims ?? 0) > 0)
  );
  
  ngOnInit(): void {
    this.facade.loadSummary();
    this.facade.loadReconcile();
  }
  
  onClaimsCsv(csv: string)   { this.facade.uploadClaims(csv); }
  onInvoicesCsv(csv: string) { this.facade.uploadInvoices(csv); }
  onDismissError()           { this.facade.clearError(); }
  onClearData()              { this.facade.clearData(); }
}
