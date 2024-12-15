import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Role } from 'src/app/interfaces/role';
import { ConvenientService } from 'src/app/services/convenient.service';
import { Convenient } from 'src/app/interfaces/convenient';

@Component({
  selector: 'app-popup-add-convenient',
  templateUrl: './popup-add-convenient.component.html',
  styleUrls: ['./popup-add-convenient.component.css']
})
export class PopupAddConvenientComponent {
  image!: File | null;
  imageUrl= '';
  listRoles: Role [] = [];
  passwordAddUserVisible = false;
  confirmPasswordAddUserVisible = false;
  addConvenientForm!: FormGroup;

  firstInvalidControl: string | null = null;
  selectedTab: string = 'user'; 
  roleID!: string;

  @Output() newUser = new EventEmitter<Convenient>()
  constructor(private formBuilder: FormBuilder,
    private convenientService: ConvenientService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService) {
    this.initializeFormRegisterUser();
  }

  

  // Initialize form register user
  initializeFormRegisterUser(): void {
    this.addConvenientForm= this.formBuilder.group({
      nameConvenient: ['', [Validators.required]],
    });
  }

  get nameConvenientControl() {
    return this.addConvenientForm.get('nameConvenient');
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


  // add convenient
  handleAddConvenient(): void {
    if (this.addConvenientForm.invalid) {
      this.focusFirstInvalidControl(this.addConvenientForm); 
      return; 
    }
    else{
      const { nameConvenient } = this.addConvenientForm.value;
      const data = new FormData();
      data.append('nameConvenient', nameConvenient);
      
      if (this.image) {
        data.append('image', this.image);
      }
      else{
        this.alertService.showError('Tạo thất bại!', 'Vui lòng chọn 1 ảnh'); 
        return;
      }
      this.convenientService.addNewConvenient(data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Tạo thành công!', 'Bạn đã tạo tiện nghi mới thành công.');
          this.newUser.emit(response);
          this.hiddenPopupAddConvenient();
        },
        error: (error) => {
          this.alertService.showError('Tạo thất bại!', error.error.message); 
        }
      });
    }
  }

  hiddenPopupAddConvenient():void{
    const popupAddConvenient = document.getElementById('popupAddConvenient') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupAddConvenient && popupAddConvenient.classList.contains('flex')){
      popupAddConvenient.classList.remove('flex')
      popupAddConvenient.classList.add('hidden')
    }
    this.addConvenientForm.reset();
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
