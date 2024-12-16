import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { RoleName } from '../services/roleEnum';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const checkRoleLandlordGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const roleService = inject(RoleService); // Inject RoleService
  const messageService = inject(NzMessageService); // Inject Message Service
  const router = inject(Router); // Inject Router

  const roleEnum = RoleName; // Role Enum
  const referrerUrl = document.referrer || '/'; // URL trước đó hoặc về trang chính

  // Kiểm tra sự tồn tại của token trong localStorage
  const token = localStorage.getItem('accessToken');
  
  // Nếu không có token, chưa đăng nhập
  if (!token) {
    showMessage('error', 'Bạn chưa đăng nhập.');
    redirectTo(referrerUrl);
    return of(false);
  }

  // Nếu có token, kiểm tra RoleName
  return roleService.getRoleNameByRoleId(authService.getRoleIDFromToken()).pipe(
    map((response) => {
      const roleName = response?.RoleName;
      if (roleName === roleEnum.Landlord) {
        return true; // Được phép truy cập
      } else {
        showMessage('error', 'Không có quyền truy cập.');
        redirectTo(referrerUrl); // Quay lại trang trước đó
        return false;
      }
    }),
    catchError((err) => {
      // Xử lý lỗi khi gọi API
      showMessage('error', 'Có lỗi xảy ra.');
      redirectTo(referrerUrl);
      return of(false);
    })
  );

  // Hàm hiển thị thông báo
  function showMessage(type: string, text: string): void {
    messageService.create(type, text, { nzDuration: 3000 });
  }

  // Hàm chuyển hướng đến URL khác
  function redirectTo(url: string): void {
    router.navigateByUrl(url);
  }
};
