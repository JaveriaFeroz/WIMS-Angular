// src/app/upload/wh-invoice/wh-invoice.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-wh-invoice',
  templateUrl: './wh-invoice.component.html',
  styleUrls: ['./wh-invoice.component.css']
})
export class WHInvoiceComponent implements OnInit {
  selectedFile: File | null = null;
  isUploading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        this.selectedFile = file;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Please select an Excel file (.xlsx or .xls)';
        this.selectedFile = null;
        event.target.value = '';
      }
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('api/Upload/WHInvoice/UploadExcel', formData)
      .subscribe({
        next: () => {
          this.successMessage = 'File uploaded successfully';
          this.selectedFile = null;
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'An error occurred during upload';
        },
        complete: () => {
          this.isUploading = false;
        }
      });
  }
}
