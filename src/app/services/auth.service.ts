import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  public register(data: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/register`;
    return this.httpClient.post<any>(url, data).pipe(
      map((response: any) => response.data)  // Trả về chỉ data từ API
    );
  }
}
