import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ResultsTableComponent } from './results-table.component';
import { ReconciliationRow } from '../../store/recon.types';
import { FilterChange } from '../reconciliation-filter/reconciliation-filter.component.model';

describe('ResultsTableComponent', () => {
  let component: ResultsTableComponent;
  let fixture: ComponentFixture<ResultsTableComponent>;
  const mockRows: ReconciliationRow[] = [
    { claim_id: '1', patient_id: 'P1', claim_amount: 100, invoices_total: 100, status: 'BALANCED' },
    { claim_id: '2', patient_id: 'P2', claim_amount: 200, invoices_total: 150, status: 'UNDERPAID' },
    { claim_id: '3', patient_id: 'P1', claim_amount: 300, invoices_total: 350, status: 'OVERPAID' },
    { claim_id: '4', patient_id: 'P3', claim_amount: 400, invoices_total: null, status: 'NA' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultsTableComponent],
      imports: [CommonModule, MatTableModule, MatCardModule, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should update dataSource on rows change', () => {
    component.rows = mockRows;
    component.ngOnChanges({ rows: { currentValue: mockRows } } as any);
    expect(component.dataSource.data).toEqual(mockRows);
  });

  it('should handle null rows', () => {
    component.ngOnChanges({ rows: { currentValue: null } } as any);
    expect(component.dataSource.data).toEqual([]);
  });

  describe('filtering', () => {
    beforeEach(() => {
      component.rows = mockRows;
      component.ngOnChanges({ rows: { currentValue: mockRows } } as any);
    });

    it('should filter by patient_id', () => {
      component.onFilterChange({ field: 'patient_id', value: 'P1' });
      expect(component.dataSource.filteredData.length).toBe(2);
      expect(component.dataSource.filteredData[0].patient_id).toBe('P1');
    });

    it('should filter by claim_id', () => {
      component.onFilterChange({ field: 'claim_id', value: '2' });
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter by status', () => {
      component.onFilterChange({ field: 'status', value: 'balanced' });
      expect(component.dataSource.filteredData[0].status).toBe('BALANCED');
    });

    it('should filter by claim_amount_above', () => {
      component.onFilterChange({ field: 'claim_amount_above', value: '200' });
      expect(component.dataSource.filteredData.every(r => r.claim_amount > 200)).toBe(true);
    });

    it('should filter by claim_amount_below', () => {
      component.onFilterChange({ field: 'claim_amount_below', value: '300' });
      expect(component.dataSource.filteredData.every(r => r.claim_amount < 300)).toBe(true);
    });

    it('should return all rows when filter is empty', () => {
      component.onFilterChange({ field: 'patient_id', value: '' });
      expect(component.dataSource.filteredData.length).toBe(mockRows.length);
    });

    it('should handle invalid numeric filter', () => {
      component.onFilterChange({ field: 'claim_amount_above', value: 'invalid' });
      expect(component.dataSource.filteredData.length).toBe(mockRows.length);
    });

    it('should be case-insensitive for text filters', () => {
      component.onFilterChange({ field: 'patient_id', value: 'p1' });
      expect(component.dataSource.filteredData.length).toBe(2);
    });
  });
});
