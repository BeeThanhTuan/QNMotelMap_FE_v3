import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { listWardCommune } from '../../../../other-data/list-ward-commune';
import { Convenient } from 'src/app/interfaces/convenient';
import { ConvenientService } from 'src/app/services/convenient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { MotelService } from 'src/app/services/motel.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { checkAmountValidator } from '../../validator-custom/checkAmountValidator';
import { RoomType } from 'src/app/interfaces/roomType';
import { RoomTypeService } from 'src/app/services/roomType.service';
import { Images } from 'src/app/interfaces/images';
@Component({
  selector: 'app-popup-update-room-type',
  templateUrl: './popup-update-room-type.component.html',
  styleUrls: ['./popup-update-room-type.component.css']
})
export class PopupUpdateRoomTypeComponent {
  listImages: File[] = [];
  imageUrls: string[] = [];
  listOldImages: Images[] = [];
  listOldImagesRemove: string[] = []
  listWardCommune = listWardCommune;
  updateRoomTypeForm!: FormGroup;
  checkConvenient: { label: string; value: string; checked: boolean }[] = [];
  firstInvalidControl: string | null = null;
  user!: User;
  @Input() motelID!: string;
  @Input() roomType!: RoomType;

  @Output() newRoomType = new EventEmitter<RoomType>();

  constructor(
    private convenientService: ConvenientService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService,
    private roomTypeService: RoomTypeService,
  ) {
    this.initializeForm();
    this.getAllConvenient();
  }

  ngOnChanges(changes: SimpleChanges): void {
   setTimeout(() => {
    if(changes['motelID'] || changes['roomType']){
        this.setInfoIntoForm(this.roomType);
     }
   }, 10);
  }

  ngOnInit(): void {
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
    this.updateRoomTypeForm = this.formBuilder.group({
      price: [null, [Validators.required, Validators.min(500000)] ],
      area: [null, [Validators.required, Validators.min(6), Validators.max(99)]],
      amount: [null, [Validators.required, Validators.max(99)]],
      available: [null, [Validators.required ,Validators.max(99), checkAmountValidator]],
      description: ['', [Validators.required]],
      listConvenient: [[]],
    });
  }

  setInfoIntoForm(roomType: RoomType){
    this.updateRoomTypeForm.patchValue({
      price: roomType.Price,
      area: roomType.Area,
      amount: roomType.Amount,
      available: roomType.Available,
      description: roomType.Description,
    },{ emitEvent: false }
    );

    this.listOldImages = [...roomType.ListImages]

    // Chuyển đổi danh sách từ motel thành đối tượng cần thiết
    const checkedConvenient = (roomType?.ListConvenient || []).map((convenient) => ({
      label: convenient.NameConvenient,
      value: convenient._id,
      checked: true, // Đánh dấu là đã chọn
    }));

    // Khởi tạo danh sách checkConvenient nếu chưa có
    const checkConvenient = this.checkConvenient || [];

    // Tạo Map để hợp nhất danh sách (loại bỏ trùng lặp dựa trên value)
    const convenientMap = new Map<string, { label: string; value: string; checked: boolean }>(
      [...checkConvenient, ...checkedConvenient].map((convenient) => [convenient.value, convenient])
    );

    // Cập nhật lại this.checkConvenient với danh sách hợp nhất
    this.checkConvenient = Array.from(convenientMap.values());

    // Lọc danh sách các tiện nghi đã chọn (checked === true)
    const selectedConvenient = this.checkConvenient
      .filter((convenient) => convenient.checked)
      .map((convenient) => convenient.value);
   
    // Cập nhật giá trị vào form
    this.updateRoomTypeForm.patchValue({
      listConvenient: selectedConvenient, // Đảm bảo không lặp mảng
    });
  }

  get priceControl() {
    return this.updateRoomTypeForm.get('price');
  }
  
  get areaControl() {
    return this.updateRoomTypeForm.get('area');
  }
  
  get amountControl() {
    return this.updateRoomTypeForm.get('amount');
  }
  
  get availableControl() {
    return this.updateRoomTypeForm.get('available');
  }
  
  get descriptionControl() {
    return this.updateRoomTypeForm.get('description');
  }
  
  get listConvenientControl() {
    return this.updateRoomTypeForm.get('listConvenient');
  }

  getAllConvenient(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.convenientService.getAllConvenient().subscribe(
        (response: Convenient[]) => {
          this.checkConvenient = response.map((convenient) => ({
            label: convenient.NameConvenient,
            value: convenient._id,
            checked: false,
          }));
          resolve(); // Khi thành công
        },
        (error) => {
          console.error('Error fetching conveniences:', error);
          reject(error); // Khi lỗi
        }
      );
    });
  }

  handleUpdateRoomType(): void {
    let checkConvenient = this.checkConvenient
      .filter((convenient) => convenient.checked === true)
      .map((convenient) => convenient.value);
    this.updateRoomTypeForm.patchValue({
      listConvenient: [...checkConvenient],
    });
    if (this.updateRoomTypeForm.invalid || (this.listImages.length + this.listOldImages.length) === 0) {
      this.focusFirstInvalidControl(this.updateRoomTypeForm);
      return;
    } else {
      const data = new FormData();
      const formValues = this.updateRoomTypeForm.value;
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
      data.append('listOldImagesRemove', JSON.stringify(this.listOldImagesRemove));
      data.append('userID', this.user._id);
      data.append('motelID', this.motelID);
 
      this.roomTypeService.updateInfoRoomType(this.roomType._id, data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Cập nhật thành công!', 'Bạn đã cập nhật thành công loại phòng.');
          this.newRoomType.emit(response);
          this.hiddenPopupUpdateMotel(); 
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

  hiddenPopupUpdateMotel() {
    const popupUpdateRoomType = document.getElementById(
      'popupUpdateRoomType'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'auto';
    if (popupUpdateRoomType && popupUpdateRoomType.classList.contains('flex')) {
      popupUpdateRoomType.classList.remove('flex');
      popupUpdateRoomType.classList.add('hidden');
    }
    this.updateRoomTypeForm.reset();
    this.listImages = [];
    this.imageUrls = [];
    this.listOldImages = [...this.roomType.ListImages];
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
  removeImageNew(imageUrl: string): void {
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

  removeImageOld(index: number, id: string): void{
    this.listOldImages.splice(index, 1)
    this.listOldImagesRemove.push(id);
  }
}
