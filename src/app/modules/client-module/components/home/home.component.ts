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
  showOtherChoosePopup = false;
  desiredPrice! :number | null;
  distance = 0;
  valueDesiredPrice: number = 0;
  optionsDesiredPrice: Options = {
    floor: 0,
    ceil: 5,
    step: 0.1,
    translate: (value: number): string => {
      return value + ' Triệu'; 
    }
  }
  isChecked: boolean = false;
  intervalDecreaseDistance:any;
  intervalIncreaseDistance:any;
  constructor(private titleService: Title) { 
    this.titleService.setTitle('QNMoteMap | Trang chủ ');

  }

  ngOnInit(): void {

  }

  onSliderValueChange(value: number): void {
    this.desiredPrice = parseFloat(value.toFixed(1)) * 1000000; 
  }

  // đặt lại giá muốn chọn
  resetToDefaultDesiredPrice(){
    this.desiredPrice = null;
    this.valueDesiredPrice = 0;
  }

  // giảm khoảng cách
  onClickDecreaseDistance(){
    if (this.distance > 0) {
      this.distance = parseFloat((this.distance - 0.1).toFixed(1))
    }
  }

  decreaseDistance(){
    this.intervalDecreaseDistance = setInterval(() => {
      if (this.distance > 0) {
        this.distance = parseFloat((this.distance - 0.1).toFixed(1))
      }
    },100)

  }
  
  stopDecreaseDistance(){
    clearInterval(this.intervalDecreaseDistance);
  }

  // tăng khoảng cách
  onClickIncreaseDistance(){
    if (this.distance < 7) {
      this.distance = parseFloat((this.distance + 0.1).toFixed(1))
    }
  }

  increaseDistance(){
    this.intervalIncreaseDistance = setInterval(() => {
      if (this.distance < 7) {
        this.distance = parseFloat((this.distance + 0.1).toFixed(1))
      }
    },100)
  }

  stopIncreaseDistance(){
    clearInterval(this.intervalIncreaseDistance);
  }



}
