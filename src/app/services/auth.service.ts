import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true, // Đảm bảo gửi cookie qua CORS
  };

  private isLoginSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private router: Router, private alertService: AlertService) {}
  
  get isLogin$() {
    return this.isLoginSubject.asObservable();
  }
  
  public login(data: { email: string; password: string }): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/login`;

    return this.httpClient.post<any>(url, data, this.httpOptions).pipe(
      tap((response: any) => {
        const accessToken = response?.data?.accessToken;
        const refreshToken = response?.data?.refreshToken;
        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          this.setRefreshTokenCookie(refreshToken);
          this.isLoginSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error; // Re-throw error for component to handle
      })
    );
  }

  public logout(): void {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    // Clear refresh token cookie
    document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.isLoginSubject.next(false);
    this.router.navigate(['/client/home']);
    this.alertService.showSuccess('Đăng xuất thành công!', 'Bạn đã đăng xuất tin thành công.');
  }
  
  public register(data: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/register`;
    return this.httpClient.post<any>(url, data, this.httpOptions).pipe(
      map((response: any) => response.data)  
    );
  }

  public refreshToken(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/refresh-token`; 
    return this.httpClient.post<any>(url,{}, { withCredentials: true });
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

  // Hàm để set refreshToken vào cookie
  private setRefreshTokenCookie(refreshToken: string): void {
    const cookieExpireDate = new Date();
    cookieExpireDate.setDate(cookieExpireDate.getDate() + 7); // Token sẽ hết hạn trong 7 ngày
    document.cookie = `refreshToken=${refreshToken}; path=/; expires=${cookieExpireDate.toUTCString()}; secure; HttpOnly; SameSite=None`;
  }
}
