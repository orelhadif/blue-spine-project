import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  standalone: false,
  styleUrls: ['./upload.component.less']
})
export class UploadComponent {
  @Input() label = 'Upload CSV';
  @Input() disabled = false;
  @Output() uploadedCsv = new EventEmitter<string>();
  isUploading = false;

  onFileChange(ev: Event) {
    if (this.disabled) {
      ev.preventDefault();
      return;
    }
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.isUploading = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedCsv.emit(String(reader.result ?? ''));
      this.isUploading = false;
      input.value = '';
    };
    reader.onerror = () => {
      console.error('Failed to read CSV file');
      this.isUploading = false;
    };
    reader.readAsText(file);
  }
}
