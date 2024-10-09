import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { MotelService } from 'src/app/services/motel.service';
import { NzMarks } from 'ng-zorro-antd/slider';
import { SetFieldSearchFilterService } from 'src/app/services/set-field-search-filter.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showBannerWrapper = true;
  showFormSearch = true;
  showHeader = true;
  showDropdownSuggestWardCommune = false;
  showDesiredPricePopup = false;
  showOtherChoosePopup = false;
  isChecked: boolean = false;
  intervalDecreaseDistance:any;
  intervalIncreaseDistance:any;
  formSearch! : FormGroup;
  listWardCommune = [];
  marks: NzMarks = {
    500000: {
      style: {
        color: 'black',
        position: 'relative',
        left: '35px',
        top: '5px'
      },
      label: '<p>500.000 VND</p>'
    },
    5000000: {
      style: {
        color: 'black',
        position: 'relative',
        left: '65%',
        top: '5px'
      },
      label: '<p>5.000.000 VND</p>'
    },
  };

  constructor(private titleService: Title, private formBuilder: FormBuilder, private router: Router,
     private motelService: MotelService, private setFieldSearch: SetFieldSearchFilterService) { 
    this.titleService.setTitle('QNMoteMap | Trang chủ ');
    this.initializeFormFilters();
  }

  initializeFormFilters():void{
    this.formSearch = this.formBuilder.group({
      wardCommune: [''],
      desiredPrice: [5000000],
      desiredDistance: [7],
      noLiveWithLandlord:[false],
      haveMezzanine: [false],
      haveToilet: [false],
      haveAirConditioner: [false],
    });
  }

  ngOnInit(): void {
    this.handleHiddenElement(this.router.url);
    this.initializeListWardCommune();
    // Lắng nghe sự kiện NavigationEnd khi có thay đổi router
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleHiddenElement(event.urlAfterRedirects); // Kiểm tra lại URL sau điều hướng
      }
    });
  }
  
 //Initialize list ward commune
  initializeListWardCommune(): void{
    this.motelService.getListWardCommune().subscribe((response)=>{
      this.listWardCommune = response
    })
  }

  // đặt lại giá muốn chọn
  resetToDefaultDesiredPrice(){
    this.formSearch.get('desiredPrice')?.setValue(5000000);
  }

  // giảm khoảng cách
  onClickDecreaseDistance(){
    const distance = this.formSearch.get('desiredDistance')?.value;
    if (distance >  0) {
      this.formSearch.get('desiredDistance')?.setValue(parseFloat((distance - 0.1).toFixed(1)));
    }
  }

  decreaseDistance(){
    this.intervalDecreaseDistance = setInterval(() => {
      const distance = this.formSearch.get('desiredDistance')?.value;
      if (distance > 0) {
        this.formSearch.get('desiredDistance')?.setValue(parseFloat((distance - 0.1).toFixed(1)));
      }
    },100)

  }
  
  stopDecreaseDistance(){
    clearInterval(this.intervalDecreaseDistance);
  }

  // tăng khoảng cách
  onClickIncreaseDistance(){
    const distance = this.formSearch.get('desiredDistance')?.value;
    if (distance < 7) {
      this.formSearch.get('desiredDistance')?.setValue(parseFloat((distance + 0.1).toFixed(1)));
    }
  }

  increaseDistance(){
    this.intervalIncreaseDistance = setInterval(() => {
      const distance = this.formSearch.get('desiredDistance')?.value;
      if (distance < 7) {
        this.formSearch.get('desiredDistance')?.setValue(parseFloat((distance + 0.1).toFixed(1)));
      }
    },100)
  }

  stopIncreaseDistance(){
    clearInterval(this.intervalIncreaseDistance);
  }

  // đặt lại các lựa chọn
  resetToDefaultOtherChoose(){
    this.formSearch.get('desiredDistance')?.setValue(7);
    this.formSearch.get('haveMezzanine')?.setValue(false);
    this.formSearch.get('haveToilet')?.setValue(false);
    this.formSearch.get('haveAirConditioner')?.setValue(false);
    this.formSearch.get('noLiveWithLandlord')?.setValue(false);
  }

  //tìm kiếm 
  handleSearch(){
    this.router.navigate(['/client/home/search']);
    this.setFieldSearch.setFieldSearch(this.formSearch.value);
  }

  // ẩn các element không sử dung ở các component khác nhau
  handleHiddenElement(url: string){
    if (url.includes('/map')) {
      this.showHeader= false;  
    }
    if (url.includes('/content')) {
      this.showBannerWrapper = true;
      this.showFormSearch = true; 
      this.showHeader = true; 
    }
    if (url.includes('/search')) {
      this.showBannerWrapper = false;
      this.showFormSearch = true; 
      this.showHeader = true; 
    }
    if (url.includes('/detail-motel')) {
      this.showBannerWrapper = false;
      this.showFormSearch = true; 
      this.showHeader = true; 

    }
  }

  //Handle choose ward commune
  handleChooseWardCommune(event: Event) :void{
    const target = event.currentTarget as HTMLElement;
    const lastChild = target.lastElementChild as HTMLElement;
    this.formSearch.get('wardCommune')!.setValue(lastChild.textContent);
    this.showDropdownSuggestWardCommune = false;
  }


}
