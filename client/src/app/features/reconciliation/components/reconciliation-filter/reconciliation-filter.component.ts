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


  isNumericFilter: boolean = false;
  isStatusFilter: boolean = false;
  isTextFilter: boolean = false;

  refreshFilters(): void {
    this.isNumericFilter = this.filterField === 'claim_amount_above' || this.filterField === 'claim_amount_below';
    this.isStatusFilter = this.filterField === 'status';
    this.isTextFilter = this.filterField === 'patient_id' || this.filterField === 'claim_id';
  }

  onFilterFieldChange(field: FilterField): void {

    if (this.filterField !== field) {
      this.filterValue = '';
    }
    this.filterField = field;
    this.refreshFilters();
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

