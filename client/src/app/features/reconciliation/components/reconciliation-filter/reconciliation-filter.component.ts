import { Component, EventEmitter, Output } from '@angular/core';
import { ReconciliationStatus } from '../../store/recon.types';

export type FilterField =
  | 'patient_id'
  | 'claim_id'
  | 'status'
  | 'claim_amount_above'
  | 'claim_amount_below';

export interface FilterChange {
  field: FilterField;
  value: string;
}

@Component({
  selector: 'app-reconciliation-filter',
  templateUrl: './reconciliation-filter.component.html',
  standalone: false,
  styleUrls: ['./reconciliation-filter.component.less'],
})
export class ReconciliationFilterComponent {
  @Output() filterChange = new EventEmitter<FilterChange>();

  filterField: FilterField = 'patient_id';
  filterValue = '';
  statusOptions: ReconciliationStatus[] = [
    'BALANCED',
    'OVERPAID',
    'UNDERPAID',
    'NA',
  ];

  isNumericFilter(): boolean {
    return (
      this.filterField === 'claim_amount_above' ||
      this.filterField === 'claim_amount_below'
    );
  }

  isStatusFilter(): boolean {
    return this.filterField === 'status';
  }

  isTextFilter(): boolean {
    return (
      this.filterField === 'patient_id' ||
      this.filterField === 'claim_id'
    );
  }

  onFilterFieldChange(field: FilterField): void {

    if (this.filterField !== field) {
      this.filterValue = '';
    }
    
    this.filterField = field;
    this.emitFilterChange();
  }

  onTextFilterChange(value: string): void {
    this.filterValue = (value || '').trim().toLowerCase();
    this.emitFilterChange();
  }

  onNumericFilterChange(value: string): void {
    const numericValue = value.replace(/[^0-9.]/g, '');
    this.filterValue = numericValue;
    this.emitFilterChange();
  }

  onStatusFilterChange(status: string): void {
    this.filterValue = (status || '').toLowerCase();
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    this.filterChange.emit({
      field: this.filterField,
      value: this.filterValue,
    });
  }
}

