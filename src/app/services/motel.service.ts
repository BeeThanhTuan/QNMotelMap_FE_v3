import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Motel } from '../interfaces/motel';
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

  public getTop8MotelsByRating(): Observable<Motel[]> {
    const url = `${this.REST_API_SERVER}/api/top-motels`;
    return this.httpClient.get<Motel[]>(url).pipe(
      map((response:any) => response.data) 
    )
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

  public getListAddress(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/list-ward-commune`;
    return this.httpClient.get<any>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public countMotelsByWardCommune(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/count-motels-by-ward-commune`;
    return this.httpClient.get<any>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public addNewMotel(data: FormData): Observable<Motel>{
    const url = `${this.REST_API_SERVER}/api/motel`;
    return this.httpClient.post<Motel>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public updateInfoMotelByID(idMotel: string, data: FormData): Observable<Motel>{
    const url = `${this.REST_API_SERVER}/api/motel/${idMotel}`;
    return this.httpClient.put<Motel>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public softDeleteMotelByID(idMotel:string): Observable<Motel>{
    const url = `${this.REST_API_SERVER}/api/motel-soft-delete/${idMotel}`;
    return this.httpClient.delete<Motel>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}
