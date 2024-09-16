import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showDropdownSuggestWardCommune = false;
  showDesiredPricePopup = false;
  showOtherChoosePopup = false;
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
  formSearch! : FormGroup;
  constructor(private titleService: Title, private formBuilder: FormBuilder) { 
    this.titleService.setTitle('QNMoteMap | Trang chủ ');
    this.formSearch = this.formBuilder.group({
      wardCommune: [''],
      desiredPrice: [0],
      distance: [0],
      noLiveWithLandlord:[false],
      haveMezzanine: [false],
      haveToilet: [false],
      haveAirConditioner: [false],
    });
  }

  ngOnInit(): void {

  }

  onSliderValueChange(value: number): void {
    this.formSearch.get('desiredPrice')?.setValue(parseFloat(value.toFixed(1)) * 1000000); 
  }

  // đặt lại giá muốn chọn
  resetToDefaultDesiredPrice(){
    this.formSearch.get('desiredPrice')?.setValue(0);
    this.valueDesiredPrice = 0;
  }

  // giảm khoảng cách
  onClickDecreaseDistance(){
    const distance = this.formSearch.get('distance')?.value;
    if (distance >  0) {
      this.formSearch.get('distance')?.setValue(parseFloat((distance - 0.1).toFixed(1)));
    }
  }

  decreaseDistance(){
    this.intervalDecreaseDistance = setInterval(() => {
      const distance = this.formSearch.get('distance')?.value;
      if (distance > 0) {
        this.formSearch.get('distance')?.setValue(parseFloat((distance - 0.1).toFixed(1)));
      }
    },100)

  }
  
  stopDecreaseDistance(){
    clearInterval(this.intervalDecreaseDistance);
  }

  // tăng khoảng cách
  onClickIncreaseDistance(){
    const distance = this.formSearch.get('distance')?.value;
    if (distance < 7) {
      this.formSearch.get('distance')?.setValue(parseFloat((distance + 0.1).toFixed(1)));
    }
  }

  increaseDistance(){
    this.intervalIncreaseDistance = setInterval(() => {
      const distance = this.formSearch.get('distance')?.value;
      if (distance < 7) {
        this.formSearch.get('distance')?.setValue(parseFloat((distance + 0.1).toFixed(1)));
      }
    },100)
  }

  stopIncreaseDistance(){
    clearInterval(this.intervalIncreaseDistance);
  }

  // đặt lại các lựa chọn
  resetToDefaultOtherChoose(){
    this.formSearch.get('distance')?.setValue(0);
    this.formSearch.get('haveMezzanine')?.setValue(false);
    this.formSearch.get('haveToilet')?.setValue(false);
    this.formSearch.get('haveAirConditioner')?.setValue(false);
  }

  //tìm kiếm 
  handleSearch(){
    console.table(this.formSearch.value);
  }






}
