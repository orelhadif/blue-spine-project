import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ReconciliationRow } from '../../store/recon.types';
import { FilterChange } from '../reconciliation-filter/reconciliation-filter.component.model';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  standalone: false,
  styleUrls: ['./results-table.component.less'],
})
export class ResultsTableComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() rows: ReconciliationRow[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef<HTMLDivElement>;
  private paginatorSubscription?: Subscription;

  displayedColumns: string[] = [
    'claim_id',
    'patient_id',
    'claim_amount',
    'invoices_total',
    'status',
  ];
  dataSource = new MatTableDataSource<ReconciliationRow>([]);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginatorSubscription = this.paginator.page.subscribe(() => {
      this.scrollToTop();
    });
  }

  ngOnDestroy(): void {
    this.paginatorSubscription?.unsubscribe();
  }

  private scrollToTop(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.dataSource.data = this.rows ?? [];
      this.configureFilter();
      if (this.paginator) {
        this.paginator.firstPage();
      }
    }
  }

  private configureFilter(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const { field, term } = JSON.parse(filter) as {
        field: string;
        term: string;
      };

      if (!term) {
        return true;
      }

      if (field === 'status') {
        const status = String(data?.status ?? '').toLowerCase();
        return status === term.toLowerCase();
      }

      if (field === 'claim_amount_above') {
        const threshold = parseFloat(term);
        if (isNaN(threshold)) return true;
        return data.claim_amount > threshold;
      }

      if (field === 'claim_amount_below') {
        const threshold = parseFloat(term);
        if (isNaN(threshold)) return true;
        return data.claim_amount < threshold;
      }

      const value = String(
        data?.[field as keyof ReconciliationRow] ?? ''
      ).toLowerCase();
      return value.includes(term.toLowerCase());
    };
  }

  onFilterChange(filterChange: FilterChange): void {
    this.dataSource.filter = JSON.stringify({
      field: filterChange.field,
      term: filterChange.value,
    });
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
