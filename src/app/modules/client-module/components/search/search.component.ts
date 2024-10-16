import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { chartOptions } from '../../config-charts/chart-bar-options';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MotelFiltered} from 'src/app/interfaces/motelFiltered';
import { MotelService } from 'src/app/services/motel.service';
import { Motel } from 'src/app/interfaces/motel';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NzMarks } from 'ng-zorro-antd/slider';



interface FieldSearch {
  address: string,
  desiredPrice: number,
  distanceLess1Km: boolean,
  desiredDistance: number,
  noLiveWithLandlord:	boolean,
  haveMezzanine: boolean,
  haveToilet:	boolean,
  haveAirConditioner: boolean,
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  isLoading = false;
  chartOptions: any;
  formFilters!: FormGroup;

  //chart properties 
  chartOptionsPrice: any;
  rentalPrices:number[]= [];
  rentalDataPrice: { price: number; count: number }[] = [];
  chartOptionsDistance: any;
  rentalDistances:number[]= [];
  rentalDataDistance: { distance: number; count: number }[] = [];

  listMotels: Motel[]= [];
  indexMotel!: number;
  //form filter
  listMotelFiltered: MotelFiltered = {
    motelsWithoutLandlord: [],
    motelsWithin1km: [],
    convenientCounts: {}
  };

  desiredPriceChanged: boolean = false;
  desiredDistanceChanged: boolean = false;
  //data navigation search
  fieldSearch: FieldSearch ={
    address: '',
    desiredPrice: 5000000,
    distanceLess1Km: false,
    desiredDistance: 7,
    noLiveWithLandlord: false,
    haveMezzanine: false,
    haveToilet: false,
    haveAirConditioner: false,
  }

  filters: any;

  marksPrice: NzMarks = {
    500000: {
      style: {
        color: '#535353',
        position: 'relative',
        left: '35px',
        'font-size': '13px'
      },
      label: '<p>500.000 VND</p>'
    },
    5000000: {
      style: {
        color: '#535353',
        position: 'relative',
        left: '55%',
        'font-size': '13px'
      },
      label: '<p>5.000.000 VND</p>'
    },
  };
  marksDistance: NzMarks = {
    0: {
      style: {
        color: '#535353',
        position: 'relative',
        left: '15px',
        'font-size': '13px'
      },
      label: '<p>0 km</p>'
    },
    7: {
      style: {
        color: '#535353',
        position: 'relative',
        left: '86%',
        'font-size': '13px'
      },
      label: '<p>7 km</p>'
    },
  };

  constructor(private titleService: Title, private formBuilder: FormBuilder, private router: Router,
    private route: ActivatedRoute, private motelService: MotelService) {
    this.titleService.setTitle('QNMoteMap | Tìm kiếm ');
    this.initializeForm();
    this.setDataFormLocal();
  }

  ngOnInit(): void { 
    this.setFieldSearchIntoFormFilter();
    this.initializeDataPriceChart();  
    this.initializeDataDistanceChart(); 
  }

