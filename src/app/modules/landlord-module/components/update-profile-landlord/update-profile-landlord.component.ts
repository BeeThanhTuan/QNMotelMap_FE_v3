import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Landlord } from 'src/app/interfaces/landlord';
import { AuthService } from 'src/app/services/auth.service';
import { LandlordService } from 'src/app/services/landlord.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-profile-landlord',
  templateUrl: './update-profile-landlord.component.html',
  styleUrls: ['./update-profile-landlord.component.css']
})
export class UpdateProfileLandlordComponent {
  updateInfoLandlordForm!: FormGroup
  isShowPopupUpdateAvatar = false;
  isShowPopupUpdateInfo = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  landlord: Landlord;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private landlordService: LandlordService){
    this.landlord = {
      _id: '',
      Email: '',
      LandlordName: '',
      Image: '',
      PhoneNumber: '',
      ListMotels: [],
      Address: '',
      CreateAt: '',
      UpdateAt: '',
      UpdateBy:  null,
    };
    this.initializeForm();
  }
  
  ngOnInit(): void {
    this.getInfoLandlord();
  }

  getInfoLandlord() :void{
    const email = this.authService.getEmailFromToken();
    this.landlordService.getLandlordByEmail(email).subscribe({
      next: (response) => {
        this.landlord= response 
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
  }


  initializeForm(): void {
    this.updateInfoLandlordForm = this.formBuilder.group({
      nameLandlord: [this.landlord.LandlordName, [Validators.required]],
      address: [this.landlord.Address, [Validators.required]],
      phoneNumber:  [this.landlord.PhoneNumber, [Validators.required]],
    });
  }

  hiddenPopupUpdateProfileLandlord() {
    const popupUpdateProfileLandlord = document.getElementById(
      'popupUpdateProfileLandlord'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'auto';
    if (popupUpdateProfileLandlord && popupUpdateProfileLandlord.classList.contains('flex')) {
      popupUpdateProfileLandlord.classList.remove('flex');
      popupUpdateProfileLandlord.classList.add('hidden');
    }
    this.updateInfoLandlordForm.reset();
  }
  
  showPopupUpdateAvatar():void{
    this.isShowPopupUpdateAvatar = true;
  }

  hiddenPopupUpdateAvatar():void{
    this.isShowPopupUpdateAvatar = false;
  }

  showPopupUpdateInfo():void{
    this.isShowPopupUpdateInfo = true;
  }

  hiddenPopupUpdateInfo():void{
    this.isShowPopupUpdateInfo = false;
    this.updateInfoLandlordForm.reset();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
