import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

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
export class PopupAddMotelComponent {
  fileList: UploadFileWithPreview[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: UploadFileWithPreview): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || (file.preview as string);
    this.previewVisible = true;
  };
}
