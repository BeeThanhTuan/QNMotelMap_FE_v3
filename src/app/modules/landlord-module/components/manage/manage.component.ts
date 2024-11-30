import { Component } from '@angular/core';
import { Landlord } from 'src/app/interfaces/landlord';
import { AuthService } from 'src/app/services/auth.service';
import { LandlordService } from 'src/app/services/landlord.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
  isShowPopupAddMotel = false;
  isShowPopupUpdateProfile = false
  landlord: Landlord;

  constructor(private authService: AuthService, private landlordService: LandlordService){
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

  
  showPopupAddMotel(): void {
    this.isShowPopupAddMotel = true
    const popupAddMotel = document.getElementById('popupAddMotel') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupAddMotel && popupAddMotel.classList.contains('hidden')){
      popupAddMotel.classList.remove('hidden')
      popupAddMotel.classList.add('flex')
    }
  }

  showPopupUpdateProfile(): void {
    this.isShowPopupUpdateProfile = true
    const popupUpdateProfileLandlord = document.getElementById('popupUpdateProfileLandlord') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateProfileLandlord && popupUpdateProfileLandlord.classList.contains('hidden')){
      popupUpdateProfileLandlord.classList.remove('hidden')
      popupUpdateProfileLandlord.classList.add('flex')
    }
  }
}
