"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHInvoiceComponent = void 0;
const core_1 = require("@angular/core");
let WHInvoiceComponent = class WHInvoiceComponent {
    constructor(whInvoiceService) {
        this.whInvoiceService = whInvoiceService;
        this.selectedFile = null;
        this.isUploading = false;
        this.errorMessage = '';
        this.successMessage = '';
    }
    ngOnInit() { }
    onFileSelected(event) {
        var _a;
        const file = event.target.files[0];
        if (file) {
            const fileExtension = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                this.selectedFile = file;
                this.errorMessage = '';
            }
            else {
                this.errorMessage = 'Please select an Excel file (.xlsx or .xls)';
                this.selectedFile = null;
                event.target.value = '';
            }
        }
    }
    uploadFile() {
        if (!this.selectedFile) {
            this.errorMessage = 'Please select a file to upload';
            return;
        }
        this.isUploading = true;
        this.errorMessage = '';
        this.successMessage = '';
        this.whInvoiceService.uploadFile(this.selectedFile).subscribe({
            next: (response) => {
                this.successMessage = (response === null || response === void 0 ? void 0 : response.message) || 'File uploaded successfully';
                this.resetFileInput();
            },
            error: (error) => {
                var _a;
                this.errorMessage = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'An error occurred during upload';
            },
            complete: () => {
                this.isUploading = false;
            },
        });
    }
    resetFileInput() {
        this.selectedFile = null;
        this.errorMessage = '';
        this.successMessage = '';
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput)
            fileInput.value = '';
    }
};
WHInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-WHInvoice',
        templateUrl: './WHInvoice.component.html',
        styleUrls: ['./WHInvoice.component.css'],
    })
], WHInvoiceComponent);
exports.WHInvoiceComponent = WHInvoiceComponent;
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
//# sourceMappingURL=WHInvoice.component.js.map