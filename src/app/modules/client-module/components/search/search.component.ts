import { Component, HostListener } from '@angular/core';
import { chartOptions } from '../../config-charts/chart-bar-options';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MotelFiltered} from 'src/app/interfaces/motelFiltered';
import { MotelService } from 'src/app/services/motel.service';
import { Motel } from 'src/app/interfaces/motel';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NzMarks } from 'ng-zorro-antd/slider';
import { FavoriteMotelsService } from 'src/app/services/favorite-motels.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  initialFormValues: any = {};
  //chart properties 
  chartOptionsPrice: any;
  rentalPrices:number[]= [];
  rentalDataPrice: { price: number; count: number }[] = [];
  chartOptionsDistance: any;
  rentalDistances:number[]= [];
  rentalDataDistance: { distance: number; count: number }[] = [];

  listMotels: Motel[]= [];
  originalMotels: Motel[] = []
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

  selectedSortLabel = 'Mặc định';
  selectedSort = 'default';

  listFavoriteMotels:Motel [] = [];

  constructor(private titleService: Title, private formBuilder: FormBuilder, private router: Router,
    private route: ActivatedRoute, private motelService: MotelService,
    private favoriteMotelsService: FavoriteMotelsService, private message: NzMessageService) {
    this.titleService.setTitle('QNMoteMap | Tìm kiếm ');
    this.initializeForm();
    this.setDataFormLocal();
  }

  ngOnInit(): void { 
    this.setFieldSearchIntoFormFilter();
    this.initializeDataPriceChart();  
    this.initializeDataDistanceChart(); 
    this.getFavoriteMotels();
  }

  ngAfterViewInit(): void {
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
      if(params['wardCommune']){
        const wardCommune = params['wardCommune'].replace(/"/g, '');
        this.fieldSearch.address = wardCommune;
        this.handleFilters();
        return
      }
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

    this.initialFormValues = { ...this.formFilters.value };
  }

  //check value from has change
  hasFormChanged(): boolean {
    return JSON.stringify(this.initialFormValues) !== JSON.stringify(this.formFilters.value);
  }

  //reset form
  resetForm(): void {
    this.formFilters.reset({
      motelHasRoomAvailable: false,
      noLiveWithLandlord: false,
      distanceLess1Km: false,
      desiredPrice: 5000000, // Giá trị mặc định bạn muốn
      desiredDistance: 7.0,  // Giá trị mặc định bạn muốn
      haveMezzanine: false,
      haveToilet: false,
      havePlaceToCook: false,
      haveAirConditioner: false,
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
      this.originalMotels = response.data;
      this.handleSort(this.selectedSort);
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
      }, 400);
      this.updateURL(this.formFilters.value);
    });
    this.setDataIntoLocalStorage();

  }

   // Handle the form filter values
   handleFiltersDistance() :void {
    this.isLoading = true;
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.listMotels = response.data;    
      this.originalMotels = response.data;
      this.handleSort(this.selectedSort);
      this.rentalPrices= [];
      response.data.map((motel: any)=>{
        this.rentalPrices.push(motel.Price);
      })
      this.initializeDataPriceChart();
      this.listMotelFiltered = response.dataFiltered;
      setTimeout(() => {
        this.isLoading = false;
      }, 400);
      this.updateURL(this.formFilters.value);
    });
    this.setDataIntoLocalStorage();

  }

  // Handle the form filter values
  handleFiltersPrice() :void {
    this.isLoading = true;
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.listMotels = response.data;    
      this.originalMotels = response.data;
      this.handleSort(this.selectedSort);
      this.rentalDistances= [];
      response.data.map((motel: any)=>{
        this.rentalDistances.push(motel.Distance);
      })
      this.initializeDataDistanceChart();
      this.listMotelFiltered = response.dataFiltered;
      setTimeout(() => {
        this.isLoading = false;
      }, 400);
      this.setDataIntoLocalStorage();
      this.updateURL(this.formFilters.value);
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

  removeFilterAddress(): void{
    this.fieldSearch.address = '';
    this.handleFilters();
  }

  handleSort(sortValue: string): void {
    this.selectedSort = sortValue;
    const sortLabels: { [key: string]: string } = {
      'default': 'Mặc định',
      'price-lowest': 'Giá (ưu tiên thấp nhất)',
      'distance-closest': 'Khoảng cách tới trường (ưu tiên gần nhất)',
      'rating-highest': 'Xếp hạng (ưu tiên cao nhất)'
    };
  
    this.selectedSortLabel = sortLabels[this.selectedSort] || '';
    this.performSort(sortValue);
  }
  

  performSort(sortOption: string) {
    switch (sortOption) {
      case 'price-lowest':
        this.listMotels = [...this.listMotels].sort((a: Motel, b: Motel) => (a.Price ?? 0) - (b.Price ?? 0));
        break;
      case 'distance-closest':
        this.listMotels = [...this.listMotels].sort((a: Motel, b: Motel) => (a.Distance ?? 0) - (b.Distance ?? 0));
        break;
      case 'rating-highest':
        this.listMotels = [...this.listMotels].sort((a: Motel, b: Motel) => (b.TotalRating ?? 0) - (a.TotalRating ?? 0));
        break;
      case 'default':
        this.listMotels = [...this.originalMotels]; 
        break;
      default:
      
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
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


  handleHiddenFormFilter(){
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow ='auto'
    const filtersArea = document.getElementById('filtersArea') as HTMLElement;
    if(!filtersArea.classList.contains('max-w-[300px]')){
      filtersArea.classList.add('max-w-[300px]')
    }
    if(!filtersArea.classList.contains('w-[100vw]')){
      filtersArea.classList.remove('w-[100vw]')
    }
    if(filtersArea.classList.contains('flex')){
      filtersArea.classList.remove('flex')
      filtersArea.classList.add('hidden')
    }
  }

  handleShowFormFilter(){
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow ='hidden'
    const filtersArea = document.getElementById('filtersArea') as HTMLElement;
    if(filtersArea.classList.contains('max-w-[300px]')){
      filtersArea.classList.remove('max-w-[300px]')
    }
    filtersArea.classList.add('w-[100vw]')
    if(filtersArea.classList.contains('hidden')){
      filtersArea.classList.remove('hidden')
      filtersArea.classList.add('flex')
    }
    this.initializeDataPriceChart();
    this.initializeDataDistanceChart();
  }

  handleHiddenSort(){
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow ='auto'
    const sortArea = document.getElementById('sortArea') as HTMLElement;
    if(sortArea.classList.contains('flex')){
      sortArea.classList.remove('flex')
      sortArea.classList.add('hidden')
    }
  }

  handleShowSort(){
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow ='hidden'
    const sortArea = document.getElementById('sortArea') as HTMLElement;
    if(sortArea.classList.contains('hidden')){
      sortArea.classList.remove('hidden')
      sortArea.classList.add('flex')
    }
  }

  updateURL(newFilters: any) {
    // Làm sạch đối tượng filters, loại bỏ các giá trị undefined và null
    const sanitizedFilters = Object.fromEntries(
      Object.entries(newFilters)
        .filter(([key, value]) => value !== undefined && value !== null ) // Chỉ giữ lại các thuộc tính trong allowedFilters
    );

    // Đặt 'address' ở đầu đối tượng, thay thế 'addressSearch' bằng 'address'
    sanitizedFilters['address'] = this.fieldSearch.address

    // Đảm bảo address luôn đứng đầu đối tượng
    const sortedFilters = { address: sanitizedFilters['address'], ...sanitizedFilters };
    
    // Chuyển đối tượng thành JSON, mã hóa và giải mã URL
    const jsonFilters = JSON.stringify(sortedFilters);
    const encodedFilters = encodeURIComponent(jsonFilters);
    const decodedFilters = decodeURIComponent(encodedFilters);

    // Điều hướng với các tham số query, giữ nguyên các tham số còn lại
    this.router.navigate([], {
      queryParams: { filters: decodedFilters },
     
    });
  }

  showMessage(type: string, message: string): void {
    this.message.create(type, message,{nzDuration: 3000});
  }


  isFavorited(motelId: string): boolean {
    return this.listFavoriteMotels.some((motel) => motel._id === motelId);
  }

  getFavoriteMotels():void{
    this.favoriteMotelsService.getFavoriteMotels().subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels;
      },
    })
  }

  addMotelIntoFavorites(id: string){
    this.favoriteMotelsService.addMotelIntoFavorites(id).subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels
        this.showMessage('success', 'Thêm nhà trọ vào danh sách yêu thích thành công.')
      },
      error: (error) => {
        this.showMessage('error', error.error.message)
      }
    })
  }

  removeMotelFromFavorites(id: string) {
    this.favoriteMotelsService.removeMotelFormFavorites(id).subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels; // Cập nhật danh sách yêu thích
        this.showMessage('success', 'Xóa nhà trọ khỏi danh sách yêu thích thành công.');
      },
      error: (error) => {
        this.showMessage('error', error.error.message);
      }
    });
  }

}
