// src/app/chart-options.ts
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexTooltip, ApexPlotOptions, ApexFill, ApexGrid } from 'ng-apexcharts';

export const chartOptions = (colors: string[]): {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill
  states: any;
  grid: ApexGrid
} => ({
  series: [
    {
      name: 'Số lượng nhà trọ',
      data: []  // Dữ liệu sẽ được cập nhật từ component
    }
  ],
  grid: {show: false},
  chart: {
    type: 'bar',
    height: 110,
    background: 'transparent',
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: [],  // Các mức giá sẽ được cập nhật từ component
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    enabled: false
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      colors: {
        ranges: [{
          from: 0,
          to: 10000000,
          color: colors[0]  // Màu sắc của các cột
        }]
      },
      distributed: false, 
      dataLabels: {
        position: 'top'
      }
    }
  },
  colors,
  fill: {
    colors: ['#e0e0e0']
  },
  states: {
    hover: {
      filter: {
        type: 'none'  
      }
    }
  }
});
