import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { listWardCommune } from '../../../../other-data/list-ward-commune';
import { Convenient } from 'src/app/interfaces/convenient';
import { ConvenientService } from 'src/app/services/convenient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as L from 'leaflet';
import { debounceTime } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { Landlord } from 'src/app/interfaces/landlord';
import { MotelService } from 'src/app/services/motel.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Motel } from 'src/app/interfaces/motel';

const API_KEY = 'L8v4NrOC0ATKuzJoQA7ueDZqAVrsRVXLi0YJhXyG';

@Component({
  selector: 'app-popup-add-motel',
  templateUrl: './popup-add-motel.component.html',
  styleUrls: ['./popup-add-motel.component.css'],
})
export class PopupAddMotelComponent implements OnInit {
  listImages: File[] = [];
  imageUrls: string[] = [];
  listWardCommune = listWardCommune;
  addMotelForm!: FormGroup;
  checkConvenient: { label: string; value: string; checked: boolean }[] = [];
  haveWifi = false;
  location!: string;
  distance!: number;
  firstInvalidControl: string | null = null;
  user!: User;
  @Input() landlord!: Landlord;
  @Output() newMotel = new EventEmitter<Motel>();

  //map properties
  map!: L.Map;
  constructor(
    private convenientService: ConvenientService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private motelService: MotelService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['landlord']){
     this.setInfoLandlordIntoFields();
    }
    
  }

  ngOnInit(): void {
    this.getAllConvenient();
    this.getInfoUser();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.addMotelForm
      .get('address')!
      .valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.getLocation();
      });
    this.addMotelForm
      .get('wardCommune')!
      .valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.getLocation();
      });
  }

  getInfoUser() :void{
    const email = this.authService.getEmailFromToken();
    this.userService.getInfoUserByEmail(email).subscribe({
      next: (response) => {
        this.user = response
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
  }

  initializeForm(): void {
    this.addMotelForm = this.formBuilder.group({
      nameMotel: [''],
      price: [null, [Validators.required, Validators.min(500000), Validators.max(5000000)]],
      address: ['', [Validators.required]],
      wardCommune: ['', [Validators.required]],
      description: ['', [Validators.required]],
      listConvenient: [[]],
      wifiBill: [null],
      electricityBill: [3500, [Validators.required]],
      waterBill: [150000, [Validators.required]],
      liveWithLandlord: [true],
      landlordName:['',[Validators.required]],
      phoneNumberContact:['',[Validators.required]],
      addressLandlord:[''],
    });
  }

  setInfoLandlordIntoFields() :void{
    this.addMotelForm.get('landlordName')?.setValue(this.landlord.LandlordName);
    this.addMotelForm.get('phoneNumberContact')?.setValue(this.landlord.PhoneNumber);
    this.addMotelForm.get('addressLandlord')?.setValue(this.landlord.Address);
  }

  get addressControl() {
    return this.addMotelForm.get('address');
  }

  get wardCommuneControl() {
    return this.addMotelForm.get('wardCommune');
  }

  get priceControl() {
    return this.addMotelForm.get('price');
  }

  get descriptionControl() {
    return this.addMotelForm.get('description');
  }

  get electricityBillControl() {
    return this.addMotelForm.get('electricityBill');
  }

  get waterBillControl() {
    return this.addMotelForm.get('waterBill');
  }

  get landlordNameControl() {
    return this.addMotelForm.get('landlordName');
  }

  get phoneNumberContactControl() {
    return this.addMotelForm.get('phoneNumberContact');
  }

  get addressLandlordControl() {
    return this.addMotelForm.get('addressLandlord');
  }

  // Initialize map
  initializeMap(): void {
    this.map = L.map('mapAddMotel').setView([13.7624, 109.21801], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  handleChangeCheckConvenient(): void {
    let checkWifi = this.checkConvenient.filter(
      (convenient) => convenient.label === 'Wifi' && convenient.checked === true
    );
    if (checkWifi.length > 0) {
      this.haveWifi = true;
      setTimeout(() => {
        const inputElement = document.getElementById(
          'wifiBill'
        ) as HTMLInputElement;
        inputElement.focus();
      });
    } else {
      this.haveWifi = false;
    }
  }

  getAllConvenient(): void {
    this.convenientService
      .getAllConvenient()
      .subscribe((response: Convenient[]) => {
        this.checkConvenient = response.map((convenient) => ({
          label: convenient.NameConvenient,
          value: convenient._id,
          checked: false,
        }));
      });
  }

  handleAddMotel(): void {
    let checkConvenient = this.checkConvenient
      .filter((convenient) => convenient.checked === true)
      .map((convenient) => convenient.value);
    this.addMotelForm.patchValue({
      listConvenient: [...checkConvenient],
    });
    if (this.addMotelForm.invalid || this.listImages.length === 0) {
      this.focusFirstInvalidControl(this.addMotelForm);
      return;
    } else {
      const data = new FormData();
      const formValues = this.addMotelForm.value;
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          const value = formValues[key];
          data.append(key, Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value) : value?.toString());
        }
      }
      // Thêm các giá trị ngoài form
      for (let file of this.listImages) {
        data.append('listImages', file);
      }
      data.append('location', this.location);
      data.append('distance', this.distance.toString());
      data.append('userID', this.user._id);
      data.append('landlordID', this.landlord._id);


      this.motelService.addNewMotel(data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Thêm mới thành công!', 'Bạn đã thêm thành công nhà trọ mới');
          this.newMotel.emit(response);
          this.hiddenPopupAddMotel();
        },
        error: (error) => {
          this.alertService.showError('Thêm mới thất bại!', error.error.message); 
        }
      })
      
    }
  }

  async getLocation(): Promise<void> {
    const street = this.addMotelForm.get('address')?.value;
    const wardCommune = this.addMotelForm.get('wardCommune')?.value;
  
    if (!street || !wardCommune) {
      console.log('Vui lòng nhập cả số nhà, tên đường và phường/xã.');
      return;
    }
  
    const address = `${street}, ${wardCommune}, Quy Nhơn, Bình Định, Việt Nam`;
    const geocodeUrl = `https://rsapi.goong.io/Geocode?address=${encodeURIComponent(address)}&api_key=${API_KEY}`;
  
    this.spinner.show(); // Hiển thị spinner trong khi gọi API
  
    try {
      // Lấy tọa độ từ địa chỉ
      const geocodeResponse = await fetch(geocodeUrl);
      if (!geocodeResponse.ok) {
        throw new Error(`Error ${geocodeResponse.status}: ${geocodeResponse.statusText}`);
      }
  
      const geocodeData = await geocodeResponse.json();
      if (geocodeData.results.length > 0) {
        const lat = geocodeData.results[0].geometry.location.lat;
        const lng = geocodeData.results[0].geometry.location.lng;
        this.location = `${lat},${lng}`;
        console.log('Location:', this.location);
  
        this.addMarker(this.location); // Thêm marker lên bản đồ
        // Gọi API Directions để tính khoảng cách thực tế
        const fixedPoint = { lat: 13.758940249593117, lng: 109.21818165778532 };
        const directionsUrl = `https://rsapi.goong.io/Direction?origin=${fixedPoint.lat},${fixedPoint.lng}&destination=${lat},${lng}&api_key=${API_KEY}`;
  
        const directionsResponse = await fetch(directionsUrl);
        if (!directionsResponse.ok) {
          throw new Error(`Error ${directionsResponse.status}: ${directionsResponse.statusText}`);
        }
  
        const directionsData = await directionsResponse.json();
        if (directionsData.routes && directionsData.routes.length > 0) {
          this.distance = parseFloat((directionsData.routes[0].legs[0].distance.value / 1000).toFixed(2)); // Chuyển từ mét sang km
          console.log(`Khoảng cách theo đường đi: ${this.distance} km`);
        } else {
          console.log('Không tìm thấy tuyến đường phù hợp.');
        }
      } else {
        this.location = '';
        console.log('Không tìm thấy kết quả cho địa chỉ này.');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      console.log('Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
    } finally {
      this.spinner.hide(); // Ẩn spinner
    }
  }
  

  addMarker(location: string): void {
    if (!location) {
      console.error('Location is empty or invalid.');
      return;
    }
    // Parse latitude and longitude from the location string
    const [lat, lng] = location
      .split(',')
      .map((coord) => parseFloat(coord.trim()));
    // Check if lat and lng are valid numbers
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates:', lat, lng);
      return;
    }
    // Remove all markers from the map
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer); // Remove marker if the layer is a marker
      }
    });
    // Create a normal icon marker
    const normalIcon = L.icon({
      iconUrl: './assets/images/marker.png', // Normal icon path
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });
    // Add the marker to the map
    const leafletMarker = L.marker([lat, lng], {
      icon: normalIcon,
      draggable: true,
    }).addTo(this.map);
    this.map.setView([lat, lng], 16);

    leafletMarker.on('dragend', () => {
      const newLatLng = leafletMarker.getLatLng();
      const newLocation = `${newLatLng.lat},${newLatLng.lng}`;
      this.location = newLocation; // Update the location with the new coordinates
      console.log('New location:', this.location);
    });
  }

  focusFirstInvalidControl(formGroup: FormGroup) {
    this.firstInvalidControl = null; // Reset giá trị trước khi kiểm tra
    for (const controlName in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(controlName)) {
        const control = formGroup.controls[controlName];
        if (control.invalid) {
          this.firstInvalidControl = controlName; // Lưu tên trường không hợp lệ
          const inputElement = document.querySelector(
            `[formControlName="${controlName}"]`
          ) as HTMLInputElement;
          if (inputElement) {
            inputElement.focus();
          }
          break; // Dừng lại sau khi đã tìm thấy trường đầu tiên không hợp lệ
        }
      }
    }
  }

  hiddenPopupAddMotel() {
    const popupAddMotel = document.getElementById(
      'popupAddMotel'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'auto';
    if (popupAddMotel && popupAddMotel.classList.contains('flex')) {
      popupAddMotel.classList.remove('flex');
      popupAddMotel.classList.add('hidden');
    }
    this.addMotelForm.reset();
    this.listImages = [];
    this.imageUrls = [];
    this.getAllConvenient();
    this.addMotelForm.get('liveWithLandlord')?.setValue(true);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const filesArray = Array.from(files); // Chuyển FileList thành mảng
    // Kiểm tra nếu số lượng ảnh đã chọn vượt quá 8
    if (this.listImages.length + filesArray.length > 8) {
      this.alertService.showWarning('Cảnh báo!', 'Ảnh bạn chọn quá 8 ảnh!');
      return;
    }
    // Thêm ảnh vào danh sách
    this.listImages = [...this.listImages, ...filesArray];
    // Tạo URL cho mỗi ảnh và đảm bảo rằng ngữ cảnh thay đổi sẽ được phát hiện
    this.imageUrls = this.listImages.map((file) => URL.createObjectURL(file));
    // Đảm bảo Angular kiểm tra lại view
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  // Hàm xóa ảnh
  removeImage(imageUrl: string): void {
    // Tìm và xóa URL trong imageUrls
    const index = this.imageUrls.indexOf(imageUrl);
    if (index !== -1) {
      // Giải phóng blob URL nếu tồn tại
      URL.revokeObjectURL(this.imageUrls[index]);
      // Xóa ảnh trong mảng imageUrls
      this.imageUrls.splice(index, 1);
      // Cập nhật lại danh sách ảnh trong listImages nếu cần
      this.listImages = this.listImages.filter((_, i) => i !== index);
    }
  }
}

 
