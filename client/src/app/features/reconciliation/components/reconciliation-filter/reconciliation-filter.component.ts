import { Component, EventEmitter, Output } from '@angular/core';
import { ReconciliationStatus } from '../../store/recon.types';
import { FilterField, FilterChange } from './reconciliation-filter.component.model';

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

  get isNumericFilter(): boolean {
    return (
      this.filterField === 'claim_amount_above' ||
      this.filterField === 'claim_amount_below'
    );
  }

  get isStatusFilter(): boolean {
    return this.filterField === 'status';
  }

  get isTextFilter(): boolean {
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

