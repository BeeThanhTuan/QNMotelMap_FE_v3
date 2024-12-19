import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent {
  updateInfoForm!: FormGroup;
  isShowPopupUpdateAvatar = false;
  isShowPopupUpdateInfo = false;
  image!: File | null;
  imageUrl = '';
  firstInvalidControl: string | null = null
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() user!: User;
  @Output() newUser = new EventEmitter<User>();

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.user = {
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
    this.initializeForm();
  }

  initializeForm(): void {
    this.updateInfoForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  get usernameControl() {
    return this.updateInfoForm.get('username');
  }

  get addressControl() {
    return this.updateInfoForm.get('address');
  }

  get phoneNumberControl() {
    return this.updateInfoForm.get('phoneNumber');
  }


  setInfoIntoForm(user: User){
      this.updateInfoForm.patchValue({
        username: user.Username,
        address: user.Address,
        phoneNumber: user.PhoneNumber,
      },
      { emitEvent: false }
    );
  }

  hiddenPopupUpdateProfile() {

    const popupUpdateProfile = document.getElementById(
      'popupUpdateProfileAdmin'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'auto';
    if (popupUpdateProfile && popupUpdateProfile.classList.contains('flex')) {
      popupUpdateProfile.classList.remove('flex');
      popupUpdateProfile.classList.add('hidden');
    }
    this.updateInfoForm.reset();
  }

  showPopupUpdateAvatar(): void {
    this.isShowPopupUpdateAvatar = true;
  }

  hiddenPopupUpdateAvatar(): void {
    this.isShowPopupUpdateAvatar = false;
  }

  showPopupUpdateInfo(): void {
    this.setInfoIntoForm(this.user);
    this.isShowPopupUpdateInfo = true;
  }

  hiddenPopupUpdateInfo(): void {
    this.isShowPopupUpdateInfo = false;
    this.updateInfoForm.reset();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0]; // Lấy file đầu tiên được chọn
    if (!file) {
      return; // Không có file nào được chọn
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

  handleUpdateAvatar():void{
    const data = new FormData()
    if (this.image) {
      data.append('image', this.image);
    }
    this.userService.updateAvatarUser(data).subscribe({
      next: (response) => {
        this.alertService.showSuccess('Cập nhật thành công!', 'Bạn đã cập nhật ảnh đại diện thành công.');
        this.newUser.emit(response);
        this.user = response;
        this.hiddenPopupUpdateAvatar();
      },
      error: (error) => {
        this.alertService.showError('Cập nhật thất bại!', error.error.message); 
      }
    })
  }

  handleUpdateInfo():void{
    if (this.updateInfoForm.invalid) {
      this.focusFirstInvalidControl(this.updateInfoForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; 
    }
    else{
      const {username, address, phoneNumber} = this.updateInfoForm.value;
      const data = {username, address, phoneNumber}
      this.userService.updateInfoUser(data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Cập nhật thành công!', 'Bạn đã cập nhật thông tin thành công.');
          this.newUser.emit(response);
          this.user = response;
          this.hiddenPopupUpdateInfo();
        },
        error: (error) => {
          this.alertService.showError('Cập nhật thất bại!', error.error.message); 
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
}
