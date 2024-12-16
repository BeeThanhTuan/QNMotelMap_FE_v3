import { ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { confirmPasswordValidator } from '../../../share-module/validator-custom/confirmPasswordValidator';
import { AlertService } from 'src/app/services/alert.service';
import { Role } from 'src/app/interfaces/role';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
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
  roleID!: string;
  @Output() newUser = new EventEmitter<User>()
  constructor(private formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
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
      const { username, email, password, phoneNumber, address, roleID} = this.addUserForm.value;
      const data = new FormData();
      data.append('username', username);
      data.append('email', email);
      data.append('password', password);
      data.append('phoneNumber', phoneNumber);
      data.append('address', address);
      data.append('roleID', roleID);
      
      if (this.image) {
        data.append('image', this.image);
      }
      else{
        this.alertService.showError('Tạo người dùng thất bại!', 'Vui lòng chọn 1 ảnh'); 
        return;
      }
      this.userService.addNewUser(data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Tạo người dùng thành công!', 'Bạn đã tạo tài khoản mới thành công.');
          this.newUser.emit(response);
          this.hiddenPopupAddUser();
        },
        error: (error) => {
          this.alertService.showError('Tạo người dùng thất bại!', error.error.message); 
        }
      });
    }
  }

  hiddenPopupAddUser():void{
    const popupAddUser = document.getElementById('popupAddUser') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupAddUser && popupAddUser.classList.contains('flex')){
      popupAddUser.classList.remove('flex')
      popupAddUser.classList.add('hidden')
    }
    this.addUserForm.reset();
    this.image = null;
    this.imageUrl = '';

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
    console.log(file);
    
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
