import { Component } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
  isShowPopupAddMotel = false;
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
}
