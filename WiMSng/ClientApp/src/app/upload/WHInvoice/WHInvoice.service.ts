import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WhInvoiceService {
  apiURL: string;

  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = `${baseUrl}Upload/WHInvoice/UploadExcel`;
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiURL, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Upload error:', error);
        return throwError(() => new Error(error.error?.message || 'An error occurred during upload'));
      })
    );
  }
}



//import { Inject, Injectable } from '@angular/core';
//import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { Observable, throwError } from 'rxjs';
//import { catchError } from 'rxjs/operators';

//@Injectable({
//  providedIn: 'root',
//})
//export class WhInvoiceService {

//  /*private apiUrl = 'http://localhost:22434/Upload/WHInvoice/UploadExcel';*/
//  apiURL: string;
//  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
//    this.apiURL = baseUrl + 'Upload/WHInvoice/UploadExcel';
//  }

//  uploadFile(file: File): Observable<any> {
//    const formData = new FormData();
//    formData.append('file', file);

//    return this.http.post(this.apiURL, formData).pipe(
//      catchError((error: HttpErrorResponse) => {
//        console.error('Upload error:', error);
//        return throwError(() => new Error(error.error?.message || 'An error occurred during upload'));
//      })
//    );
//  }
//}
