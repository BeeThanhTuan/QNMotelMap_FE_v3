import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { confirmPasswordValidator } from '../../../share-module/validator-custom/confirmPasswordValidator';
import { AlertService } from 'src/app/services/alert.service';
import { Role } from 'src/app/interfaces/role';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Images } from 'src/app/interfaces/images';

@Component({
  selector: 'app-popup-update-user',
  templateUrl: './popup-update-user.component.html',
  styleUrls: ['./popup-update-user.component.css']
})
export class PopupUpdateUserComponent {
  image!: File | null;
  imageUrl= '';
  oldImage!:string;
  listRoles: Role [] = [];
  passwordAddUserVisible = false;
  confirmPasswordAddUserVisible = false;
  updateUserForm!: FormGroup;

  firstInvalidControl: string | null = null;
  selectedTab: string = 'user'; 
  roleID!: string;
  @Input() user!:User;
  @Output() newUser = new EventEmitter<User>()
  constructor(private formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService) {
    this.initializeFormRegisterUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
   if(changes['user']){
    this.setInfoIntoForm(this.user)
   }
    
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  // Initialize form register user
  initializeFormRegisterUser(): void {
    this.updateUserForm= this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber:['', [Validators.required,Validators.minLength(10), Validators.maxLength(10),]],
      address:['' ],
      roleID: [''],
    });
  }

  get usernameControl() {
    return this.updateUserForm.get('username');
  }

  get emailControl() {
    return this.updateUserForm.get('email');
  }

  get passwordControl() {
    return this.updateUserForm.get('password');
  }

  get confirmPasswordControl() {
    return this.updateUserForm.get('confirmPassword');
  }

  get phoneNumberControl() {
    return this.updateUserForm.get('phoneNumber');
  }

  get addressControl() {
    return this.updateUserForm.get('address');
  }

  get roleIDControl() {
    return this.updateUserForm.get('roleID');
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

  setInfoIntoForm(user:User){
      this.updateUserForm.patchValue({
        username: user.Username,
        email: user.Email,
        phoneNumber: user.PhoneNumber,
        address: user.Address,
        roleID: user.RoleID._id
      },
      { emitEvent: false }
      );
      this.oldImage = user.Image
  }


  // update user
  handleUpdateUser(): void {
    if (this.updateUserForm.invalid) {
      this.focusFirstInvalidControl(this.updateUserForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; 
    }
    else{
      const { username, email, phoneNumber, address, roleID} = this.updateUserForm.value;
      const dataRequest = { username, email, phoneNumber, address, roleID,}
      const data = new FormData();
      data.append('username', username);
      data.append('email', email);
      data.append('phoneNumber', phoneNumber);
      data.append('address', address);
      data.append('roleID', roleID);
      console.log(this.image);
      
      if (this.image) {
        data.append('image', this.image);
      }

      if(!this.image && !this.oldImage){
        this.alertService.showError('Tạo người dùng thất bại!', 'Vui lòng chọn 1 ảnh'); 
        return;
      }
      this.userService.updateInfoUserRoleAdmin(data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Cập nhật thành công!', 'Bạn đã cập nhật thông tin thành công.');
          this.newUser.emit(response);
          this.hiddenPopupUpdateUser();
        },
        error: (error) => {
          this.alertService.showError('Cập nhật thất bại!', error.error.message); 
        }
      });
    }
  }

  hiddenPopupUpdateUser():void{
    const popupUpdateUser = document.getElementById('popupUpdateUser') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateUser && popupUpdateUser.classList.contains('flex')){
      popupUpdateUser.classList.remove('flex')
      popupUpdateUser.classList.add('hidden')
    }
    this.updateUserForm.reset();
    this.image = null;
    this.imageUrl = '';
    this.oldImage = '';

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

  removeImageOld():void{
    this.oldImage = ''
  }
}
