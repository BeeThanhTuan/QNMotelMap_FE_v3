import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Landlord } from 'src/app/interfaces/landlord';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LandlordService } from 'src/app/services/landlord.service';
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
      userName: [this.user.Username, [Validators.required]],
      address: [this.user.Address, [Validators.required]],
      phoneNumber: [this.user.PhoneNumber, [Validators.required]],
    });
  }

  hiddenPopupUpdateProfile() {
    const popupUpdateProfile = document.getElementById(
      'popupUpdateProfile'
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
}
