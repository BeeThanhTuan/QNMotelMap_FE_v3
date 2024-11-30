import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

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

  private isLoginSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}
  
  get isLogin$() {
    return this.isLoginSubject.asObservable();
  }
  
  public login(data: { email: string; password: string }): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/login`;

    return this.httpClient.post<any>(url, data, this.httpOptions).pipe(
      tap((response: any) => {
        // Lưu accessToken vào localStorage
        const accessToken = response?.data?.accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          this.isLoginSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error; // Re-throw error for component to handle
      })
    );
  }


  public register(data: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/register`;
    return this.httpClient.post<any>(url, data, this.httpOptions).pipe(
      map((response: any) => response.data)  
    );
  }

  public refreshToken(): Observable<string> {
    const url = `${this.REST_API_SERVER}/api/refresh-token`; 
    return this.httpClient.post<string>(url, {}, { withCredentials: true });
  }

  public decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  public getRoleIDFromToken(): string {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); 
        return decodedToken.roleID; 
      } catch (error) {
        console.error('Invalid token', error);
        return '';
      }
    }
    return '';
  }

  public getEmailFromToken(): string{
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); 
        return decodedToken.email; 
      } catch (error) {
        console.error('Invalid token', error);
        return '';
      }
    }
    return '';
  }

  public verifyToken(): Observable<boolean> {
    const url = `${this.REST_API_SERVER}/api/verify-token`; 
    return this.httpClient.get(url).pipe(
      map(() => true), // Token hợp lệ
      catchError(() => of(false)) // Token không hợp lệ
    );
  }

  public checkIsLogin(): void {
    this.verifyToken().subscribe((isValid) => {
      this.isLoginSubject.next(isValid);
      if (isValid) {
        console.log('Đã đăng nhập');
      } else {
        console.log('Chưa đăng nhập');
      }
    });
  }
}
