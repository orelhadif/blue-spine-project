import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReconciliationFilterComponent } from './reconciliation-filter.component';

describe('ReconciliationFilterComponent', () => {
  let component: ReconciliationFilterComponent;
  let fixture: ComponentFixture<ReconciliationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReconciliationFilterComponent],
      imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReconciliationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should identify numeric filters', () => {
    component.filterField = 'claim_amount_above';
    expect(component.isNumericFilter).toBe(true);
    component.filterField = 'patient_id';
    expect(component.isNumericFilter).toBe(false);
  });

  it('should identify status filter', () => {
    component.filterField = 'status';
    expect(component.isStatusFilter).toBe(true);
    component.filterField = 'patient_id';
    expect(component.isStatusFilter).toBe(false);
  });

  it('should identify text filters', () => {
    expect(component.isTextFilter).toBe(true); // defaults to patient_id
    component.filterField = 'status';
    expect(component.isTextFilter).toBe(false);
  });

  it('should clear value when switching fields', () => {
    component.filterField = 'patient_id';
    component.filterValue = 'P1';
    spyOn(component.filterChange, 'emit');

    component.onFilterFieldChange('claim_id');

    expect(component.filterValue).toBe('');
    expect(component.filterChange.emit).toHaveBeenCalledWith({ field: 'claim_id', value: '' });
  });

  it('should not clear value when selecting same field', () => {
    component.filterField = 'patient_id';
    component.filterValue = 'P1';
    component.onFilterFieldChange('patient_id');
    expect(component.filterValue).toBe('P1');
  });

  it('should trim and lowercase text filter', () => {
    spyOn(component.filterChange, 'emit');
    component.onTextFilterChange('  P1  ');
    expect(component.filterValue).toBe('p1');
    expect(component.filterChange.emit).toHaveBeenCalledWith({
      field: component.filterField,
      value: 'p1',
    });
  });

  it('should sanitize numeric filter', () => {
    spyOn(component.filterChange, 'emit');
    component.filterField = 'claim_amount_above';
    component.onNumericFilterChange('abc123.45def');
    expect(component.filterValue).toBe('123.45');
  });

  it('should lowercase status filter', () => {
    spyOn(component.filterChange, 'emit');
    component.filterField = 'status';
    component.onStatusFilterChange('BALANCED');
    expect(component.filterValue).toBe('balanced');
  });

  it('should have all status options', () => {
    expect(component.statusOptions).toEqual(['BALANCED', 'OVERPAID', 'UNDERPAID', 'NA']);
  });
});
