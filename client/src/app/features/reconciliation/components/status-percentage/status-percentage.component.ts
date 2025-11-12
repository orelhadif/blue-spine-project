import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Summary } from '../../store/recon.types';
import { StatusData, STATUS_COLORS } from './status-percentage.component.model';

@Component({
  selector: 'app-status-percentage',
  templateUrl: './status-percentage.component.html',
  standalone: false,
  styleUrls: ['./status-percentage.component.less'],
})
export class StatusPercentageComponent implements OnChanges {
  @Input() summary: Summary | null = null;

  statuses: StatusData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary'] && this.summary) {
      this.calculateStatuses();
    }
  }

  private calculateStatuses(): void {
    const { summary } = this;
    if (!summary?.totalClaims) {
      this.statuses = [];
      return;
    }

    const total = summary.totalClaims;
    this.statuses = [
      {
        label: 'Balanced',
        count: summary.balanced,
        percentage: Math.round((summary.balanced / total) * 100),
        color: STATUS_COLORS.balanced,
      },
      {
        label: 'Overpaid',
        count: summary.overpaid,
        percentage: Math.round((summary.overpaid / total) * 100),
        color: STATUS_COLORS.overpaid,
      },
      {
        label: 'Underpaid',
        count: summary.underpaid,
        percentage: Math.round((summary.underpaid / total) * 100),
        color: STATUS_COLORS.underpaid,
      },
      {
        label: 'N/A',
        count: summary.na,
        percentage: Math.round((summary.na / total) * 100),
        color: STATUS_COLORS.na,
      },
    ].filter((status) => status.count > 0);
  }
}

