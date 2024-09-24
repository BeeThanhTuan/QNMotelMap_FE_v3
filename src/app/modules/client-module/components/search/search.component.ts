import { Component } from '@angular/core';
import { chartOptions } from '../../config-charts/chart-bar-options';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  chartOptions: any;
  formFilters!: FormGroup;

  // Giá nhà trọ cụ thể
  rentalPrices = [500000,1300000, 1500000, 1250000, 2000000, 2000000, 2500000,2000000, 3000000, 4000000, 5000000];
  rentalData: { price: number, count: number }[];

  constructor(private titleService: Title, private formBuilder: FormBuilder) {
    this.titleService.setTitle('QNMoteMap | Tìm kiếm ');
    // Lấy dữ liệu số lượng nhà trọ theo giá tiền
    this.rentalData = this.getHouseCountByPrice(this.rentalPrices);

    // Tạo dữ liệu cho biểu đồ
    const categories = Array.from({ length: 46 }, (_, i) => 500000 + i * 100000);
    const counts = categories.map(cat => {
      return this.rentalData.find(item => item.price === cat)?.count || 0;
    });

    // Cập nhật chartOptions với dữ liệu cụ thể
    this.chartOptions = chartOptions(['#039445']);
    this.chartOptions.series[0].data = counts;
    this.chartOptions.xaxis.categories = categories;

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

  handleFilters(){
    console.table(this.formFilters.value);
  }


  // Hàm để lấy số lượng nhà trọ theo giá tiền
  getHouseCountByPrice(prices: number[]): { price: number, count: number }[] {
    const priceBuckets: { [key: number]: number } = {};
    for (let price = 500000; price <= 5000000; price += 100000) {
      priceBuckets[price] = 0;
    }

    prices.forEach(price => {
      const bucket = this.getBucket(price);
      if (bucket) {
        priceBuckets[bucket] += 1;
      }
    });

    return Object.keys(priceBuckets).map(bucket => ({
      price: parseInt(bucket),
      count: priceBuckets[parseInt(bucket)]
    }));
  }

  getBucket(price: number): number | null {
    if (price < 500000 || price > 5000000) return null;
    const roundedPrice = Math.floor((price - 500000) / 100000) * 100000 + 500000;
    return roundedPrice;
  }
}