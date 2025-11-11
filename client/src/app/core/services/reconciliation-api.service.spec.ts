import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReconciliationApiService } from './reconciliation-api.service';
import { GraphqlHttpService } from './graphql-http.service';
import { Summary, ReconciliationRow, UploadResult } from '../../features/reconciliation/store/recon.types';

describe('ReconciliationApiService', () => {
  let service: ReconciliationApiService;
  let graphqlService: jasmine.SpyObj<GraphqlHttpService>;
  const mockSummary: Summary = { totalClaims: 10, balanced: 5, overpaid: 2, underpaid: 2, na: 1 };
  const mockRows: ReconciliationRow[] = [{ claim_id: '1', patient_id: 'P1', claim_amount: 100, invoices_total: 100, status: 'BALANCED' }];
  const uploadResult: UploadResult = { success: true, message: 'Success' };

  beforeEach(() => {
    graphqlService = jasmine.createSpyObj('GraphqlHttpService', ['uploadFile', 'execute']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReconciliationApiService, { provide: GraphqlHttpService, useValue: graphqlService }],
    });
    service = TestBed.inject(ReconciliationApiService);
  });

  it('should upload claims', (done) => {
    graphqlService.uploadFile.and.returnValue(of({ uploadClaimsFile: uploadResult }));
    service.uploadClaims('csv').subscribe((result) => {
      expect(graphqlService.uploadFile).toHaveBeenCalled();
      expect(result).toEqual(uploadResult);
      done();
    });
  });

  it('should upload invoices', (done) => {
    graphqlService.uploadFile.and.returnValue(of({ uploadInvoicesFile: uploadResult }));
    service.uploadInvoices('csv').subscribe((result) => {
      expect(graphqlService.uploadFile).toHaveBeenCalled();
      expect(result).toEqual(uploadResult);
      done();
    });
  });

  it('should get summary', (done) => {
    graphqlService.execute.and.returnValue(of({ summary: mockSummary }));
    service.getSummary().subscribe((summary) => {
      expect(summary).toEqual(mockSummary);
      done();
    });
  });

  it('should get reconcile', (done) => {
    graphqlService.execute.and.returnValue(of({ reconciliation: mockRows }));
    service.getReconcile().subscribe((rows) => {
      expect(rows).toEqual(mockRows);
      done();
    });
  });

  it('should clear data', (done) => {
    graphqlService.execute.and.returnValue(of({ clearData: uploadResult }));
    service.clearData().subscribe((result) => {
      expect(result).toEqual(uploadResult);
      done();
    });
  });
});
