import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GraphqlHttpService } from './graphql-http.service';

describe('GraphqlHttpService', () => {
  let service: GraphqlHttpService;
  let httpMock: HttpTestingController;
  const url = 'http://localhost:8000/graphql';

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [GraphqlHttpService] });
    service = TestBed.inject(GraphqlHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('execute', () => {
    it('should send POST with query and return data', () => {
      const query = 'query GetSummary { summary { totalClaims } }';
      service.execute(query).subscribe((data) => expect(data).toEqual({ summary: { totalClaims: 10 } }));

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ query, variables: {}, operationName: 'GetSummary' });
      req.flush({ data: { summary: { totalClaims: 10 } } });
    });

    it('should include variables', () => {
      service.execute('query', { var: 'value' }).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.body.variables).toEqual({ var: 'value' });
      req.flush({ data: {} });
    });

    it('should throw on errors', () => {
      service.execute('query').subscribe({ next: () => fail(), error: (e) => expect(e.message).toBe('Error') });
      httpMock.expectOne(url).flush({ errors: [{ message: 'Error' }] });
    });
  });

  describe('uploadFile', () => {
    it('should send multipart form data', () => {
      const file = new Blob(['test'], { type: 'text/csv' });
      service.uploadFile('mutation Upload($file: Upload!) { upload(file: $file) { success } }', file).subscribe((data) => {
        expect(data).toEqual({ upload: { success: true } });
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush({ data: { upload: { success: true } } });
    });

    it('should throw on errors', () => {
      const file = new Blob(['test']);
      service.uploadFile('mutation', file).subscribe({ next: () => fail(), error: (e) => expect(e.message).toBe('Error') });
      httpMock.expectOne(url).flush({ errors: [{ message: 'Error' }] });
    });
  });
});
