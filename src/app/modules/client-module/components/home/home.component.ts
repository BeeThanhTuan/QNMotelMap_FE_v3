import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showDropdownSuggestWardCommune = false;
  showDesiredPricePopup = false;
  desiredPrice! :number;
  valueDesiredPrice: number = 1.3;
  optionsDesiredPrice: Options = {
    floor: 0,
    ceil: 5,
    step: 0.1,
    translate: (value: number): string => {
      return value + ' Triệu'; 
    }
  }
  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('QNMoteMap | Trang chủ ');
  }

  onSliderValueChange(value: number): void {
    this.desiredPrice = value * 1000000; 
  }

}
