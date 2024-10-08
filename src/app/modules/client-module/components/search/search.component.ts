import { ChangeDetectorRef, Component } from '@angular/core';
import { chartOptions } from '../../config-charts/chart-bar-options';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { MotelFiltered} from 'src/app/interfaces/motelFiltered';
import { SetFieldSearchFilterService } from 'src/app/services/set-field-search-filter.service';
import { MotelService } from 'src/app/services/motel.service';
import { Motel } from 'src/app/interfaces/motel';
import { debounceTime } from 'rxjs/operators';
import { NzMarks } from 'ng-zorro-antd/slider';


interface FieldSearch {
  wardCommune: string,
  desiredPrice: number,
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
  //form filter
  listMotelFiltered: MotelFiltered = {
    motelsWithoutLandlord: [],
    motelsWithin1km: [],
    convenientCounts: {}
  };

  desiredPriceChanged: boolean = false;
  desiredDistanceChanged: boolean = false;
  //data navigation search
  fieldSearch!: FieldSearch

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
    private setFieldSearch: SetFieldSearchFilterService, private cdr: ChangeDetectorRef,
    private motelService: MotelService) {
    this.titleService.setTitle('QNMoteMap | Tìm kiếm ');
    this.initializeForm();
  }

  ngOnInit(): void {
    // await this.setDataFormLocal();  // Giả sử setDataFormLocal là hàm bất đồng bộ   
    this.setFieldSearch.fieldSearch$.subscribe(data => {
      if (data) {
        this.fieldSearch = data;
        this.handleSetFieldForm();
        this.handleFilters();
      }
    });

    this.initializeDataPriceChart();  
    this.initializeDataDistanceChart(); 
}


  ngAfterViewInit(): void {
    this.handleChangeStyleCheckbox()
    this.formFilters.get('desiredDistance')!.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleFiltersDistance();
    });
    this.formFilters.get('desiredPrice')!.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleFiltersPrice();
    });
  }

  async setDataFormLocal() {
    let listMotelLocal = await JSON.parse(localStorage.getItem('listMotelLocal')!) || []
    let filtersLocal = await JSON.parse(localStorage.getItem('filtersLocal')!)
    let listMotelFiltered = await JSON.parse(localStorage.getItem('listMotelFiltered')!)

    if(listMotelLocal){
      this.listMotels = listMotelLocal;
    }
    if(filtersLocal){
      this.fieldSearch = filtersLocal;
    }
    if(listMotelFiltered){
      this.listMotelFiltered = listMotelFiltered;
    }
    console.log(listMotelLocal);
    console.log(filtersLocal);
    console.log(listMotelFiltered);
    
    
  }

  handleSetFieldForm(): void {
    setTimeout(() => {
      this.formFilters.patchValue({
        wardCommune: this.fieldSearch.wardCommune,
        desiredPrice: this.fieldSearch.desiredPrice,
        desiredDistance: this.fieldSearch.desiredDistance,
        noLiveWithLandlord: this.fieldSearch.noLiveWithLandlord,
        haveMezzanine: this.fieldSearch.haveMezzanine,
        haveToilet: this.fieldSearch.haveToilet,
        haveAirConditioner: this.fieldSearch.haveAirConditioner
      }, { emitEvent: false });
    }, 100);
   
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
      addressSearch: this.fieldSearch.wardCommune,
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
    localStorage.setItem('listMotelLocal', JSON.stringify(this.listMotels)); 
    localStorage.setItem('filtersLocal', JSON.stringify(this.filters));  
    localStorage.setItem('listMotelFiltered', JSON.stringify(this.listMotelFiltered));  
  }

  // Handle the form filter values
  handleFilters() :void {
    this.isLoading = true;
    this.getFilters();
    console.log(this.filters);
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
      this.setDataIntoLocalStorage();
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }); 
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
      this.setDataIntoLocalStorage();
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    });
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
      this.setDataIntoLocalStorage();
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);

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


}
