import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  public getInfoUserByEmail(id: string): Observable<User> {
    const url = `${this.REST_API_SERVER}/api/user/${id}`;
    return this.httpClient.get<User>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}
