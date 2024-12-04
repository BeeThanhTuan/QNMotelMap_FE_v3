import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Landlord } from 'src/app/interfaces/landlord';
import { Motel } from 'src/app/interfaces/motel';
import { AuthService } from 'src/app/services/auth.service';
import { LandlordService } from 'src/app/services/landlord.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-motels',
  templateUrl: './motels.component.html',
  styleUrls: ['./motels.component.css']
})
export class MotelsComponent {
  isShowPopupAddMotel = false;
  isShowPopupUpdateMotel = false;
  landlord: Landlord;
  motel!: Motel;
  index!:number;

  constructor(private authService: AuthService, private landlordService: LandlordService, private router: Router, private routerService: RouterService){
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

  navigateToDetail( id: string): void {
    this.router.navigate(['/landlord/manage/motel-detail', id], { queryParams: { landlordId: this.landlord._id } });
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


  receiveNewMotelFormAddMotel(data: Motel): void {
    this.landlord.ListMotels.push(data)
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  
}
