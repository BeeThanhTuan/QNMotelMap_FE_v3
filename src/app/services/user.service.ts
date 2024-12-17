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

  public getAllUsers(): Observable<User[]> {
    const url = `${this.REST_API_SERVER}/api/users`;
    return this.httpClient.get<User[]>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public getInfoUserByEmail(id: string): Observable<User> {
    const url = `${this.REST_API_SERVER}/api/user/${id}`;
    return this.httpClient.get<User>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public addNewUser(data: FormData): Observable<User> {
    const url = `${this.REST_API_SERVER}/api/user-role-admin`;
    return this.httpClient.post<User>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public updateInfoUserRoleAdmin(data: FormData): Observable<User> {
    const url = `${this.REST_API_SERVER}/api/user-role-admin`;
    return this.httpClient.put<User>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public softDeleteUserByEmail(email:string): Observable<User>{
      const url = `${this.REST_API_SERVER}/api/soft-delete-user/${email}`;
      return this.httpClient.delete<User>(url).pipe(
        map((response:any) => response.data) 
      )
  }

  public updateAvatarUser(data: FormData): Observable<User> {
    const url = `${this.REST_API_SERVER}/api/user-update-image`;
    return this.httpClient.put<User>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public updateInfoUser(data: any): Observable<User> {
    const url = `${this.REST_API_SERVER}/api/user-update-info`;
    return this.httpClient.put<User>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public countUsers(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/count-users`;
    return this.httpClient.get<any>(url).pipe(
      map((response:any) => response.data) 
    )
  }

}
