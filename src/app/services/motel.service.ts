import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Motel } from '../interfaces/motel';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class MotelService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getAllMotels(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motels`;
    return this.httpClient.get<any>(url)
  }

  public getMotelByID(id: string): Observable<Motel> {
    const url = `${this.REST_API_SERVER}/api/motel/${id}`;
    return this.httpClient.get<Motel>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public getMotelsFiltered(filters:any): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/motels/filters`;
    return this.httpClient.get<any>(url, { params: filters })
  }

  public getListWardCommune(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/list-ward-commune`;
    return this.httpClient.get<any>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}
