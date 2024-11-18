import { Component } from '@angular/core';
import { chartOptions } from '../../config-charts/chart-bar-options';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
import { MotelService } from 'src/app/services/motel.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MotelFiltered} from 'src/app/interfaces/motelFiltered';
import { debounceTime} from 'rxjs/operators';
import { Motel } from 'src/app/interfaces/motel';
import { Location } from '@angular/common';
import { NzMarks } from 'ng-zorro-antd/slider';
import { ActivatedRoute,  Router } from '@angular/router';


interface Filters {
  addressSearch: string,
  desiredPrice: number,
  distanceLess1Km: boolean,
  desiredDistance: number,
  noLiveWithLandlord:	boolean,
  haveMezzanine: boolean,
  haveToilet:	boolean,
  haveAirConditioner: boolean,
}

interface listMotels{
  _id: string,
  Locations: string,
  Price: number;
}

@Component({
  selector: 'app-view-on-map',
  templateUrl: './view-on-map.component.html',
  styleUrls: ['./view-on-map.component.css'],
})

export class ViewOnMapComponent {
  //popup properties
  showDropdownSuggestWardCommune = false;
  showPopupMotelOnMap = false;
  //chart properties 
  chartOptionsPrice: any;
  rentalPrices:number[]= [];
  rentalDataPrice: { price: number; count: number }[] = [];
  chartOptionsDistance: any;
  rentalDistances:number[]= [];
  rentalDataDistance: { distance: number; count: number }[] = [];
  //map properties 
  map!: L.Map;
  markersArray: L.Marker[] = [];
  selectedMarker: L.Marker | null = null; // Lưu trữ marker được chọn
  selectedPriceMarker: L.Marker | null = null; // Lưu trữ marker giá được chọn
  //data motel
  listMotels: listMotels[] = [];
  //form filter
  listMotelFiltered: MotelFiltered = {
    motelsWithoutLandlord: [],
    motelsWithin1km: [],
    convenientCounts: {}
  };
  idMotel!: string | null;
  //form search
  formFilters!: FormGroup;
  addressSearch = new FormControl()
  desiredPriceChanged: boolean = false;
  desiredDistanceChanged: boolean = false;
  //list ward commune
  listAddress = [];
  listAddressSuggest = []
  //filters
  filters: any

  // navigation
  previousUrl: string | undefined;
  currentUrl: string | undefined;

  //marks slider
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
  
  constructor(private titleService: Title, private formBuilder: FormBuilder, private motelService: MotelService,
    private location: Location,  private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute ) {
    this.titleService.setTitle('QNMoteMap | Tìm kiếm');
    this.initializeForm();
    this.initializeListWardCommune();
  }

  async ngOnInit():  Promise<void> {
    this.initializeDataPriceChart();
    this.initializeDataDistanceChart();
    this.initializeMap();
    this.setDataBeforeNavigation();
  }

