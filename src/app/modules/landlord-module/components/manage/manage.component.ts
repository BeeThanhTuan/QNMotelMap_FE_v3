import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Landlord } from 'src/app/interfaces/landlord';
import { AuthService } from 'src/app/services/auth.service';
import { LandlordService } from 'src/app/services/landlord.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
  isShowPopupUpdateProfile = false
  landlord: Landlord;
  showHeader = true;
  constructor(private titleService:Title, private authService: AuthService, private landlordService: LandlordService, private router: Router){
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
      IsDelete: false,
    };
  }
  

  ngOnInit(): void {
    this.titleService.setTitle('QNMoteMap | Chủ trọ ');

    this.getInfoLandlord();
    // Lắng nghe sự kiện NavigationEnd khi có thay đổi router
    this.handleHiddenElement(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleHiddenElement(event.urlAfterRedirects); // Kiểm tra lại URL sau điều hướng
      }
    });
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

  handleHiddenElement(url: string){
    if (url.includes('/motels')) {
      this.showHeader = true;  
    }
    else{
      this.showHeader = false;
    }
  }
  
}
