import { Component } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent {

  showPopupLoginRegister(): void{
    const body = document.querySelector('body') as HTMLElement;
    const loginPopup = document.getElementById('loginPopup') as HTMLElement;
    body.style.overflow = "hidden"
    loginPopup.style.display = "flex";
  }

  
}
