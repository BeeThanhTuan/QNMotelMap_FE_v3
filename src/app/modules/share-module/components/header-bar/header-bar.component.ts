import { Component } from '@angular/core';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { RoleName } from 'src/app/services/roleEnum';
@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent {
  isLogin = false;
  isShowUpdateProfile = false;
  roleName!:string;
  enumRoleName = RoleName;
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
  constructor(private authService: AuthService, private userService: UserService, private roleService: RoleService){}

  ngOnInit(): void {
    this.authService.isLogin$.subscribe((isLogin) => {
      this.isLogin = isLogin;
      console.log(isLogin ? 'Đã đăng nhập' : 'Chưa đăng nhập');
    });
    // Kiểm tra login khi component khởi tạo
    this.authService.checkIsLogin();
    this.getInfoUser();
    this.getRoleName();
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

  getRoleName():void{
    const roleID = this.authService.getRoleIDFromToken();
      this.roleService.getRoleNameByRoleId(roleID).subscribe({  
        next: (response) => {
         this.roleName = response.RoleName
        },
    });
  }

  showPopupLoginRegister(): void{
    const body = document.querySelector('body') as HTMLElement;
    const loginPopup = document.getElementById('loginPopup') as HTMLElement;
    body.style.overflow = "hidden"
    loginPopup.style.display = "flex";
  }

  showPupUpdateProfile(): void {
    const popupUpdateProfile = document.getElementById('popupUpdateProfile') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateProfile && popupUpdateProfile.classList.contains('hidden')){
      popupUpdateProfile.classList.remove('hidden')
      popupUpdateProfile.classList.add('flex')
    }
  }

  handleLogout():void{
    this.authService.logout();
  }



  
}
