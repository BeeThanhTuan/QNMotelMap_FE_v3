import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { confirmPasswordValidator } from '../../validator-custom/confirmPasswordValidator'; 

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
  constructor(private formBuilder: FormBuilder, private roleService: RoleService) {
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

  handleLogin(): void {
    this.isLoginSubmitted = true;
    if (this.loginForm.valid) {
    } else {
      this.focusFirstInvalidControl(this.loginForm);
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

  handleRegisterUser(): void {
    this.isRegisterUserSubmitted = true;
    if (this.registerUserForm.invalid) {
      this.focusFirstInvalidControl(this.registerUserForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; // Dừng lại nếu form không hợp lệ
    }
  }

  handleRegisterLandlord(): void {
    this.isRegisterLandlordSubmitted = true;
    if (this.registerLandlordForm.invalid) {
      this.focusFirstInvalidControl(this.registerLandlordForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; // Dừng lại nếu form không hợp lệ
    }
  }
}
