import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  standalone: false,
  styleUrls: ['./upload.component.less'],
})
export class UploadComponent {
  @Input() label = 'Upload CSV';
  @Input() disabled = false;
  @Output() uploadedCsv = new EventEmitter<string>();
  isUploading = false;
  reader = new FileReader();

  onFileChange(ev: Event) {
    if (this.disabled) {
      ev.preventDefault();
      return;
    }
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.isUploading = true;
   
    this.reader.onload = () => {
      this.uploadedCsv.emit(String(this.reader.result ?? ''));
      this.isUploading = false;
      input.value = '';
    };
    this.reader.onerror = () => {
      console.error('Failed to read CSV file');
      this.isUploading = false;
    };
    this.reader.readAsText(file);
  } 
}
