import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
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
import { Images } from 'src/app/interfaces/images';

const API_KEY = 'L8v4NrOC0ATKuzJoQA7ueDZqAVrsRVXLi0YJhXyG';

@Component({
  selector: 'app-popup-update-motel',
  templateUrl: './popup-update-motel.component.html',
  styleUrls: ['./popup-update-motel.component.css']
})
export class PopupUpdateMotelComponent {
  listImages: File[] = [];
  imageUrls: string[] = [];
  listOldImages: Images[] = [];
  listOldImagesRemove: string[] = []
  listWardCommune = listWardCommune;
  updateMotelForm!: FormGroup;
  checkConvenient: { label: string; value: string; checked: boolean }[] = [];
  haveWifi = false;
  location!: string;
  distance!: number;
  firstInvalidControl: string | null = null;
  user!: User;
  @Input() landlord!: Landlord;
  @Input() motel!: Motel;
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
    this.getAllConvenient();
  }

  ngOnInit(): void {
    this.getInfoUser();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(()=>{
      if (changes['motel'] ) { 
        this.setInfoIntoForm(this.motel);
      }
    },100)
  }


  ngAfterViewInit(): void {
    this.initializeMap();
    this.updateMotelForm
      .get('address')!
      .valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.getLocation();
      });
    this.updateMotelForm
      .get('wardCommune')!
      .valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.getLocation();
      });
      setTimeout(()=>{
        this.getLocation();
      },100)
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
    this.updateMotelForm = this.formBuilder.group({
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

  setInfoIntoForm(motel: Motel){
    this.updateMotelForm.patchValue({
      nameMotel: motel.NameMotel,
      price: motel.Price,
      address: motel.Address,
      wardCommune: motel.WardCommune,
      description: motel.Description,
      wifiBill: motel.WifiBill ? motel.WifiBill: null ,
      electricityBill:  motel.ElectricityBill,
      waterBill: motel.WaterBill,
      liveWithLandlord: !motel.LiveWithLandlord,
      landlordName: motel.LandlordName,
      phoneNumberContact: motel.PhoneNumberContact,
      addressLandlord: motel.AddressLandlord,
    },
    { emitEvent: false }
    );

    this.listOldImages = [...motel.ListImages]

    // Chuyển đổi danh sách từ motel thành đối tượng cần thiết
    const checkedConvenient = (motel?.ListConvenient || []).map((convenient) => ({
      label: convenient.NameConvenient,
      value: convenient._id,
      checked: true, // Đánh dấu là đã chọn
    }));

    // Khởi tạo danh sách checkConvenient nếu chưa có
    const checkConvenient = this.checkConvenient || [];

    // Tạo Map để hợp nhất danh sách (loại bỏ trùng lặp dựa trên value)
    const convenientMap = new Map<string, { label: string; value: string; checked: boolean }>(
      [...checkConvenient, ...checkedConvenient].map((convenient) => [convenient.value, convenient])
    );

    // Cập nhật lại this.checkConvenient với danh sách hợp nhất
    this.checkConvenient = Array.from(convenientMap.values());

    // Lọc danh sách các tiện nghi đã chọn (checked === true)
    const selectedConvenient = this.checkConvenient
      .filter((convenient) => convenient.checked)
      .map((convenient) => convenient.value);

    // Cập nhật giá trị vào form
    this.updateMotelForm.patchValue({
      listConvenient: selectedConvenient, // Đảm bảo không lặp mảng
    });
  }

  get addressControl() {
    return this.updateMotelForm.get('address');
  }

  get wardCommuneControl() {
    return this.updateMotelForm.get('wardCommune');
  }

  get priceControl() {
    return this.updateMotelForm.get('price');
  }

  get descriptionControl() {
    return this.updateMotelForm.get('description');
  }

  get electricityBillControl() {
    return this.updateMotelForm.get('electricityBill');
  }

  get waterBillControl() {
    return this.updateMotelForm.get('waterBill');
  }

  get landlordNameControl() {
    return this.updateMotelForm.get('landlordName');
  }

  get phoneNumberContactControl() {
    return this.updateMotelForm.get('phoneNumberContact');
  }

  get addressLandlordControl() {
    return this.updateMotelForm.get('addressLandlord');
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
      this.updateMotelForm.get('wifiBill')?.setValue(null);
    }
  }

  getAllConvenient(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.convenientService.getAllConvenient().subscribe(
        (response: Convenient[]) => {
          this.checkConvenient = response.map((convenient) => ({
            label: convenient.NameConvenient,
            value: convenient._id,
            checked: false,
          }));
          resolve(); // Khi thành công
        },
        (error) => {
          console.error('Error fetching conveniences:', error);
          reject(error); // Khi lỗi
        }
      );
    });
  }

  handleUpdateMotel(): void {
    let checkConvenient = this.checkConvenient
    .filter((convenient) => convenient.checked === true)
    .map((convenient) => convenient.value);
    this.updateMotelForm.patchValue({
      listConvenient: [...checkConvenient],
    });

    if (this.updateMotelForm.invalid || (this.listImages.length + this.listOldImages.length) === 0) {
      this.focusFirstInvalidControl(this.updateMotelForm);
      return;
    } 
    else {
      const idMotel = this.motel?._id
      const data = new FormData();
      const formValues = this.updateMotelForm.value;
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
      data.append('listOldImagesRemove', JSON.stringify(this.listOldImagesRemove));
      data.append('location', this.location);
      data.append('distance', this.distance.toString());
      data.append('userID', this.user?._id);
      data.append('landlordID', this.landlord?._id);
      

      this.motelService.updateInfoMotelByID(idMotel, data).subscribe({
        next: (response) => {
          this.hiddenPopupUpdateMotel();
          this.alertService.showSuccess('Cập nhật thành công!', 'Bạn đã cập nhật thành công thông tin nhà trọ');
          this.newMotel.emit(response);
          this.setInfoIntoForm(response);  
          console.log(response);
        },
        error: (error) => {
          this.alertService.showError('Cập nhật mới thất bại!', error.error.message); 
        }
      })
      
    }
  }

  async getLocation(): Promise<void> {
    const street = this.updateMotelForm.get('address')?.value;
    const wardCommune = this.updateMotelForm.get('wardCommune')?.value;
  
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

  hiddenPopupUpdateMotel() {
    const popupUpdateMotel = document.getElementById(
      'popupUpdateMotel'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'auto';
    if (popupUpdateMotel && popupUpdateMotel.classList.contains('flex')) {
      popupUpdateMotel.classList.remove('flex');
      popupUpdateMotel.classList.add('hidden');
    }
    this.updateMotelForm.reset();
    this.listImages = [];
    this.imageUrls = [];
    this.listOldImages = [...this.motel.ListImages];
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const filesArray = Array.from(files); // Chuyển FileList thành mảng
    // Kiểm tra nếu số lượng ảnh đã chọn vượt quá 8
    if (this.listImages.length + this.listOldImages.length  + filesArray.length > 8) {
      this.alertService.showWarning('Cảnh báo!', 'Tổng số lương ảnh của nhà trọ là 8 ảnh!');
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
  removeImageNew(imageUrl: string): void {
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

  removeImageOld(index: number, id: string): void{
    this.listOldImages.splice(index, 1)
    this.listOldImagesRemove.push(id);
  }
}
