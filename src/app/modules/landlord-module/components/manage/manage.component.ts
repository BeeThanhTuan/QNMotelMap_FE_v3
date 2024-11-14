import { Component } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
  isShowPopupAddMotel = false;
  isShowPopupUpdateProfile = false

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
