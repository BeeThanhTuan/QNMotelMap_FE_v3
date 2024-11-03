import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Convenient } from '../interfaces/convenient';
@Injectable({
  providedIn: 'root'
})
export class ConvenientService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getAllConvenient(): Observable<Convenient[]> {
    const url = `${this.REST_API_SERVER}/api/convenient`;
    return this.httpClient.get<Convenient[]>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}