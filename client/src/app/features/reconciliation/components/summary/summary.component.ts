import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Summary } from '../../store/recon.types';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  standalone: false,
  styleUrls: ['./summary.component.less'],
})
export class SummaryComponent {
  @Input() summary: Summary | null = null;
  @Output() clear = new EventEmitter<void>();

  onClear(): void {
    this.clear.emit();
  }
}
