import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Landlord } from '../interfaces/landlord';

@Injectable({
  providedIn: 'root'
})
export class LandlordService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getLandlordByID(id: string): Observable<Landlord> {
    const url = `${this.REST_API_SERVER}/api/landlord/${id}`;
    return this.httpClient.get<Landlord>(url).pipe(
      map((response:any) => response.data) 
    )
  }

}
