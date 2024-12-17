import { Component, OnInit } from '@angular/core';
import { MotelService } from 'src/app/services/motel.service';
import { RoomTypeService } from 'src/app/services/roomType.service';
import { UserService } from 'src/app/services/user.service';

// Interface để định nghĩa kiểu dữ liệu
interface ListMotelsByWardCommune {
  WardCommune: string;
  Count: number;
}

interface CountRooms {
  TotalRooms: number;
  AvailableRooms: number;
}

interface CountUsers {
  client: number;
  landlord: number;
  admin: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Dữ liệu cho danh sách nhà trọ theo xã/phường
  listMotelsByWardCommune: ListMotelsByWardCommune[] = [];

  // Màu sắc cho phần hiển thị
  colors = [
    'bg-blue-100',    
    'bg-green-100',   
    'bg-pink-100',   
    'bg-yellow-100', 
    'bg-yellow-200' 
];

  // Biến cho biểu đồ
  chartRoomOptions: any;
  chartMotelOptions:any;
  chartUserOptions:any;
  // Thông tin phòng
  totalRooms!: number;      // Tổng số phòng
  availableRooms!: number;  // Số phòng trống
  occupiedRooms!: number;   // Số phòng đã thuê

  countUsers!:CountUsers;
  constructor(
    private motelService: MotelService,
    private roomTypeService: RoomTypeService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.countMotelsByWardCommune(); 
    this.countRooms();  
    this.countUserByRoleName()             
    this.initializeChartRoomOptions();  
    this.initializeChartMotelOptions();  
    this.initializeChartUserOptions(this.countUsers);  


  }

  // Hàm khởi tạo biểu đồ 
  initializeChartRoomOptions(): void {
    this.chartRoomOptions = {
      series: [this.availableRooms, this.occupiedRooms], 
      chart: {
        type: 'donut',
        height: 300,
      },
      labels: ['Phòng trống', 'Phòng đã thuê'],
      colors: ['#00e296', '#babbbd'], 
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Tổng phòng',
                fontSize: '16px', 
                fontWeight: 'semibold',
                color: '#333', 
                formatter: () => {
                  return `${this.totalRooms}`; 
                },
                style: {
                  fontSize: '30px',
                  fontWeight: 'bold', 
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true, 
        formatter: (val: any, opts: any) => {
          return `${opts.w.config.series[opts.seriesIndex]} phòng`;
        },
      },
      legend: {
        position: 'bottom',
      },
    };
  }

  initializeChartMotelOptions(): void {
    const totalMotels = this.listMotelsByWardCommune.reduce((total, motel) => total + motel.Count, 0);
    this.chartMotelOptions = {
      series: [totalMotels], // Số lượng nhà trọ (dựa vào danh sách nhà trọ)
      chart: {
        type: 'donut',
        height: 300,
      },
      labels: ['Số lượng nhà trọ'], // Nhãn cho phần biểu đồ
      colors: ['#3399ff'], // Màu cho phần biểu đồ
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Tổng nhà trọ', // Label bên trong
                fontSize: '16px', 
                fontWeight: 'semibold',
                color: '#333',
                formatter: () => {
                  return `${totalMotels}`; // Hiển thị tổng số nhà trọ
                },
                style: {
                  fontSize: '30px', // Font size cho tổng số nhà trọ
                  fontWeight: 'bold', // Làm đậm chữ
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true, 
        formatter: (val: any, opts: any) => {
          return `${opts.w.config.series[opts.seriesIndex]} nhà trọ`;
        },
      },
      legend: {
        position: 'bottom',
      },
    };
  }

  initializeChartUserOptions(data: CountUsers): void {
    this.chartUserOptions = {
      series: [data.client, data.landlord, data.admin], 
      chart: {
        type: 'donut',
        height: 300,
      },
      labels: ['Client', 'Landlord', 'Admin'], 
      colors: ['#3399ff', '#00e296', '#fdb018'], 
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Tổng người dùng',
                fontSize: '16px',
                fontWeight: 'semibold',
                color: '#333',
                formatter: () => {
                  return `${data.client + data.landlord + data.admin}`; // Hiển thị tổng số nhà trọ
                },
                style: {
                  fontSize: '30px', 
                  fontWeight: 'bold',
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any, opts: any) => {
          return `${opts.w.config.series[opts.seriesIndex]} người`; // Hiển thị số lượng nhà trọ
        },
      },
      legend: {
        position: 'bottom',
      },
    };
  }
  
  

  // Lấy số lượng phòng và số phòng trống từ RoomTypeService
  countRooms(): void {
    this.roomTypeService.countRooms().subscribe((response: CountRooms) => {
      this.totalRooms = response.TotalRooms;
      this.availableRooms = response.AvailableRooms;
      this.occupiedRooms = this.totalRooms - this.availableRooms;
      // Cập nhật biểu đồ sau khi có dữ liệu
      this.initializeChartRoomOptions();
    });
  }

  // Lấy danh sách nhà trọ theo xã/phường từ MotelService
  countMotelsByWardCommune(): void {
    this.motelService.countMotelsByWardCommune().subscribe((data) => {
      this.listMotelsByWardCommune = data;
      this.initializeChartMotelOptions();
    });
  }

  // Lấy danh sách user theo vai trò
  countUserByRoleName(): void {
    this.userService.countUsers().subscribe((data: CountUsers) => {
      this.countUsers = data;
      this.initializeChartUserOptions(data);
    });
  }
}
