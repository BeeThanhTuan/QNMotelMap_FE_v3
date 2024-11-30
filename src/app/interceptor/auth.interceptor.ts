import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(clonedRequest).pipe(
        catchError((error) => {
          if (error.status === 401) { 
            // Khi nhận lỗi 401 (Unauthorized)
            return this.authService.refreshToken().pipe( // Gọi API refresh token
              switchMap((newToken: string) => {
                // Lưu accessToken mới
                localStorage.setItem('accessToken', newToken);

                // Gửi lại request ban đầu với token mới
                const newRequest = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newToken}`),
                });
                return next.handle(newRequest);
              })
            );
          }
          return throwError(error); // Các lỗi khác
        })
      );
    }

    return next.handle(req); // Không có token, gửi request như bình thường
  }
}
