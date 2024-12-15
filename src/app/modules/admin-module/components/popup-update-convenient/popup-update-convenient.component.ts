import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Role } from 'src/app/interfaces/role';
import { ConvenientService } from 'src/app/services/convenient.service';
import { Convenient } from 'src/app/interfaces/convenient';

@Component({
  selector: 'app-popup-update-convenient',
  templateUrl: './popup-update-convenient.component.html',
  styleUrls: ['./popup-update-convenient.component.css']
})
export class PopupUpdateConvenientComponent {
  image!: File | null;
  imageUrl= '';
  oldImage!:string;
  listRoles: Role [] = [];
  passwordAddUserVisible = false;
  confirmPasswordAddUserVisible = false;
  updateConvenientForm!: FormGroup;

  firstInvalidControl: string | null = null;
  selectedTab: string = 'user'; 
  roleID!: string;
  @Input() convenient !:Convenient
  @Output() newUser = new EventEmitter<Convenient>()
  constructor(private formBuilder: FormBuilder,
    private convenientService: ConvenientService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService) {
    this.initializeFormRegisterUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['convenient']){
     this.setInfoIntoForm(this.convenient)
    }
     
 }

  // Initialize form register user
  initializeFormRegisterUser(): void {
    this.updateConvenientForm= this.formBuilder.group({
      nameConvenient: ['', [Validators.required]],
    });
  }

  get nameConvenientControl() {
    return this.updateConvenientForm.get('nameConvenient');
  }

  setInfoIntoForm(convenient :Convenient){
    this.updateConvenientForm.patchValue({
     nameConvenient: convenient.NameConvenient
    },
    { emitEvent: false }
    );
    this.oldImage = convenient.LinkImage;
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


  // update convient
  handleUpdateConvenient(): void {
    if (this.updateConvenientForm.invalid) {
      this.focusFirstInvalidControl(this.updateConvenientForm); 
      return; 
    }
    else{
      const { nameConvenient } = this.updateConvenientForm.value;
      const data = new FormData();
      data.append('nameConvenient', nameConvenient);
      
      if (this.image) {
        data.append('image', this.image);
      }
      else{
        this.alertService.showError('Cập nhật thất bại!', 'Vui lòng chọn 1 ảnh'); 
        return;
      }
      this.convenientService.updateConvenientByID(data, this.convenient._id).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Cập nhật thành công!', 'Bạn đã cập nhật thông tin tiện nghi thành công.');
          this.newUser.emit(response);
          this.hiddenPopupUpdateConvenient();
        },
        error: (error) => {
          this.alertService.showError('Cập nhật thất bại!', error.error.message); 
        }
      });
    }
  }

  hiddenPopupUpdateConvenient():void{
    const popupUpdateConvenient = document.getElementById('popupUpdateConvenient') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateConvenient && popupUpdateConvenient.classList.contains('flex')){
      popupUpdateConvenient.classList.remove('flex')
      popupUpdateConvenient.classList.add('hidden')
    }
    this.updateConvenientForm.reset();
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

  removeImageOld():void{
    this.oldImage = ''
  }
}
