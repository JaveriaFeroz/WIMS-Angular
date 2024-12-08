import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})

export class SupplierService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + 'master/Supplier/');
  }

  get(SupplierId: number): Observable<Supplier> {
    return this.http.get<Supplier>(this.apiURL + 'master/Supplier/' + SupplierId);
  }

  save(supplier: Supplier) {
    return this.http.post<Supplier>(this.apiURL + 'master/Supplier/', supplier);
  }
}  
