import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { listWardCommune } from '../../../../other-data/list-ward-commune';
import { Convenient } from 'src/app/interfaces/convenient';
import { ConvenientService } from 'src/app/services/convenient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';


interface UploadFileWithPreview extends NzUploadFile {
  preview?: string | ArrayBuffer | null;
}

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
  firstInvalidControl: string | null = null;
  //map properties
  map!: L.Map;
  constructor(
    private convenientService: ConvenientService,
    private formBuilder: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeMap();
    this.getAllConvenient();
  }

  initializeForm(): void {
    this.addMotelForm = this.formBuilder.group({
      nameMotel: [''],
      address: ['', [Validators.required]],
      price: [null, [Validators.required]],
      wardCommune: ['', [Validators.required]],
      description: ['', [Validators.required]],
      listConvenient: [[]],
      wifiBill:[null],
      electricityBill:[3500, [Validators.required]],
      waterBill:[150000, [Validators.required]],
      liveWithLandlord:[true]
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
    this.map = L.map('map').setView([13.7624, 109.21801], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  handleChangeCheckConvenient():void{
    let checkWifi = this.checkConvenient
      .filter((convenient) => (convenient.label=== 'Wifi' && convenient.checked === true))
    if (checkWifi.length > 0) {
      this.haveWifi = true;
      setTimeout(()=>{
        const inputElement = document.getElementById('wifiBill') as HTMLInputElement;
        inputElement.focus();
      })
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
    if (this.addMotelForm.invalid) {
      this.focusFirstInvalidControl(this.addMotelForm); // Gọi hàm để tập trung vào trường đầu tiên không hợp lệ
      return; // Dừng lại nếu form không hợp lệ
    }
    else{
      console.table(this.addMotelForm.value);
      console.log(this.listImages);
      

    }
    
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
}
