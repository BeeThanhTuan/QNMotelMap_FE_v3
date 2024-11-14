import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder){
    this.initializeForm();
  }

  initializeForm(): void {
    this.updateInfoLandlordForm = this.formBuilder.group({
      nameLandlord: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber:  ['', [Validators.required]],
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
