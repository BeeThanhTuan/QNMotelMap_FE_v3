import { Component } from '@angular/core';
import { response } from 'express';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent {
  isLogin = false;
  user: User ={
    _id: '',
    Email: '',
    Username: '',
    RoleID: '',
    Image: '',
    PhoneNumber: '',
    CreateAt: '',
    UpdateAt: '',
    UpdateBy: '',
    IsDelete: false,
  };
  constructor(private authService: AuthService, private userService: UserService){}

  ngOnInit(): void {
    this.authService.isLogin$.subscribe((isLogin) => {
      this.isLogin = isLogin;
      console.log(isLogin ? 'Đã đăng nhập' : 'Chưa đăng nhập');
    });
  
    // Kiểm tra login khi component khởi tạo
    this.authService.checkIsLogin();

    this.getInfoUser();
  }

  getInfoUser() :void{
    const email = this.authService.getEmailFromToken();
    this.userService.getInfoUserByEmail(email).subscribe({
      next: (response) => {
        this.user = response
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
  }

  showPopupLoginRegister(): void{
    const body = document.querySelector('body') as HTMLElement;
    const loginPopup = document.getElementById('loginPopup') as HTMLElement;
    body.style.overflow = "hidden"
    loginPopup.style.display = "flex";
  }


  
}
