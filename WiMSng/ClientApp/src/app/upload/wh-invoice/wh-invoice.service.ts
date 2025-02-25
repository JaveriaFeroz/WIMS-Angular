
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WhInvoiceService {
  // Update this URL to match your API routes
  private apiUrl = '/Upload/WHInvoice/UploadExcel';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Upload error:', error);
        return throwError(() => new Error(error.error?.message || 'An error occurred during upload'));
      })
    );
  }
}
