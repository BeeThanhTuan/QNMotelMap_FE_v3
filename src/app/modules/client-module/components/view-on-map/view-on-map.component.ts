import { Component } from '@angular/core';
import { chartOptions } from '../../config-charts/chart-bar-options';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-view-on-map',
  templateUrl: './view-on-map.component.html',
  styleUrls: ['./view-on-map.component.css'],
})
export class ViewOnMapComponent {
  showDropdownSuggestWardCommune = false;
  chartOptions: any;
  formFilters!: FormGroup;
  rentalPrices = [500000, 1300000, 1500000, 1250000, 2000000, 2000000, 2500000, 2000000, 3000000, 4000000, 5000000];
  rentalData: { price: number; count: number }[] = [];
  map!: L.Map;
  markersArray: L.Marker[] = [];
  markers = [
    { locations: '13.76240, 109.21801', price: 900000 },
    { locations: '13.76400, 109.22001', price: 1300000 }
  ]; // Thêm thông tin giá vào mảng markers
  constructor(private titleService: Title, private formBuilder: FormBuilder) {
    this.titleService.setTitle('QNMoteMap | Tìm kiếm');
    this.initializeData();
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.handHiddenControlZoom();
    this.addMarkers(this.markers);
    this.handleChangeStyle();
  }

  // Setup the chart options with dynamic data
  setupChart(categories: number[], counts: number[]): void {
    this.chartOptions = chartOptions(['#039445']);
    this.chartOptions.series[0].data = counts;
    this.chartOptions.xaxis.categories = categories;
  }

  // Initialize data for the chart and rental information
  initializeData(): void {
    this.rentalData = this.getHouseCountByPrice(this.rentalPrices);
    const { categories, counts } = this.getChartCategoriesAndCounts(this.rentalData);
    this.setupChart(categories, counts);
  }

  // Initialize form filters
  initializeForm(): void {
    this.formFilters = this.formBuilder.group({
      motelHasRoomAvailable: [false],
      noLiveWithLandlord: [false],
      distanceLess1Km: [false],
      desiredPrice: [500000],
      haveMezzanine: [false],
      haveToilet: [false],
      havePlaceToCook: [false],
      haveAirConditioner: [false],
    });
  }

  // Khởi tạo bản đồ
  initMap(): void {
    this.map = L.map('map').setView([13.7624, 109.21801], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  createNormalIcon(): L.Icon {
    return L.icon({
      iconUrl: './assets/images/marker.png', // Icon bình thường
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });
  }
  
  createHoverIcon(): L.Icon {
    return L.icon({
      iconUrl: './assets/images/marker-i.png', // Icon khi hover
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });
  }

  addMarkers(markerData: { locations: string, price: number }[]): void {
    const normalIcon = this.createNormalIcon();
    const hoverIcon = this.createHoverIcon();
  
    markerData.forEach((marker) => {
      const [lat, lng] = marker.locations.split(',').map(location => parseFloat(location.trim()));
  
      // Tạo marker với icon bình thường
      const leafletMarker = L.marker([lat, lng], { icon: normalIcon }).addTo(this.map);
  
      // Thêm sự kiện hover
      leafletMarker.on('mouseover', () => {
        leafletMarker.setIcon(hoverIcon); // Đổi icon khi hover
      });
  
      leafletMarker.on('mouseout', () => {
        leafletMarker.setIcon(normalIcon); // Trả về icon bình thường khi không hover
      });
  
      // Tạo một div để hiển thị giá (sẽ xuất hiện phía trên marker)
      const priceLabelDiv = L.divIcon({
        html: `<div class="price-label w-fit px-2 py-1 font-bold bg-[#00358f] text-white pointer-events-none rounded-[5px] absolute top-[-40px] ">${marker.price.toLocaleString()} VND</div>`,
        className: 'custom-price-icon',
        iconSize: [110, 30],
        iconAnchor: [45, 27],
      });
  
      // Tạo một marker cho giá
      const priceMarker = L.marker([lat, lng], { icon: priceLabelDiv }).addTo(this.map);
  
      // Thêm cả hai marker vào mảng markersArray
      this.markersArray.push(leafletMarker);
      this.markersArray.push(priceMarker);
    });
  }

  // Xóa tất cả các marker khỏi bản đồ
  clearMarkers(): void {
    this.markersArray.forEach(marker => marker.remove()); // Xóa từng marker
    this.markersArray = []; // Làm trống mảng
  }

  changeData() {
    this.markers = [
      { locations: '13.76644, 109.21217', price: 1700000 },
      { locations: '13.77603, 109.22848', price: 2500000 }
    ]; // Dữ liệu mới với giá thuê
    this.clearMarkers();
    this.addMarkers(this.markers);
  }

  // Handle the form filter values
  handleFilters(): void {
    console.table(this.formFilters.value);
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
  getChartCategoriesAndCounts(rentalData: { price: number; count: number }[]): { categories: number[], counts: number[] } {
    const categories = Array.from({ length: 46 }, (_, i) => 500000 + i * 100000);
    const counts = categories.map((cat) => rentalData.find((item) => item.price === cat)?.count || 0);
    return { categories, counts };
  }

  //hidden control zoom 
  handHiddenControlZoom(){
    const div = document.querySelector('.leaflet-control-zoom.leaflet-bar.leaflet-control') as HTMLElement;
    div.style.display = 'none';
  }

  handleChangeStyle(){
    const popups = document.querySelectorAll('.custom-price-icon'); 
    console.log(popups);  
    popups.forEach(popup => {
      (popup as HTMLElement).style.pointerEvents = 'none';
      (popup as HTMLElement).style.position = 'absolute';
      (popup as HTMLElement).style.left = '-10px';
      (popup as HTMLElement).style.display = 'flex';
      (popup as HTMLElement).style.justifyContent = 'center';
      (popup as HTMLElement).style.alignItems= 'center';
    });
  }
  
}
