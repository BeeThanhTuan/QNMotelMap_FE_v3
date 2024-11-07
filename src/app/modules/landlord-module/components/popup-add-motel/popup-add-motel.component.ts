import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { listWardCommune } from '../../../../other-data/list-ward-commune';
import { Convenient } from 'src/app/interfaces/convenient';
import { ConvenientService } from 'src/app/services/convenient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as L from 'leaflet';
import { debounceTime } from 'rxjs';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: 'app-popup-add-motel',
  templateUrl: './popup-add-motel.component.html',
  styleUrls: ['./popup-add-motel.component.css'],
})
export class PopupAddMotelComponent implements OnInit {
  listImages: NzUploadFile[] = [];
  listWardCommune = listWardCommune;
  addMotelForm!: FormGroup;
  checkConvenient: { label: string; value: string; checked: boolean }[] = [];
  haveWifi = false;
  location!: string;
  firstInvalidControl: string | null = null;
  //map properties
  map!: L.Map;
  constructor(
    private convenientService: ConvenientService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.getAllConvenient();
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

  initializeForm(): void {
    this.addMotelForm = this.formBuilder.group({
      nameMotel: [''],
      address: ['', [Validators.required]],
      price: [null, [Validators.required]],
      wardCommune: ['', [Validators.required]],
      description: ['', [Validators.required]],
      listConvenient: [[]],
      wifiBill: [null],
      electricityBill: [3500, [Validators.required]],
      waterBill: [150000, [Validators.required]],
      liveWithLandlord: [true],
    });
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
      console.table(this.addMotelForm.value);
      console.log(this.listImages);
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
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1`;
    this.spinner.show();
    try {
      // Fetch data with User-Agent header to comply with Nominatim requirements
      const response = await fetch(url);
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length > 0) {
        this.location = `${data[0].lat},${data[0].lon}`;
        console.log('Location:', this.location);
        this.addMarker(this.location)
      } else {
        this.location = '';
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer); // Remove marker if the layer is a marker
          }
        });
        console.log('No results found for the address.');
      }
    } catch (error) {
      console.error('Error fetching geolocation data:', error);
      console.log('Please check your network connection or try again later.');
    } finally {
      this.spinner.hide();
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
    const leafletMarker = L.marker([lat, lng], { icon: normalIcon , draggable: true}).addTo(
      this.map
    );
    this.map.setView([lat, lng], 16); 

    leafletMarker.on('dragend', () => {
      const newLatLng = leafletMarker.getLatLng();
      const newLocation = `${newLatLng.lat},${newLatLng.lng}`;
      this.location = newLocation;  // Update the location with the new coordinates
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
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
