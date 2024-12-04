import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { listWardCommune } from '../../../../other-data/list-ward-commune';
import { Convenient } from 'src/app/interfaces/convenient';
import { ConvenientService } from 'src/app/services/convenient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Landlord } from 'src/app/interfaces/landlord';
import { MotelService } from 'src/app/services/motel.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Motel } from 'src/app/interfaces/motel';
import { checkAmountValidator } from '../../validator-custom/checkAmountValidator';
@Component({
  selector: 'app-popup-add-room-type',
  templateUrl: './popup-add-room-type.component.html',
  styleUrls: ['./popup-add-room-type.component.css']
})
export class PopupAddRoomTypeComponent {
  listImages: File[] = [];
  imageUrls: string[] = [];
  listWardCommune = listWardCommune;
  addRoomTypeForm!: FormGroup;
  checkConvenient: { label: string; value: string; checked: boolean }[] = [];
  firstInvalidControl: string | null = null;
  user!: User;
  @Output() newMotel = new EventEmitter<Motel>();

  //map properties
  map!: L.Map;
  constructor(
    private convenientService: ConvenientService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private motelService: MotelService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.initializeForm();
  }


  ngOnInit(): void {
    this.getAllConvenient();
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

  initializeForm(): void {
    this.addRoomTypeForm = this.formBuilder.group({
      price: [null, [Validators.required, Validators.min(500000)] ],
      area: [null, [Validators.required, Validators.min(6), Validators.max(99)]],
      amount: [null, [Validators.required, Validators.max(99)]],
      available: [null, [Validators.required ,Validators.max(99), checkAmountValidator]],
      description: ['', [Validators.required]],
      listConvenient: [[]],
    });
  }

  get priceControl() {
    return this.addRoomTypeForm.get('price');
  }
  
  get areaControl() {
    return this.addRoomTypeForm.get('area');
  }
  
  get amountControl() {
    return this.addRoomTypeForm.get('amount');
  }
  
  get availableControl() {
    return this.addRoomTypeForm.get('available');
  }
  
  get descriptionControl() {
    return this.addRoomTypeForm.get('description');
  }
  
  get listConvenientControl() {
    return this.addRoomTypeForm.get('listConvenient');
  }

  getAllConvenient(): void {
    this.convenientService
      .getAllConvenient()
      .subscribe((response: Convenient[]) => {
        this.checkConvenient = response.map((convenient) => ({
          label: convenient.NameConvenient,
          value: convenient._id,
          checked: false,
        }));
      });
  }

  handleAddMotel(): void {
    let checkConvenient = this.checkConvenient
      .filter((convenient) => convenient.checked === true)
      .map((convenient) => convenient.value);
    this.addRoomTypeForm.patchValue({
      listConvenient: [...checkConvenient],
    });
    if (this.addRoomTypeForm.invalid || this.listImages.length === 0) {
      this.focusFirstInvalidControl(this.addRoomTypeForm);
      return;
    } else {
      const data = new FormData();
      const formValues = this.addRoomTypeForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          const value = formValues[key];
          data.append(key, Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value) : value?.toString());
        }
      }
      // Thêm các giá trị ngoài form
      for (let file of this.listImages) {
        data.append('listImages', file);
      }
      data.append('userID', this.user._id);

      this.motelService.addNewMotel(data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Thêm mới thành công!', 'Bạn đã thêm thành công nhà trọ mới');
          this.newMotel.emit(response);
          this.hiddenPopupAddMotel();
        },
        error: (error) => {
          this.alertService.showError('Thêm mới thất bại!', error.error.message); 
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

  hiddenPopupAddMotel() {
    const popupAddRoomType = document.getElementById(
      'popupAddRoomType'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'auto';
    if (popupAddRoomType && popupAddRoomType.classList.contains('flex')) {
      popupAddRoomType.classList.remove('flex');
      popupAddRoomType.classList.add('hidden');
    }
    this.addRoomTypeForm.reset();
    this.listImages = [];
    this.imageUrls = [];
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const filesArray = Array.from(files); // Chuyển FileList thành mảng
    // Kiểm tra nếu số lượng ảnh đã chọn vượt quá 8
    if (this.listImages.length + filesArray.length > 8) {
      this.alertService.showWarning('Cảnh báo!', 'Ảnh bạn chọn quá 8 ảnh!');
      return;
    }
    // Thêm ảnh vào danh sách
    this.listImages = [...this.listImages, ...filesArray];
    // Tạo URL cho mỗi ảnh và đảm bảo rằng ngữ cảnh thay đổi sẽ được phát hiện
    this.imageUrls = this.listImages.map((file) => URL.createObjectURL(file));
    // Đảm bảo Angular kiểm tra lại view
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  // Hàm xóa ảnh
  removeImage(imageUrl: string): void {
    // Tìm và xóa URL trong imageUrls
    const index = this.imageUrls.indexOf(imageUrl);
    if (index !== -1) {
      // Giải phóng blob URL nếu tồn tại
      URL.revokeObjectURL(this.imageUrls[index]);
      // Xóa ảnh trong mảng imageUrls
      this.imageUrls.splice(index, 1);
      // Cập nhật lại danh sách ảnh trong listImages nếu cần
      this.listImages = this.listImages.filter((_, i) => i !== index);
    }
  }
}
