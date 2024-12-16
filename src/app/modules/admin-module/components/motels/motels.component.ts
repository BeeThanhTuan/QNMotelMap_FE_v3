import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Motel } from 'src/app/interfaces/motel';
import { AlertService } from 'src/app/services/alert.service';
import { MotelService } from 'src/app/services/motel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-motels',
  templateUrl: './motels.component.html',
  styleUrls: ['./motels.component.css'],
})
export class MotelsComponent {
  listMotels: Motel[] = [];
  currentPage: number = 1;
  motel!: Motel;
  isShowPopupAddMotel = false;
  isShowPopupUpdateMotel = false;
  isShowPopupAddRoomType = false;
  indexUpdate!: number;
  motelID!: string;
  //collection image
  isCollectionImageOpen = false;
  indexMotel = 0;
  indexRoomTypeUpdate = 0;
  currentIndexMotel = 0;

  searchText = '';
  searchControl: FormControl = new FormControl('');
  constructor(
    private motelService: MotelService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.getAllMotels();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Đợi 300ms sau khi người dùng dừng nhập liệu
        distinctUntilChanged() // Chỉ phát tín hiệu khi giá trị thay đổi
      )
      .subscribe((value) => {
        this.searchText = value;
      });
  }

  getAllMotels(): void {
    this.motelService
      .getAllMotels()
      .pipe(
        map((response) => response.data.reverse()) // Reverse the data array
      )
      .subscribe((reversedData) => {
        this.listMotels = reversedData;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  showPopupAddMotel(): void {
    this.isShowPopupAddMotel = true;
    const popupAddMotel = document.getElementById(
      'popupAddMotel'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if (popupAddMotel && popupAddMotel.classList.contains('hidden')) {
      popupAddMotel.classList.remove('hidden');
      popupAddMotel.classList.add('flex');
    }
  }

  showPopupUpdateMotel(motelData: any, index: number): void {
    this.isShowPopupUpdateMotel = true;
    this.indexUpdate = index;
    this.motel = { ...motelData };
    const popupUpdateMotel = document.getElementById(
      'popupUpdateMotel'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if (popupUpdateMotel && popupUpdateMotel.classList.contains('hidden')) {
      popupUpdateMotel.classList.remove('hidden');
      popupUpdateMotel.classList.add('flex');
    }
  }

  showPopupAddRoomType(motelID: string): void {
    this.isShowPopupAddRoomType = true;
    this.motelID = motelID;
    const popupAddRoomType = document.getElementById(
      'popupAddRoomType'
    ) as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if (popupAddRoomType && popupAddRoomType.classList.contains('hidden')) {
      popupAddRoomType.classList.remove('hidden');
      popupAddRoomType.classList.add('flex');
    }
  }

  receiveNewMotelFormAddMotel(data: Motel): void {
    this.listMotels.unshift(data);
  }

  receiveNewMotelFormUpdateMotel(data: Motel): void {
    this.listMotels[this.indexUpdate] = data;
    this.motel = data;
  }

  // Cảnh báo xác nhận xóa mềm nhà trọ
  showSoftDeleteMotelAlert(
    title: string,
    message: string,
    id: string,
    index: number
  ) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#babbbd',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.motelService.softDeleteMotelByID(id).subscribe({
          next: (response) => {
            this.listMotels.splice(index, 1);
            this.alert.showSuccess(
              'Xoá thành công!',
              'Bạn đã xoá thành công nhà trọ.'
            );
          },
          error: (roleError) => {
            this.alert.showError('Lỗi khi xoá!', roleError.error.message);
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  }

  handleOpenCollectionImage(index: number, indexMotel: number) {
    this.isCollectionImageOpen = true;
    this.currentIndexMotel = index;
    this.indexMotel = indexMotel;
  }

  handleCloseCollectionImage() {
    this.isCollectionImageOpen = false;
  }

  nextImage(index: number): void {
    this.currentIndexMotel =
      (this.currentIndexMotel + 1) % this.listMotels[index].ListImages.length;
  }

  prevImage(index: number): void {
    this.currentIndexMotel =
      (this.currentIndexMotel - 1 + this.listMotels[index].ListImages.length) %
      this.listMotels[index].ListImages.length;
  }
}
