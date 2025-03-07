import { Component, OnInit } from '@angular/core';
import { WhInvoiceService } from './WHInvoice.service';

@Component({
  selector: 'app-WHInvoice',
  templateUrl: './WHInvoice.component.html',
  styleUrls: ['./WHInvoice.component.css'],
})
export class WHInvoiceComponent implements OnInit {
  selectedFile: File | null = null;
  isUploading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private whInvoiceService: WhInvoiceService) { }

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

    this.whInvoiceService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = response?.message || 'File uploaded successfully';
        this.resetFileInput();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during upload';
      },
      complete: () => {
        this.isUploading = false;
      },
    });
  }

  resetFileInput(): void {
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}

//import { Component, OnInit } from '@angular/core';
//import { WhInvoiceService } from './WHInvoice.service';

//@Component({
//  selector: 'app-WHInvoice',
//  templateUrl: './WHInvoice.component.html',
//  styleUrls: ['./WHInvoice.component.css'],
//})
//export class WHInvoiceComponent implements OnInit {
//  selectedFile: File | null = null;
//  isUploading = false;
//  errorMessage = '';
//  successMessage = '';


//  constructor(private whInvoiceService: WhInvoiceService) { }

//  ngOnInit() { }

//  onFileSelected(event: any): void {
//    const file = event.target.files[0];
//    if (file) {
//      const fileExtension = file.name.split('.').pop()?.toLowerCase();

//      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
//        this.selectedFile = file;
//        this.errorMessage = '';
//      } else {
//        this.errorMessage = 'Please select an Excel file (.xlsx or .xls)';
//        this.selectedFile = null;
//        event.target.value = '';
//      }
//    }
//  }

//  uploadFile(): void {
//    if (!this.selectedFile) {
//      this.errorMessage = 'Please select a file to upload';
//      return;
//    }

//    this.isUploading = true;
//    this.errorMessage = '';
//    this.successMessage = '';

//    this.whInvoiceService.uploadFile(this.selectedFile).subscribe({
//      next: () => {
//        this.successMessage = 'File uploaded successfully';
//        this.selectedFile = null;
//        this.resetFileInput();
//      },
//      error: (error) => {
//        this.errorMessage = error.message || 'An error occurred during upload';
//      },
//      complete: () => {
//        this.isUploading = false;
//      },
//    });
//  }

 

//  private resetFileInput(): void {
//    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//    if (fileInput) fileInput.value = '';
//  }
//}



