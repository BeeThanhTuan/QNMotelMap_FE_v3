import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { MotelService } from 'src/app/services/motel.service';
import { NzMarks } from 'ng-zorro-antd/slider';
import { debounceTime } from 'rxjs';

interface FiltersLocal {
  desiredPrice: number,
  distanceLess1Km: boolean,
  desiredDistance: number,
  noLiveWithLandlord:	boolean,
  haveMezzanine: boolean,
  haveToilet:	boolean,
  haveAirConditioner: boolean,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showBannerWrapper = true;
  showFormSearch = true;
  showHeader = true;
  showDropdownSuggestAddress = false;
  showDesiredPricePopup = false;
  showOtherChoosePopup = false;
  isChecked: boolean = false;
  intervalDecreaseDistance:any;
  intervalIncreaseDistance:any;
  formSearch! : FormGroup;
  listAddress = [];
  listAddressSuggest = [];
  marksPrice: NzMarks = {
    500000: {
      label: '<p>500.000 VND</p>'
    },
    5000000: {
      label: '<p>5.000.000 VND</p>'
    },
  };
  marksDistance: NzMarks = {
    0: {
      label: '<p>0 km</p>'
    },
    7: {
      label: '<p>7 km</p>'
    },
  };

  constructor(private titleService: Title, private formBuilder: FormBuilder, private router: Router,
     private motelService: MotelService) { 
    this.titleService.setTitle('QNMoteMap | Trang chủ ');
    this.initializeFormFilters();
    this.setDataFormLocal();
  }

  initializeFormFilters():void{
    this.formSearch = this.formBuilder.group({
      address: [''],
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
    this.initializeListAddress();
    // Lắng nghe sự kiện NavigationEnd khi có thay đổi router
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleHiddenElement(event.urlAfterRedirects); // Kiểm tra lại URL sau điều hướng
      }
    });
  }
  
  ngAfterViewInit(): void {
    this.formSearch.get('address')!.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleSuggestSearchAddress();
    });
  }
  
 //Initialize list ward commune
  initializeListAddress(): void{
    this.motelService.getListAddress().subscribe((response)=>{
      this.listAddress = response;
      this.listAddressSuggest = response;
    })
  }

  // đặt lại giá muốn chọn
  resetToDefaultDesiredPrice(){
    this.formSearch.get('desiredPrice')?.setValue(5000000);
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
  handleSearch() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/client/home/search'], { 
        queryParams: { 
          filters: JSON.stringify(this.formSearch.value),
        }
      });
    });
  }

  setDataFormLocal() {
    let filtersLocal: FiltersLocal = JSON.parse(localStorage.getItem('filtersLocal')!)
    let addressLocal = JSON.parse(localStorage.getItem('addressLocal')!)
    
    if(addressLocal !== ' ' && addressLocal){
      this.formSearch.get('address')?.setValue(addressLocal);
    }
    this.formSearch.get('desiredPrice')?.setValue(filtersLocal.desiredPrice);
    this.formSearch.get('desiredDistance')?.setValue(filtersLocal.desiredDistance);
    this.formSearch.get('haveMezzanine')?.setValue(filtersLocal.haveMezzanine);
    this.formSearch.get('haveToilet')?.setValue(filtersLocal.haveToilet);
    this.formSearch.get('haveAirConditioner')?.setValue(filtersLocal.haveAirConditioner);
    this.formSearch.get('noLiveWithLandlord')?.setValue(filtersLocal.noLiveWithLandlord);
    
  }

  // ẩn các element không sử dung ở các component khác nhau
  handleHiddenElement(url: string){
    if (url.includes('/map')) {
      this.showHeader= false;  
    }
    if (url.includes('/content') || url.includes('/favorite-motels') ) {
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
  handleChooseAddress(event: Event) :void{
    const target = event.currentTarget as HTMLElement;
    const lastChild = target.lastElementChild as HTMLElement;
    this.formSearch.get('address')!.setValue(lastChild.textContent);
    this.showDropdownSuggestAddress = false;
  }

  // handle bỏ dấu
  removeAccents(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  //handle gợi ý tìm kiếm địa chỉ
  handleSuggestSearchAddress():void{
    let searchInput = this.formSearch.get('address')!.value.trim();
    this.listAddressSuggest = this.listAddress.filter((address: string) => {
      return this.removeAccents(address.toLowerCase()).includes(this.removeAccents(searchInput.toLowerCase()));
    });
  }


  

}
