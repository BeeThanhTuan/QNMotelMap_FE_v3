import { Component } from '@angular/core';
import { chartOptions } from '../../config-charts/chart-bar-options';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
import { MotelService } from 'src/app/services/motel.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MotelFiltered} from 'src/app/interfaces/motelFiltered';
import { debounceTime } from 'rxjs/operators';
import { Motel } from 'src/app/interfaces/motel';
import { Location } from '@angular/common';
import { NzMarks } from 'ng-zorro-antd/slider';

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
  listMotels = [];
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
  
  constructor(private titleService: Title, private formBuilder: FormBuilder, private motelService: MotelService,
    private location: Location,  private spinner: NgxSpinnerService ) {
    this.titleService.setTitle('QNMoteMap | Tìm kiếm');
    this.initializeForm();
    this.initializeListWardCommune();
  }

  ngOnInit(): void {
    this.initializeDataMotels();
    this.initializeDataPriceChart();
    this.initializeDataDistanceChart();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.handHiddenControlZoom();
    this.handleChangeStyleCheckbox();
    this.formFilters.get('desiredDistance')!.valueChanges.pipe(debounceTime(700)).subscribe(() => {
      this.handleFiltersDistance();
    });
    this.formFilters.get('desiredPrice')!.valueChanges.pipe(debounceTime(700)).subscribe(() => {
      this.handleFiltersPrice();
    });
    this.addressSearch.valueChanges.pipe(debounceTime(700)).subscribe(() => {
      this.handleSuggestSearchAddress();
    });
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

  // Initialize map
  initializeMap(): void {
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


  //add markers into map 
  addMarkers(markerData: { _id: string; Locations: string; Price: number }[]): void {
    const normalIcon = this.createNormalIcon();
    const hoverIcon = this.createHoverIcon();
    const normalBg = '#00358f';
    const hoverBg = '#3A8FFE'
  
    markerData.forEach((marker) => {
      const [lat, lng] = marker.Locations.split(',').map(location => parseFloat(location.trim()));
  
      // Tạo marker với icon bình thường
      const leafletMarker = L.marker([lat, lng], { icon: normalIcon }).addTo(this.map);
  
      // Tạo một div để hiển thị giá (sẽ xuất hiện phía trên marker)
      const priceLabelDiv = L.divIcon({
        html: `<div class="price-label w-fit px-2 py-1 font-bold bg-[#00358f] text-white pointer-events-none rounded-[5px] absolute top-[-40px]">${marker.Price.toLocaleString()} VND</div>`,
        className: 'custom-price-icon',
        iconSize: [110, 30],
        iconAnchor: [45, 27],
      });
  
      // Tạo một marker cho giá
      const priceMarker = L.marker([lat, lng], { icon: priceLabelDiv }).addTo(this.map);
  
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

  //add markers into map with special marker
  addMarkersSpecial(markerData: { _id: string; Locations: string; Price: number }[], specialMarkerIndex: number): void {
    const normalIcon = this.createNormalIcon();
    const hoverIcon = this.createHoverIcon();
    const normalBg = '#00358f';
    const hoverBg = '#3A8FFE'
  
    markerData.forEach((marker, index) => {
      const [lat, lng] = marker.Locations.split(',').map(location => parseFloat(location.trim()));
  
      // Kiểm tra nếu marker hiện tại là đặc biệt
      const isSpecialMarker = index === specialMarkerIndex;
      const iconToUse = isSpecialMarker ? hoverIcon : normalIcon; // Nếu là special thì dùng hoverIcon
      const hoverColor = '#3A8FFE'; // Màu hover khác cho marker đặc biệt
      const defaultColor = isSpecialMarker ? hoverBg : normalBg; // Màu nền mặc định khác cho marker đặc biệt
  
      // Tạo marker với icon tương ứng
      const leafletMarker = L.marker([lat, lng], { icon: iconToUse }).addTo(this.map);
  
      // Tạo div hiển thị giá với màu khác cho marker đặc biệt
      const priceLabelDiv = L.divIcon({
        html: `<div class="price-label w-fit px-2 py-1 font-bold text-white pointer-events-none rounded-[5px] absolute top-[-40px]" style="background-color: ${defaultColor}">${marker.Price.toLocaleString()} VND</div>`,
        className: 'custom-price-icon',
        iconSize: [110, 30],
        iconAnchor: [45, 27],
      });
  
      // Tạo marker cho giá
      const priceMarker = L.marker([lat, lng], { icon: priceLabelDiv }).addTo(this.map);
  
      // Nếu là specialMarker, gán làm selectedMarker và set trạng thái ngay từ đầu
      if (isSpecialMarker) {
        this.selectedMarker = leafletMarker;
        this.selectedPriceMarker = priceMarker;
      }
  
      // Thêm sự kiện hover cho marker
      leafletMarker.on('mouseover', () => {
        if (this.selectedMarker !== leafletMarker) {
          leafletMarker.setIcon(hoverIcon); // Đổi icon khi hover nếu chưa được chọn
          const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
          if (priceLabel) {
            priceLabel.style.backgroundColor = hoverColor; // Thay đổi màu khi hover
          }
        }
      });
  
      leafletMarker.on('mouseout', () => {
        if (this.selectedMarker !== leafletMarker) {
          leafletMarker.setIcon(normalIcon); // Trả về icon ban đầu nếu chưa được chọn
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
            prevPriceLabel.style.backgroundColor = normalBg; 
          }
        }
  
        // Cập nhật marker được chọn mới
        this.selectedMarker = leafletMarker;
        this.selectedPriceMarker = priceMarker;
        leafletMarker.setIcon(hoverIcon); // Đổi icon thành trạng thái hover khi click
        const priceLabel = priceMarker.getElement()?.querySelector('.price-label') as HTMLElement;
        if (priceLabel) {
          priceLabel.style.backgroundColor = hoverColor; // Cố định màu khi click
        }
        
        this.idMotel = marker._id;
        //hiện thị popup motel trên map
        this.handleShowPopupMotelOnMap();
      });
  
      this.markersArray.push(leafletMarker);
      this.markersArray.push(priceMarker);
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
  initializeDataMotels(): void{
    this.motelService.getAllMotels().subscribe((response)=>{
      this.listMotelFiltered = response.dataFiltered;
      this.listMotels = this.filterMotelData(response.data);
      this.addMarkers(this.listMotels);
      this.handleChangeStyle();
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
        this.handleChangeStyle();
        this.listMotelFiltered = response.dataFiltered;
        this.spinner.hide();
      }, 500);
    }); 

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
        this.handleChangeStyle();
        this.listMotelFiltered = response.dataFiltered;
        this.spinner.hide();
      }, 700);
    });
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
        this.handleChangeStyle();
        this.listMotelFiltered = response.dataFiltered;
        this.spinner.hide();
      }, 700);
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

  //handle hidden control zoom 
  handHiddenControlZoom() :void {
    const div = document.querySelector('.leaflet-control-zoom.leaflet-bar.leaflet-control') as HTMLElement;
    div.style.display = 'none';
  }

  //handle change style price label marker
  handleChangeStyle() :void {
    const popups = document.querySelectorAll('.custom-price-icon'); 
    popups.forEach(popup => {
      (popup as HTMLElement).style.pointerEvents = 'none';
      (popup as HTMLElement).style.position = 'absolute';
      (popup as HTMLElement).style.left = '-10px';
      (popup as HTMLElement).style.display = 'flex';
      (popup as HTMLElement).style.justifyContent = 'center';
      (popup as HTMLElement).style.alignItems= 'center';
    });
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


  
}
