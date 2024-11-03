import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { listWardCommune } from '../../../../other-data/list-ward-commune';
import { Convenient } from 'src/app/interfaces/convenient';
import { ConvenientService } from 'src/app/services/convenient.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  fileList: UploadFileWithPreview[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  listWardCommune = listWardCommune;
  addMotelForm!: FormGroup;
  checkConvenients: { label: string; value: string; checked: boolean}[] = []; // Đổi tên biến để phù hợp
  constructor(private convenientService: ConvenientService, private formBuilder: FormBuilder) {
    this.initializeForm();
  }
  
  ngOnInit(): void {
    this.getAllConvenient();
  }

  initializeForm(): void {
    this.addMotelForm = this.formBuilder.group({
      nameMotel: [''],
      address: [''],
      price: [null],
      wardCommune: [''],
      description: [''],
      listConvenient: [[]] 
    });
  }

  getAllConvenient(): void {
    this.convenientService.getAllConvenient().subscribe((response: Convenient[]) => {
      this.checkConvenients = response.map(convenient => ({
        label: convenient.NameConvenient,
        value: convenient._id,
        checked: false
      }));

    });
  }

  handlePreview = async (file: UploadFileWithPreview): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || (file.preview as string);
    this.previewVisible = true;
  };

  handleAddMotel():void{
    let checkConvenients = this.checkConvenients.filter((convenient) => convenient.checked === true).map((convenient) => convenient.value)
    this.addMotelForm.patchValue({
      listConvenient: [...checkConvenients] 
    });
    console.table(this.addMotelForm.value);
    
  }
}