  ngAfterViewInit(): void {
    this.formFilters.get('desiredDistance')!.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleFiltersDistance();
    });
    this.formFilters.get('desiredPrice')!.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleFiltersPrice();
    });
    this.addressSearch.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.handleSuggestSearchAddress();
    });
  }

  setDataBeforeNavigation(): void {
    this.route.queryParams.subscribe(params => {
      if(params['locationSpecial']){
        let location = params['locationSpecial'];
        this.initializeDataMotelsWithSpecialMarker(location);
        return 
      }
      if (params['filters']) {
        let filters : Filters = JSON.parse(params['filters']);
        this.setValueFilters(filters);
        let location = params['location'];
        if(location){
          this.handleFiltersWithSpecialMarker(location);
          return
        }
        else{
          this.handleFilters();
        }
      }
      else{
        this.initializeDataMotels();
      }
    });
  }

  setValueFilters(filters : Filters) :void {
    this.addressSearch.setValue(filters.addressSearch && filters.addressSearch !== ' ' ? filters.addressSearch : '')
    this.formFilters.get('noLiveWithLandlord')?.setValue(filters.noLiveWithLandlord);
    this.formFilters.get('distanceLess1Km')?.setValue(filters.distanceLess1Km);
    this.formFilters.get('desiredDistance')?.setValue(filters.desiredDistance);
    this.formFilters.get('desiredPrice')?.setValue(filters.desiredPrice);
    this.formFilters.get('haveMezzanine')?.setValue(filters.haveMezzanine);
    this.formFilters.get('haveToilet')?.setValue(filters.haveToilet);
    this.formFilters.get('haveAirConditioner')?.setValue(filters.haveAirConditioner);
    this.desiredPriceChanged = filters.desiredPrice !== 5000000 ? true : false;
    this.desiredDistanceChanged = filters.desiredDistance !== 7 ? true : false;
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

  // Initialize map
  initializeMap(): void {
    if (this.map) {
      // Nếu bản đồ đã tồn tại, tránh khởi tạo lại
      return;
    }
    this.map = L.map('map').setView([13.7624, 109.21801], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  // Initialize icon marker
  createNormalIcon(): L.Icon {
    return L.icon({
      iconUrl: './assets/images/marker.png', // Icon bình thường
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });
  }
  
  createHoverIcon(): L.Icon {
    return L.icon({
      iconUrl: './assets/images/marker-hover.png', // Icon khi hover
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });
  }

  // Hàm animateMarker với callback
  animateMarker(marker: L.Marker, lat: number, lng: number, duration: number, onComplete: () => void): void {
    const startLat = lat + 0.05; // Vị trí bắt đầu (cao hơn vị trí thật)
    const startTime = performance.now();
    // Bắt đầu với độ trong suốt là 0
    marker.setOpacity(0); 
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Tính phần trăm của animation
      // Tính toán vị trí hiện tại dựa trên tỷ lệ tiến độ
      const currentLat = startLat - (startLat - lat) * progress;
      // Cập nhật vị trí marker
      marker.setLatLng([currentLat, lng]);
      // Tăng độ trong suốt từ 0 lên 1
      marker.setOpacity(progress); // Tăng từ 0 đến 1
      // Nếu chưa hoàn thành animation, tiếp tục
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Gọi callback khi animation hoàn tất
        onComplete();
      }
    };
    // Bắt đầu animation
    requestAnimationFrame(animate);
  }



  //add markers into map 
  addMarkers(markerData: { _id: string; Locations: string; Price: number }[]): void { 
    const normalIcon = this.createNormalIcon();
    const hoverIcon = this.createHoverIcon();
    const normalBg = '#00358f';
    const hoverBg = '#3A8FFE'
  
    markerData.forEach((marker, index) => {
      const [lat, lng] = marker.Locations.split(',').map(location => parseFloat(location.trim()));
      // Tạo marker với icon bình thường
      const leafletMarker = L.marker([lat, lng], { icon: normalIcon }).addTo(this.map);
      leafletMarker.setOpacity(0); // Đặt opacity ban đầu là 0
      // Tạo một div để hiển thị giá (sẽ xuất hiện phía trên marker)
      const priceLabelDiv = L.divIcon({
        html: `<div class="price-label w-fit px-2 py-1 font-bold bg-[#00358f] text-white pointer-events-none rounded-[5px] absolute top-[-40px]">${marker.Price.toLocaleString()} VND</div>`,
        className: 'custom-price-icon',
        iconSize: [110, 30],
        iconAnchor: [45, 27],
      });
      // Tính toán delay cho mỗi marker
      const delay = index * 100; // Thay đổi giá trị 200 để điều chỉnh độ trễ
      // Gọi hàm animateMarker với delay
      setTimeout(() => {
        this.animateMarker(leafletMarker, lat, lng, 300, () => {
        });
      }, delay);
      
      // Tạo một marker cho giá
      const priceMarker = L.marker([lat, lng], { icon: priceLabelDiv }).addTo(this.map);
      priceMarker.setOpacity(0);
      setTimeout(()=>{
        priceMarker.setOpacity(1);
      },markerData.length * 100 + 400)

  
      // Thêm sự kiện hover cho marker
      leafletMarker.on('mouseover', () => {
        if (this.selectedMarker !== leafletMarker) {
          leafletMarker.setIcon(hoverIcon); // Đổi icon khi hover nếu chưa được chọn
          const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
          if (priceLabel) {
            priceLabel.style.backgroundColor = hoverBg; // Thay đổi màu khi hover
          }
        }
      });
  
      leafletMarker.on('mouseout', () => {
        if (this.selectedMarker !== leafletMarker) {
          leafletMarker.setIcon(normalIcon); // Trả về icon bình thường nếu chưa được chọn
          const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
          if (priceLabel) {
            priceLabel.style.backgroundColor = normalBg; // Trả về màu ban đầu
          }
        }
      });
  
      // Thêm sự kiện click để cố định trạng thái hover
      leafletMarker.on('click', (event) => {
        event.originalEvent.stopPropagation();
        if (this.selectedMarker) {
          // Đặt marker được chọn trước đó về trạng thái bình thường
          this.selectedMarker.setIcon(normalIcon);
          const prevPriceLabel = this.selectedPriceMarker?.getElement()?.querySelector('.price-label') as HTMLElement;
          if (prevPriceLabel) {
            prevPriceLabel.style.backgroundColor = normalBg; // Trả về màu ban đầu cho giá của marker cũ
          }
        }
        // Cập nhật marker được chọn mới
        this.selectedMarker = leafletMarker;
        this.selectedPriceMarker = priceMarker;
        leafletMarker.setIcon(hoverIcon); // Đổi icon thành trạng thái hover khi click
        const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
        if (priceLabel) {
          priceLabel.style.backgroundColor = hoverBg; // Cố định màu khi click
        }

        this.idMotel = marker._id;
        //hiện thị popup motel trên map
        this.handleShowPopupMotelOnMap();
      });
  
      this.markersArray.push(leafletMarker);
      this.markersArray.push(priceMarker);
    });
  }

  addMarkersSpecial(markerData: { _id: string; Locations: string; Price: number }[], specialMarkerLocation: string): void {
    const normalIcon = this.createNormalIcon();
    const hoverIcon = this.createHoverIcon();
    const normalBg = '#00358f';
    const hoverBg = '#3A8FFE';
  
    const markerPromises: Promise<void>[] = [];
  
    // Tách tọa độ từ chuỗi location của special marker
    const [specialLat, specialLng] = specialMarkerLocation.split(',').map(location => parseFloat(location.trim()));
  
    markerData.forEach((marker) => {
      const [lat, lng] = marker.Locations.split(',').map(location => parseFloat(location.trim()));
  
      // So sánh tọa độ để kiểm tra xem có phải marker đặc biệt không
      const isSpecialMarker = lat === specialLat && lng === specialLng;
      const iconToUse = isSpecialMarker ? hoverIcon : normalIcon;
      const hoverColor = '#3A8FFE';
      const defaultColor = isSpecialMarker ? hoverBg : normalBg;
  
      const leafletMarker = L.marker([lat, lng], { icon: iconToUse }).addTo(this.map);
      leafletMarker.setOpacity(0);  // Ban đầu marker ẩn
  
      const priceLabelDiv = L.divIcon({
        html: `<div class="price-label w-fit px-2 py-1 font-bold text-white pointer-events-none rounded-[5px] absolute top-[-40px]" style="background-color: ${defaultColor}">${marker.Price.toLocaleString()} VND</div>`,
        className: 'custom-price-icon',
        iconSize: [110, 30],
        iconAnchor: [45, 27],
      });
  
      const priceMarker = L.marker([lat, lng], { icon: priceLabelDiv }).addTo(this.map);
      priceMarker.setOpacity(0);  // Ban đầu price marker ẩn
  
      // Mỗi lần animate marker sẽ được lưu vào Promise để đảm bảo trình tự
      const animationPromise = new Promise<void>((resolve) => {
        const delay = markerData.indexOf(marker) * 100;
        setTimeout(() => {
          this.animateMarker(leafletMarker, lat, lng, 300, () => {
            leafletMarker.setOpacity(1); // Marker xuất hiện
          });
        }, delay);
  
        // Sau khi marker hoàn tất, animate price marker
        setTimeout(() => {
          priceMarker.setOpacity(1); // Price marker xuất hiện
          resolve();  // Animation của cả marker và price marker hoàn tất
        }, markerData.length * 100 + 400);  // Delay giữa marker và price marker (có thể điều chỉnh)
      });
  
      markerPromises.push(animationPromise); // Lưu vào mảng Promise
  
      if (isSpecialMarker) {
        this.selectedMarker = leafletMarker;
        this.selectedPriceMarker = priceMarker;
      }
  
      // Sự kiện hover và click giống như trước
      leafletMarker.on('mouseover', () => {
        if (this.selectedMarker !== leafletMarker) {
          leafletMarker.setIcon(hoverIcon);
          const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
          if (priceLabel) {
            priceLabel.style.backgroundColor = hoverColor;
          }
        }
      });
  
      leafletMarker.on('mouseout', () => {
        if (this.selectedMarker !== leafletMarker) {
          leafletMarker.setIcon(normalIcon);
          const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
          if (priceLabel) {
            priceLabel.style.backgroundColor = normalBg;
          }
        }
      });
  
      leafletMarker.on('click', (event) => {
        event.originalEvent.stopPropagation();
        if (this.selectedMarker) {
          this.selectedMarker.setIcon(normalIcon);
          const prevPriceLabel = this.selectedPriceMarker?.getElement()?.querySelector('.price-label') as HTMLElement;
          if (prevPriceLabel) {
            prevPriceLabel.style.backgroundColor = normalBg;
          }
        }
  
        this.selectedMarker = leafletMarker;
        this.selectedPriceMarker = priceMarker;
        leafletMarker.setIcon(hoverIcon);
        const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
        if (priceLabel) {
          priceLabel.style.backgroundColor = hoverColor;
        }
  
        this.idMotel = marker._id;
        this.handleShowPopupMotelOnMap();
      });
  
      this.markersArray.push(leafletMarker);
      this.markersArray.push(priceMarker);
    });
  
    // Đợi tất cả các animation (cả marker và price marker) hoàn tất trước khi thực hiện zoom
    Promise.all(markerPromises).then(() => {
      // Zoom vào marker đặc biệt sau khi tất cả các animation hoàn tất
      this.map.flyTo([specialLat, specialLng], 16, { duration: 0.8});  // Thực hiện zoom với animation
    });
  }
  
  
  
  
  //Delete all markers from the map
  clearMarkers(): void { 
    this.markersArray.forEach(marker => marker.remove()); 
    this.markersArray = []; 
  }


  // Hàm để lọc dữ liệu từ listMotel
  filterMotelData(listMotel: any) {
    return listMotel.map((motel :any)=> ({
      _id: motel._id,
      Locations: motel.Location,
      Price: motel.Price
    }));
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
  }

  // Initialize data motels
  initializeDataMotels():  void{
    this.motelService.getAllMotels().subscribe((response)=>{
      this.listMotelFiltered = response.dataFiltered;
      this.listMotels = this.filterMotelData(response.data);
      this.addMarkers(this.listMotels);

      response.data.map((motel: Motel)=>{
        this.rentalDistances.push(motel.Distance);
      })
      this.initializeDataDistanceChart();
      response.data.map((motel: Motel)=>{
        this.rentalPrices.push(motel.Price);
      })
      this.initializeDataPriceChart();
    })
  }

  // Initialize data motels
  initializeDataMotelsWithSpecialMarker(location: string):  void{
    this.motelService.getAllMotels().subscribe((response)=>{
      this.listMotelFiltered = response.dataFiltered;
      this.listMotels = this.filterMotelData(response.data);
      this.addMarkersSpecial(this.listMotels, location);

      response.data.map((motel: Motel)=>{
        this.rentalDistances.push(motel.Distance);
      })
      this.initializeDataDistanceChart();
      response.data.map((motel: Motel)=>{
        this.rentalPrices.push(motel.Price);
      })
      this.initializeDataPriceChart();
    })
  }

  //Initialize list ward commune
  initializeListWardCommune(): void{
    this.motelService.getListAddress().subscribe((response)=>{
      this.listAddress = response
      this.listAddressSuggest = response
    })
  }


  //show popup motel on map
  handleShowPopupMotelOnMap(): void{
    this.showPopupMotelOnMap = true;
  }

  //hidden popup motel on map
  handleHiddenPopupMotelOnMap(status: boolean) :void{
    this.showPopupMotelOnMap = status;
  }

  //Handle choose ward commune
  handleChooseWardCommune(event: Event) :void{
    const target = event.currentTarget as HTMLElement;
    const lastChild = target.lastElementChild as HTMLElement;
    this.addressSearch.setValue(lastChild.textContent);
    this.showDropdownSuggestWardCommune = false;
    this.handleFilters();
  }

  getFilters() :void{
    this.filters = {
      addressSearch: this.addressSearch.value ? this.addressSearch.value : '',
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

  //handle reset location map 
  handleSetLocationMap(location: string): void {
    const [lat, lng] = location.split(',').map(location => parseFloat(location.trim()));
    // Lấy vị trí hiện tại của map
    const currentCenter = this.map.getCenter();
    const currentLat = currentCenter.lat;
    const currentLng = currentCenter.lng;
    // Kiểm tra nếu vị trí hiện tại trùng với vị trí muốn di chuyển
    const latDiff = Math.abs(currentLat - lat);
    const lngDiff = Math.abs(currentLng - lng);
    // Nếu tọa độ không quá khác biệt (dưới ngưỡng cho phép) thì không di chuyển
    const threshold = 0.0001; // Ngưỡng sai lệch cho phép
    if (latDiff < threshold && lngDiff < threshold) {
      console.log('Vị trí hiện tại đã trùng với vị trí cần di chuyển. Không cần di chuyển.');
      return;
    }
    // Nếu khác, thực hiện việc di chuyển đến vị trí mới
    this.map.flyTo([lat, lng], 15, { duration: 0.8 });
  }
  

  // Handle the form filter values
  handleFilters() :void { 
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.spinner.show();
      setTimeout(() => {
        this.listMotels = this.filterMotelData(response.data);
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
        this.clearMarkers();
        this.addMarkers(this.listMotels);
  
        this.listMotelFiltered = response.dataFiltered;
        this.spinner.hide();
        this.handleSetLocationMap(this.listMotels[0].Locations);
      }, 500);
      
    });
    console.log(123);
    this.updateURL(this.formFilters.value);
  }

   // Handle the form filter values
   handleFiltersWithSpecialMarker(location: string  ) :void {
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.spinner.show();
      setTimeout(() => {
        this.listMotels = this.filterMotelData(response.data);
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
        this.clearMarkers();
        this.addMarkersSpecial(this.listMotels, location);
  
        this.listMotelFiltered = response.dataFiltered;
        this.spinner.hide();
        this.handleSetLocationMap(this.listMotels[0].Locations);
      }, 500);
    }); 
    this.updateURL(this.formFilters.value);

  }

   // Handle the form filter values
   handleFiltersDistance() :void {
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.spinner.show();
      setTimeout(() => {
        this.listMotels = this.filterMotelData(response.data);
        this.rentalPrices= [];
        response.data.map((motel: any)=>{
          this.rentalPrices.push(motel.Price);
        })
        this.initializeDataPriceChart();
        this.clearMarkers();
        this.addMarkers(this.listMotels);
  
        this.listMotelFiltered = response.dataFiltered;
        this.spinner.hide();
        this.handleSetLocationMap(this.listMotels[0].Locations);
      }, 700);
    });
    this.updateURL(this.formFilters.value);
  }

  // Handle the form filter values
  handleFiltersPrice() :void {
    this.getFilters();
    this.motelService.getMotelsFiltered(this.filters).subscribe((response)=>{
      this.spinner.show();
      setTimeout(() => {
        this.listMotels = this.filterMotelData(response.data);
        this.rentalDistances= [];
        response.data.map((motel: any)=>{
          this.rentalDistances.push(motel.Distance);
        })
        this.initializeDataDistanceChart();
        this.clearMarkers();
        this.addMarkers(this.listMotels);
        this.listMotelFiltered = response.dataFiltered;
        this.spinner.hide();
        this.handleSetLocationMap(this.listMotels[0].Locations);
      }, 700);
      this.updateURL(this.formFilters.value);
    });
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


  goBack(): void {
    this.location.back();
  }

  // handle bỏ dấu
  removeAccents(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  //handle gợi ý tìm kiếm địa chỉ
  handleSuggestSearchAddress():void{
    let searchInput = this.addressSearch.value.trim();
    this.listAddressSuggest = this.listAddress.filter((address: string) => {
      return this.removeAccents(address.toLowerCase()).includes(this.removeAccents(searchInput.toLowerCase()));
    });
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

  updateURL(newFilters: any) {
    // Làm sạch đối tượng filters, loại bỏ các giá trị undefined và null
    const sanitizedFilters = Object.fromEntries(
      Object.entries(newFilters)
        .filter(([key, value]) => value !== undefined && value !== null) // Chỉ giữ lại các thuộc tính trong allowedFilters
    );

     delete sanitizedFilters['address'];
     sanitizedFilters['addressSearch'] = this.addressSearch.value
     console.log(sanitizedFilters);
     
     // Đảm bảo address luôn đứng đầu đối tượng
     const sortedFilters = {addressSearch: sanitizedFilters['addressSearch'], ...sanitizedFilters };
     console.log(sortedFilters);

    // Chuyển đối tượng thành JSON, mã hóa và giải mã URL
    const jsonFilters = JSON.stringify(sortedFilters);
    const encodedFilters = encodeURIComponent(jsonFilters);
    const decodedFilters = decodeURIComponent(encodedFilters);
    console.log(decodedFilters);
    // Điều hướng với các tham số query, giữ nguyên các tham số còn lại
    // this.router.navigate([], {
    //   queryParams: { filters: decodedFilters },
    // });
  }

}
