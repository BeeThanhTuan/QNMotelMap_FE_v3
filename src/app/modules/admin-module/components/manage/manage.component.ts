import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MotelService } from 'src/app/services/motel.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent {
  isShowUpdateProfile = false;
  isLogin = false;
  user: User ={
    _id: '',
    Email: '',
    Username: '',
    RoleID: {} as Role,
    Image: '',
    Address: '',
    PhoneNumber: '',
    CreateAt: '',
    UpdateAt: '',
    UpdateBy: '',
    IsDelete: false,
  };
  constructor(private titleService:Title, private authService: AuthService,
     private userService: UserService){}

  ngOnInit(): void {
    this.titleService.setTitle('QNMoteMap | Quản lý ');
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
        this.user = response;
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
  }

  showPupUpdateProfile(user: User): void {
    this.isShowUpdateProfile = true;
    this.user = {...user};
    const popupUpdateProfile = document.getElementById('popupUpdateProfile') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateProfile && popupUpdateProfile.classList.contains('hidden')){
      popupUpdateProfile.classList.remove('hidden')
      popupUpdateProfile.classList.add('flex')
    }
  }

  receiveNewInfoUser(data: User): void {
      this.user = data
  }

  handleLogout():void{
    this.authService.logout();
  }

  
}
