import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  public getRoleIDByRoleName(roleName: string): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/roles/${roleName}`;
    return this.httpClient.get<any>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}
