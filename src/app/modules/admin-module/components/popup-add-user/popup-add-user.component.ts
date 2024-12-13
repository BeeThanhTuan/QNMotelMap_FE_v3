import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { confirmPasswordValidator } from '../../../share-module/validator-custom/confirmPasswordValidator';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import Swal from 'sweetalert2';
import { RoleName } from 'src/app/services/roleEnum';
import { Router } from '@angular/router';
import { Role } from 'src/app/interfaces/role';
import { response } from 'express';
@Component({
  selector: 'app-popup-add-user',
  templateUrl: './popup-add-user.component.html',
  styleUrls: ['./popup-add-user.component.css']
})
export class PopupAddUserComponent {
  image!: File | null;
  imageUrl= '';
  listRoles: Role [] = [];
  passwordAddUserVisible = false;
  confirmPasswordAddUserVisible = false;
  addUserForm!: FormGroup;

  firstInvalidControl: string | null = null;
  selectedTab: string = 'user'; 
  roleID!: string;
  cdr: any;
  constructor(private formBuilder: FormBuilder,
    private roleService: RoleService,
    private authService: AuthService,
    private alertService: AlertService) {
    this.initializeFormRegisterUser();
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  // Initialize form register user
  initializeFormRegisterUser(): void {
    this.addUserForm= this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), confirmPasswordValidator]],
      phoneNumber:['', [Validators.required,Validators.minLength(10), Validators.maxLength(10),]],
      address:['' ],
      roleID: [''],
    });
  }

  get usernameControl() {
    return this.addUserForm.get('username');
  }

  get emailControl() {
    return this.addUserForm.get('email');
  }

  get passwordControl() {
    return this.addUserForm.get('password');
  }

  get confirmPasswordControl() {
    return this.addUserForm.get('confirmPassword');
  }

  get phoneNumberControl() {
    return this.addUserForm.get('phoneNumber');
  }

  get addressControl() {
    return this.addUserForm.get('address');
  }

  get roleIDControl() {
    return this.addUserForm.get('roleID');
  }

  getAllRoles():void{
    this.roleService.getAllRoles().subscribe((response)=>{
      this.listRoles = response;
    })
  }

  togglePasswordAddUserVisibility(): void {
    this.passwordAddUserVisible = !this.passwordAddUserVisible;
  }

  toggleConfirmPasswordAddUserVisibility(): void {
    this.confirmPasswordAddUserVisible = !this.confirmPasswordAddUserVisible;
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


  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  // add user
  handleAddUser(): void {
    if (this.addUserForm.invalid) {
      this.focusFirstInvalidControl(this.addUserForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; 
    }
    else{
      const { username, email, password} = this.addUserForm.value;
      const dataRequest = {
        username,
        email,
        password,
        roleID:this.roleID
      }
      this.authService.register(dataRequest).subscribe({
        next: (response) => {
          // this.showSuccess('Đăng ký thành công!', 'Bạn đã tạo tài khoản mới thành công.');
          this.addUserForm.reset();
        },
        error: (error) => {
          this.alertService.showError('Đăng ký thất bại!', error.error.message); 
        }
      });
    }
  }

  hiddenPopupAddUser(){

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0]; // Lấy file đầu tiên được chọn
    if (!file) {
      return; // Không có file nào được chọn
    }
  
    // Kiểm tra nếu đã có một ảnh được chọn
    if (this.image) {
      this.alertService.showWarning('Cảnh báo!', 'Chỉ được chọn 1 ảnh!');
      return;
    }
  
    this.image = file; // Lưu file vào biến image
    this.imageUrl = URL.createObjectURL(file); // Tạo URL để hiển thị ảnh
  
    setTimeout(() => {
      this.cdr.detectChanges(); // Đảm bảo Angular cập nhật view
    }, 0);
  }
  
  removeImage(): void {
    this.image = null; // Gán lại giá trị null để xóa ảnh
    this.imageUrl = ''; // Xóa URL của ảnh
  }


}