  ngAfterViewInit(): void {
    this.handleChangeStyleCheckbox();
    this.formFilters.get('desiredDistance')!.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleFiltersDistance();
    });
    this.formFilters.get('desiredPrice')!.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleFiltersPrice();
    });
  }

  //handle view motels on map
  handleViewOnMap():void {
    this.router.navigate(['/client/home/map'], { 
      queryParams: { 
        filters: JSON.stringify(this.filters),
      }
    });
  }

  //handle view motels on map with specifically motel
  handleViewOnMapSpecificallyMotel(location: string):void {
    this.router.navigate(['/client/home/map'], { 
      queryParams: { 
        filters: JSON.stringify(this.filters),
        location: location,
      }
    });
  }

 setFieldSearchIntoFormFilter(){
    this.route.queryParams.subscribe(params => {
      if(params['filters']){
        let filters = JSON.parse(params['filters']);
        this.fieldSearch = filters;
        this.handleSetFieldForm(); 
        this.handleFilters();
      }
    })
  }
  
  setDataFormLocal() :void {
    let filtersLocal = JSON.parse(localStorage.getItem('filtersLocal')!)
    let addressLocal =  JSON.parse(localStorage.getItem('addressLocal')!)
    if(filtersLocal){
      this.fieldSearch = filtersLocal;
      this.handleSetFieldForm();
    }
    if(addressLocal){
      this.fieldSearch.address = addressLocal ;
    }
    this.handleFilters();
  }

   handleSetFieldForm(): void {
      this.formFilters.patchValue({
        wardCommune: this.fieldSearch.address,
        desiredPrice: this.fieldSearch.desiredPrice,
        distanceLess1Km: this.fieldSearch.distanceLess1Km,
        desiredDistance: this.fieldSearch.desiredDistance,
        noLiveWithLandlord: this.fieldSearch.noLiveWithLandlord,
        haveMezzanine: this.fieldSearch.haveMezzanine,
        haveToilet: this.fieldSearch.haveToilet,
        haveAirConditioner: this.fieldSearch.haveAirConditioner     
      }, { emitEvent: false });
  }

  // Setup the chart options with dynamic data
  setupChartPrice(categories: number[], counts: number[]): void {
    this.chartOptionsPrice = chartOptions(['#039445']);
    this.chartOptionsPrice.series[0].data = counts;
    this.chartOptionsPrice.xaxis.categories = categories;
  }

  // Setup the chart options with dynamic data
  setupChartDistance(categories: number[], counts: number[]): void {
    this.chartOptionsDistance = chartOptions(['#039445']);
    this.chartOptionsDistance.series[0].data = counts;
    this.chartOptionsDistance.xaxis.categories = categories;
  }

  // Initialize data for the chart and rental information
  initializeDataPriceChart(): void {
    this.rentalDataPrice = this.getHouseCountByPrice(this.rentalPrices);
    if (!this.rentalDataPrice) {
      return;
    }
    const { categories, counts } = this.getChartCategoriesAndCountsByPrice(this.rentalDataPrice);
     // Kiểm tra categories và counts trước khi gọi setupChart
    if (categories && counts) {
      this.setupChartPrice(categories, counts);
    } else {
      console.error("categories or counts are undefined.");
    }
  }

  // Initialize data for the chart and rental information
  initializeDataDistanceChart(): void {
    this.rentalDataDistance = this.getHouseCountByDistance(this.rentalDistances);
    if (!this.rentalDataDistance) {
      return;
    }
    const { categories, counts } = this.getChartCategoriesAndCountsByDistance(this.rentalDataDistance);
     // Kiểm tra categories và counts trước khi gọi setupChart
    if (categories && counts) {
      this.setupChartDistance(categories, counts);
    } else {
      console.error("categories or counts are undefined.");
    }
  }
  
  // Initialize form filters
  initializeForm(): void {
    this.formFilters = this.formBuilder.group({
      motelHasRoomAvailable: [false],
      noLiveWithLandlord: [false],
      distanceLess1Km: [false],
      desiredPrice: [5000000],
      desiredDistance: [7.0],
      haveMezzanine: [false],
      haveToilet: [false],
      havePlaceToCook: [false],
      haveAirConditioner: [false],
    });
  }

  // Hàm để lọc dữ liệu từ listMotel
  filterMotelData(listMotel: any) {
   return listMotel.map((motel :any)=> ({
     _id: motel._id,
     Locations: motel.Location,
     Price: motel.Price
   }));
 }

  getFilters() :void{
    this.filters = {
      addressSearch: this.fieldSearch.address,
      motelHasRoomAvailable: this.formFilters.get('motelHasRoomAvailable')!.value,
      noLiveWithLandlord: this.formFilters.get('noLiveWithLandlord')!.value,
      distanceLess1Km: this.formFilters.get('distanceLess1Km')!.value,
      desiredDistance: this.formFilters.get('desiredDistance')!.value,
      desiredPrice: this.formFilters.get('desiredPrice')!.value,
      haveMezzanine: this.formFilters.get('haveMezzanine')!.value,
      haveToilet: this.formFilters.get('haveToilet')!.value,
      havePlaceToCook: this.formFilters.get('havePlaceToCook')!.value,
      haveAirConditioner: this.formFilters.get('haveAirConditioner')!.value,
    }
  }

  setDataIntoLocalStorage():void{
    localStorage.setItem('filtersLocal', JSON.stringify(this.formFilters.value));  
    localStorage.setItem('addressLocal', JSON.stringify(this.fieldSearch.address ? this.fieldSearch.address : ' '));  
  }

  // Handle the form filter values
  handleFilters(): void {
    this.isLoading = true;
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.listMotels = response.data;
      this.rentalDistances= [];
      response.data.map((motel: any)=>{
        this.rentalDistances.push(motel.Distance);
      })
      this.initializeDataDistanceChart();
      this.rentalPrices= [];
      response.data.map((motel: any)=>{
        this.rentalPrices.push(motel.Price);
      })
      this.initializeDataPriceChart();
      this.listMotelFiltered = response.dataFiltered;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }); 
    this.setDataIntoLocalStorage();
  }

   // Handle the form filter values
   handleFiltersDistance() :void {
    this.isLoading = true;
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.listMotels = response.data;    
      this.rentalPrices= [];
      response.data.map((motel: any)=>{
        this.rentalPrices.push(motel.Price);
      })
      this.initializeDataPriceChart();
      this.listMotelFiltered = response.dataFiltered;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    });
    this.setDataIntoLocalStorage();

  }

  // Handle the form filter values
  handleFiltersPrice() :void {
    this.isLoading = true;
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.listMotels = response.data;    
      this.rentalDistances= [];
      response.data.map((motel: any)=>{
        this.rentalDistances.push(motel.Distance);
      })
      this.initializeDataDistanceChart();
      this.listMotelFiltered = response.dataFiltered;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
      this.setDataIntoLocalStorage();
    });
  }



  //kiểm tra giá tiền mong muốn đã thay đổi chưa
  onChangeDesiredPrice():void {
    this.desiredPriceChanged = true;
    if(this.formFilters.get('desiredPrice')!.value === 5000000){
      this.desiredPriceChanged = false;
    }
  }

  //kiểm tra giá tiền mong muốn đã thay đổi chưa
  onChangeDesiredDistance():void {
    this.desiredDistanceChanged = true;
    if(this.formFilters.get('desiredDistance')!.value === 7.0){
      this.desiredDistanceChanged = false;
    }
  }

  //Đặt lại giá tiền mong muốn
  handleResetDesiredPrice():void {
    this.formFilters.get('desiredPrice')?.setValue(5000000);
    this.desiredPriceChanged = false;
    this.handleFilters();
  }

  //Đặt lại giá tiền mong muốn
  handleResetDesiredDistance():void {
    this.formFilters.get('desiredDistance')?.setValue(7.0);
    this.desiredDistanceChanged = false;
    this.handleFilters();
  }


  // Get the house count by price for the chart
  getHouseCountByPrice(prices: number[]): { price: number; count: number }[] {
    const priceBuckets: { [key: number]: number } = {};
    for (let price = 500000; price <= 5000000; price += 100000) {
      priceBuckets[price] = 0;
    }
    prices.forEach((price) => {
      const bucket = this.getBucket(price);
      if (bucket) {
        priceBuckets[bucket] += 1;
      }
    });
    return Object.keys(priceBuckets).map((bucket) => ({
      price: parseInt(bucket),
      count: priceBuckets[parseInt(bucket)],
    }));
  }

  // Get the price bucket for a given price
  getBucket(price: number): number | null {
    if (price < 500000 || price > 5000000) return null;
    return Math.floor((price - 500000) / 100000) * 100000 + 500000;
  }

  // Get chart categories and counts based on the rental data
  getChartCategoriesAndCountsByPrice(rentalData: { price: number; count: number }[]): { categories: number[], counts: number[] } {
    const categories = Array.from({ length: 46 }, (_, i) => 500000 + i * 100000);
    const counts = categories.map((cat) => rentalData.find((item) => item.price === cat)?.count || 0);
    return { categories, counts };
  }

  // Get the house count by distance for the chart
  getHouseCountByDistance(distances: number[]): { distance: number; count: number }[] {
    const distanceBuckets: { [key: number]: number } = {};
    for (let distance = 0.0; distance <= 7.0; distance = parseFloat((distance + 0.1).toFixed(1))) {
      distanceBuckets[distance] = 0;
    }
    distances.forEach((distance) => {
      const bucket = this.getDistanceBucket(distance);
      if (bucket !== null) {
        distanceBuckets[bucket] += 1;
      }
    });
    return Object.keys(distanceBuckets).map((bucket) => ({
      distance: parseFloat(bucket),
      count: distanceBuckets[parseFloat(bucket)],
    }));
  }

  // Get the distance bucket for a given distance
  getDistanceBucket(distance: number): number | null {
    if (distance < 0 || distance > 7.0) return null;
    return parseFloat((Math.floor((distance - 0.0) / 0.1) * 0.1 + 0.0).toFixed(1));
  }

  // Get chart categories and counts based on the rental data (for distances)
  getChartCategoriesAndCountsByDistance(rentalData: { distance: number; count: number }[]): { categories: number[], counts: number[] } {
    const categories = Array.from({ length: 71 }, (_, i) => parseFloat((0.0 + i * 0.1).toFixed(1)));
    const counts = categories.map((cat) => rentalData.find((item) => item.distance === cat)?.count || 0);
    return { categories, counts };
  }

  //handle change style price label marker
  handleChangeStyleCheckbox() :void {
    const checkboxs = document.querySelectorAll('.ant-checkbox-inner'); 
    checkboxs .forEach(checkbox => {
      (checkbox as HTMLElement).style.width = '20px';
      (checkbox as HTMLElement).style.height = '20px';
      (checkbox as HTMLElement).style.borderRadius = '3px';
      (checkbox as HTMLElement).style.borderColor = '#999999';
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    this.setDataIntoLocalStorage();
    $event.returnValue = ''; // Để hiển thị hộp thoại xác nhận
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Ngăn chặn phím F5
    if (event.key === 'F5') {
      this.setDataIntoLocalStorage();
    }
    // Ngăn chặn Ctrl + R
    if (event.ctrlKey && event.key === 'r') {
      this.setDataIntoLocalStorage();
    }
  }

}
