import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ControlJob } from './controljob';

@Injectable({
  providedIn: 'root'
})

export class ControlJobService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  get(periodId: number) {
    return this.http.get<any>(this.apiURL + 'finance/ControlJob/' + periodId );
  }

  save(cj: ControlJob) {
    return this.http.post<ControlJob>(this.apiURL + 'finance/ControlJob/', cj);
  } 
}
