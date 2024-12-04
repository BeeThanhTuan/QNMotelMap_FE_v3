import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { confirmPasswordValidator } from '../../validator-custom/confirmPasswordValidator'; 
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import Swal from 'sweetalert2';
import { RoleName } from 'src/app/services/roleEnum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordLoginVisible = false;
  passwordRegisterUserVisible = false;
  confirmPasswordRegisterUserVisible = false;
  passwordRegisterLandlordVisible = false;
  confirmPasswordRegisterLandlordVisible = false;
  isShowLogin = true;
  isShowRegister = false;
  loginForm!: FormGroup;
  registerUserForm!: FormGroup;
  registerLandlordForm!: FormGroup;
  isLoginSubmitted = false;
  isRegisterUserSubmitted = false;
  isRegisterLandlordSubmitted = false;

  firstInvalidControl: string | null = null;
  selectedTab: string = 'user'; 
  roleID!: string;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private authService: AuthService,
    private alert: AlertService) {
    this.initializeFormLogin();
    this.initializeFormRegisterUser();
    this.initializeFormRegisterLandlord();
  }

  ngAfterViewInit(): void {
    this.getRoleIdByRoleName('Client');
  }

  // Initialize form login
  initializeFormLogin(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Initialize form register user
  initializeFormRegisterUser(): void {
    this.registerUserForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), confirmPasswordValidator]],
    });
  }

  // Initialize form register landlord
  initializeFormRegisterLandlord(): void {
    this.registerLandlordForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), confirmPasswordValidator]],
      phoneNumber:['', [Validators.required,Validators.minLength(10), Validators.maxLength(10),]],
      address:['' ],
    });
  }


  get emailControlLogin() {
    return this.loginForm.get('email');
  }

  get passwordControlLogin() {
    return this.loginForm.get('password');
  }

  get usernameControlRegisterUser() {
    return this.registerUserForm.get('username');
  }

  get emailControlRegisterUser() {
    return this.registerUserForm.get('email');
  }

  get passwordControlRegisterUser() {
    return this.registerUserForm.get('password');
  }

  get confirmPasswordControlRegisterUser() {
    return this.registerUserForm.get('confirmPassword');
  }

  get usernameControlRegisterLandlord() {
    return this.registerLandlordForm.get('username');
  }

  get emailControlRegisterLandlord() {
    return this.registerLandlordForm.get('email');
  }

  get passwordControlRegisterLandlord() {
    return this.registerLandlordForm.get('password');
  }

  get confirmPasswordControlRegisterLandlord() {
    return this.registerLandlordForm.get('confirmPassword');
  }

  get phoneNumberControlRegisterLandlord() {
    return this.registerLandlordForm.get('phoneNumber');
  }

  get addressControlRegisterLandlord() {
    return this.registerLandlordForm.get('address');
  }

  // alert show success register
  showSuccessRegister( title:string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      showDenyButton: true, 
      denyButtonText: 'Đăng nhập',  // Nút Go to Login
      confirmButtonText: 'OK',  // Nút OK
      confirmButtonColor: '#797a7e',  // Màu nút OK
      denyButtonColor: '#3085d6',  // Màu nút Go to Login
    }).then((result) => {
      if (result.isConfirmed) {
        // Nếu người dùng nhấn nút OK
        console.log('User clicked OK');
      } else if (result.isDenied) {
        this.isShowLogin = true;
        this.isShowRegister = false;
      }
    });
  }

  hiddenPopupLoginRegister(): void{
    const body = document.querySelector('body') as HTMLElement;
    const loginPopup = document.getElementById('loginPopup') as HTMLElement;
    body.style.overflow = "auto"
    loginPopup.style.display = "none";
    this.loginForm.reset();
    this.registerLandlordForm.reset();
    this.registerUserForm.reset();
  }
  

  togglePasswordLoginVisibility(): void {
    this.passwordLoginVisible = !this.passwordLoginVisible;
  }

  togglePasswordRegisterUserVisibility(): void {
    this.passwordRegisterUserVisible = !this.passwordRegisterUserVisible;
  }

  toggleConfirmPasswordRegisterUserVisibility(): void {
    this.confirmPasswordRegisterUserVisible = !this.confirmPasswordRegisterUserVisible;
  }

  togglePasswordRegisterLandlordVisibility(): void {
    this.passwordRegisterLandlordVisible = !this.passwordRegisterLandlordVisible;
  }

  toggleConfirmPasswordRegisterLandlordVisibility(): void {
    this.confirmPasswordRegisterLandlordVisible = !this.confirmPasswordRegisterLandlordVisible;
  }

  handleNavigation(target: string){
    if(target === RoleName.User){
      this.router.navigate(['client/home']);
    }
    else if(target === RoleName.Landlord){
      this.router.navigate(['landlord/manage']);
    }
    else{
      this.router.navigate(['admin/manage']);
    }
  }

  handleLogin(): void {
    this.isLoginSubmitted = true;
    if (this.loginForm.invalid) {
      this.focusFirstInvalidControl(this.loginForm);
    } else {
      const {email, password} = this.loginForm.value;
      const dataLogin = {
        email,
        password
      }
      this.authService.login(dataLogin).subscribe({
        next: (response) => {
          const roleID = this.authService.getRoleIDFromToken();
          this.roleService.getRoleNameByRoleId(roleID).subscribe({  
            next: (response) => {
              this.handleNavigation(response.RoleName);
              this.loginForm.reset();
              this.hiddenPopupLoginRegister();
              window.location.reload();
            },
            error: (roleError) => {
              this.alert.showError('Lỗi khi lấy thông tin!', roleError.error.message);
            }
          });
        },
        error: (error) => {
          this.alert.showError('Đăng nhập thất bại!', error.error.message); 
        }
      })
    }
  }


  focusFirstInvalidControl(formGroup: FormGroup) {
    this.firstInvalidControl = null; // Reset giá trị trước khi kiểm tra
    for (const controlName in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(controlName)) {
        const control = formGroup.controls[controlName];
        if (control.invalid) {
          this.firstInvalidControl = controlName; // Lưu tên trường không hợp lệ
          const inputElement = document.querySelector(
            `[formControlName="${controlName}"]`
          ) as HTMLInputElement;
          if (inputElement) {
            inputElement.focus();
          }
          break; // Dừng lại sau khi đã tìm thấy trường đầu tiên không hợp lệ
        }
      }
    }
  }

  // Hàm để chọn tab
  selectTab(tab: string, formGroup: FormGroup) {
    this.selectedTab = tab;
    formGroup.reset()
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /// register 
  getRoleIdByRoleName(roleName: string):void{
    this.roleService.getRoleIDByRoleName(roleName).subscribe((response)=>{
      this.roleID = response.RoleID;   
    })
  }

  // register for user
  handleRegisterUser(): void {
    this.isRegisterUserSubmitted = true;
    if (this.registerUserForm.invalid) {
      this.focusFirstInvalidControl(this.registerUserForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; 
    }
    else{
      const { username, email, password} = this.registerUserForm.value;
      const dataRequest = {
        username,
        email,
        password,
        roleID:this.roleID
      }
      this.authService.register(dataRequest).subscribe({
        next: (response) => {
          this.showSuccessRegister('Đăng ký thành công!', 'Bạn đã tạo tài khoản mới thành công.');
          this.registerUserForm.reset();
        },
        error: (error) => {
          this.alert.showError('Đăng ký thất bại!', error.error.message); 
        }
      });
    }
  }

  //register for landlord
  handleRegisterLandlord(): void {
    this.isRegisterLandlordSubmitted = true;
    if (this.registerLandlordForm.invalid) {
      this.focusFirstInvalidControl(this.registerLandlordForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; 
    }
    else{
      const { username, email, password, address, phoneNumber} = this.registerLandlordForm.value;
      const dataRequest = {
        username,
        email,
        password,
        address, 
        phoneNumber,
        roleID:this.roleID
      }
       this.authService.register(dataRequest).subscribe({
        next: (response) => {
          this.showSuccessRegister('Đăng ký thành công!', 'Bạn đã tạo tài khoản mới thành công.');
          this.registerLandlordForm.reset();
        },
        error: (error) => {
          this.alert.showError('Đăng ký thất bại!', error.error.message); 
        }
      });
    }
  }
}
