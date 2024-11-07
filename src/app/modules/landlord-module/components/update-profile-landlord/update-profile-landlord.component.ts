import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-profile-landlord',
  templateUrl: './update-profile-landlord.component.html',
  styleUrls: ['./update-profile-landlord.component.css']
})
export class UpdateProfileLandlordComponent {
  updateProfileLandlordForm!: FormGroup
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private formBuilder: FormBuilder){
    this.initializeForm();
  }
  initializeForm(): void {
    this.updateProfileLandlordForm = this.formBuilder.group({
      nameLandlord: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber:  ['', [Validators.required]],
    });
  }
  
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
